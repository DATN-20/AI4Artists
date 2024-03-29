import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body: { email: string; password: string }) => {
        return {
          url: "api/v1/auth/signin",
          method: "post",
          body,
        };
      },
    }),
    registerUser: builder.mutation({
      query: (body: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
      }) => {
        return {
          url: "api/v1/auth/signup",
          method: "post",
          body,
          responseHandler: "text"

        };
      },
      
      
    }),
    verifyUser: builder.mutation({
      query: (body: {
        token: string;
      }) => {
        return {
          url: "api/v1/auth/signup/verify",
          method: "get",
          responseHandler: "text",
          params:body
        };
      },
      
      
    }),
  }),
  
});

export const { useLoginUserMutation, useRegisterUserMutation, useVerifyUserMutation } = authApi;
