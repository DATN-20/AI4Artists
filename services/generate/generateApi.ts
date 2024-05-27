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
    aiStyleInformation: builder.mutation({
      query: () => {
        return {
          url: "/api/v1/generate-image/ai-generate-by-images-style-info",
          method: "GET",
        }
      },
    }),
    textToImage: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/generate-image/text-to-image",
        method: "POST",
        body: formData,
      }),
    }),
    imageToImage: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/generate-image/image-to-image",
        method: "POST",
        body: formData,
      }),
    }),
    getGenerationHistory: builder.mutation({
      query: () => {
        return {
          url: "api/v1/images/generate-history",
          method: "get",
        }
      },
    }),
    changePublicStatus: builder.mutation({
      query: (imageId: number) => ({
        url: `/api/v1/images/visibility/${imageId}`,
        method: "PATCH",
      }),
    }),
    generateTags: builder.mutation({
      query: (formData) => ({
        url: `/api/v1/generate-tag`,
        method: "POST",
        body: formData,
      }),
    }),
    getNotifications: builder.query<any, void>({
      query: () => ({
        url: "/api/v1/notifications",
        method: "GET",
      }),
    }),
    changeNotificationStatus: builder.mutation({
      query: (notificationId: number) => ({
        url: `/api/v1/notifications/${notificationId}/change-status`,
        method: "PATCH",
      }),
    }),
    generateStyleImage: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/generate-image/image-by-images-style",
        method: "POST",
        body: formData,
      }),
    }),
  }),
})

export const {
  useAiInformationMutation,
  useAiStyleInformationMutation,
  useTextToImageMutation,
  useImageToImageMutation,
  useGetGenerationHistoryMutation,
  useChangePublicStatusMutation,
  useGetNotificationsQuery,
  useChangeNotificationStatusMutation,
  useGenerateStyleImageMutation,
  useGenerateTagsMutation
} = generateApi
