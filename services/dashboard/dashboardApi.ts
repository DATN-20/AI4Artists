import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
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
    
  }),
})

export const { useGetAllDashboardImageQuery } = dashboardApi
