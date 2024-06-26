import { DashboardImageGroup } from "@/types/dashboard"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import customBaseQuery from "../customBaseQuery"

export const generateApi = createApi({
  reducerPath: "generateApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    aiInformation: builder.query<AIConfig[], void>({
      query: () => {
        return {
          url: "/api/v1/generate-image/ai-info",
          method: "GET",
        }
      },
    }),
    aiStyleInformation: builder.query<AIConfig[], void>({
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
    getGenerationHistory: builder.query<ImageGroup[], void>({
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
        responseHandler: "text",
      }),
    }),
    getNotifications: builder.query<NotificationInfo[], void>({
      query: () => ({
        url: "/api/v1/notifications",
        method: "GET",
      }),
    }),
    changeNotificationStatus: builder.mutation({
      query: (notificationId: number) => ({
        url: `/api/v1/notifications/${notificationId}/change-status`,
        method: "PATCH",
        responseHandler: "text",
      }),
    }),
    getNotificationImage: builder.query<DashboardImageGroup, string | null>({
      query: (generationId: string) => ({
        url: `/api/v1/images/generate-history/${generationId}`,
        method: "GET",
      }),
    }),
    deleteAllNotifications: builder.mutation<string, void>({
      query: () => ({
        url: "/api/v1/notifications",
        method: "DELETE",
        responseHandler: "text",
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
  useAiInformationQuery,
  useAiStyleInformationQuery,
  useTextToImageMutation,
  useImageToImageMutation,
  useGetGenerationHistoryQuery,
  useChangePublicStatusMutation,
  useGetNotificationsQuery,
  useChangeNotificationStatusMutation,
  useGetNotificationImageQuery,
  useGenerateStyleImageMutation,
  useGenerateTagsMutation,
  useDeleteAllNotificationsMutation,
} = generateApi
