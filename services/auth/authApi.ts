import { ErrorObject } from "@/types";
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
          url: "/api/v1/auth/signin",
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
          url: "/api/v1/auth/signup",
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
          url: "/api/v1/auth/signup/verify",
          method: "get",
          responseHandler: "text",
          params:body
        };
      },
    }),
    forgetPasswordUser: builder.mutation<string | ErrorObject, {email: string}>({
      query: (body: {
        email: string;
      }) => {
        return {
          url: "/api/v1/auth/forget-password",
          method: "post",
          body
        };
      },
    }),
    resetPasswordUser: builder.mutation<string | ErrorObject, {password: string, token: string}>({
      query: ({ password, token }) => {
        return {
          url: `/api/v1/auth/forget-password/change-password`,
          method: 'post',
          body: { password, token },
        };
      },
    }),    
    logoutUser: builder.mutation({
      query: (user: {
          id: number
      }) => {
        return {
          url: "/api/v1/auth/signout",
          method: "post",
          responseHandler: "text",
          params:user
        };
      },
    }),
  }),
  
});

export const { useLoginUserMutation, useRegisterUserMutation, useVerifyUserMutation, useLogoutUserMutation, useForgetPasswordUserMutation, useResetPasswordUserMutation } = authApi;
