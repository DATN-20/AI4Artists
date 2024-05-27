import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/",
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllDashboardImage: builder.query({
      query: ({ type, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (type) searchParams.append("type", type)
        if (page) searchParams.append("page", page)
        if (limit) searchParams.append("limit", limit)

        return {
          url: `api/v1/images/dashboard?${searchParams}`,
          method: "GET",
        }
      },
    }),
    likeImage: builder.mutation<any, any>({
      query: ({
        imageId,
        type,
      }: {
        type: string
        imageId: number
      }) => {
        return {
          url: `/api/v1/images/interact`,
          method: "POST",
          body: { imageId: imageId, type: type },
        }
      }
    }),
    getSearchImage: builder.query({
      query: ({ query , page, limit }) => {
        const searchParams = new URLSearchParams()
        if (query) searchParams.append("query", query)
        if (page) searchParams.append("page", page)
        if (limit) searchParams.append("limit", limit)

        return {
          url: `api/v1/images/search-prompt?${searchParams}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const { useGetAllDashboardImageQuery, useGetSearchImageQuery, useLikeImageMutation } = dashboardApi
