import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const generateApi = createApi({
  reducerPath: "generateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
    prepareHeaders(headers){
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    }

  }),
  endpoints: (builder) => ({
    // generateImage: builder.mutation({
    //   query: (body: { email: string; password: string }) => {
    //     return {
    //       url: "api/v1/generate-image/ai-info",
    //       method: "get",
    //       body,
    //     };
    //   }
    // }),
    aiInformation: builder.mutation({
      query: () => {
        return {
          url: "api/v1/generate-image/ai-info",
          method: "get",
        };
      }
    })
  })
});

export const { useAiInformationMutation } = generateApi;
