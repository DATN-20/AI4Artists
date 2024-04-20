import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ProcessType } from "../../types/Image"

export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/",
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
  }),
  tagTypes: ["processImage"],
  endpoints: (builder) => ({
    processImage: builder.mutation<any, any>({
      query: ({
        processType,
        imageId,
      }: {
        processType: ProcessType
        imageId: number
      }) => {
        return {
          url: `/api/v1/images/${imageId}/image-processing`,
          method: "POST",
          body: { processType: processType },
        }
      },
      invalidatesTags: ["processImage"],
    }),
  }),
})

export const { useProcessImageMutation } = imageApi
