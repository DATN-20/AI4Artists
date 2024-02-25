import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/"

  }),
  endpoints: (builder) =>({
    loginUser: builder.mutation({
      query: (body:{email:string; password:string}) =>{
        return{
          url: "api/v1/auth/signin",
          method: "post",
          body,
        }
      }
    }),
    registerUser: builder.mutation({
      query: (body:{email:string; username:string; password:string;}) =>{
        return{
          url: "signup",
          method: "post",
          body,
        }
      }
    }),
  })
})

export const {useLoginUserMutation, useRegisterUserMutation} = authApi;
