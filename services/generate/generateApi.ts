import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const generateApi = createApi({
  reducerPath: "generateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
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
          url: "/api/v1/generate-image/ai-info",
          method: "GET",
        }
      },
    }),
    textToImage: builder.mutation({
      query: (body: {
        aiName: string | undefined
        positivePrompt: string | undefined
        negativePrompt: string | undefined
        style: string | undefined
        width: number | undefined
        height: number | undefined
        numberOfImage: number | undefined
        steps: number | undefined
        sampleMethod: string | undefined
        cfg: number | undefined
        noise: number | undefined
      }) => ({
        url: "/api/v1/generate-image/text-to-image",
        method: "POST",
        body,
      }),
    }),
    imageToImage: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/generate-image/image-to-image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
})

export const {
  useAiInformationMutation,
  useTextToImageMutation,
  useImageToImageMutation,
} = generateApi
