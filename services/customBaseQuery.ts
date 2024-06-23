import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ErrorObject, ErrorObjectRegister } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
  prepareHeaders: (headers) => {
    headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
    return headers;
  },
});

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // const dispatch = useAppDispatch();
  // const router = useRouter();

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
        body: { token: localStorage.getItem("token") }
      }, api, extraOptions) as { data: { access_token: string } };

      if (refreshResult.data.access_token) {
        localStorage.setItem("token", refreshResult.data.access_token);

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
