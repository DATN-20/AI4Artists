import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ErrorObject, ErrorObjectRegister } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/authSlice';

function getCookie(name: string) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
  prepareHeaders: (headers) => {
    const token = getCookie("token")
    if(token){
      headers.set("Authorization", `Bearer ${getCookie("token")}`);
    }
    return headers;
  },
});

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // const dispatch = useAppDispatch();
  // const router = useRouter();
  function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  const token = getCookie("token")
  if (!token) {
    return {
      error: {
        status: 401,
        data: 'No token found',
      },
    };
  }
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const errorData = JSON.parse((result as ErrorObjectRegister).error.data);
    const errorCode = errorData.error_code;

    if (errorCode === "00004") {
      // Token is invalid, logout user
      localStorage.clear();
      window.location.href = "/";
    } else if (errorCode === "00003") {
      // Token expired, attempt to refresh it
      const refreshResult = await baseQuery({
        url: 'api/v1/auth/refresh-token',
        method: 'POST', // Specify the HTTP method POST
        body: { token: getCookie("token") }
      }, api, extraOptions) as { data: { access_token: string } };

      if (refreshResult.data.access_token) {
        setCookie("token", refreshResult.data.access_token, 1);

        result = await baseQuery(args, api, extraOptions);
        
      } else {
        localStorage.clear();
        window.location.href = "/";
      }
    }
  }

  return result;
};

export default customBaseQuery;
