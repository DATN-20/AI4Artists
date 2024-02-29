import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const generateApi = createApi({
  reducerPath: "generateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/"

  }),
  endpoints: (builder) =>({
    generateImage: builder.mutation({
      query: (body:{email:string; password:string}) =>{
        return{
          url: "api/v1/auth/signin",
          method: "post",
          body,
        }
      }
    })
    ,
    
  })
})

export const {useGenerateImageMutation, } = generateApi;
