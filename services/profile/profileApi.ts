import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.mutation({
      query: () => {
        return {
          url: "/api/v1/users/me",
          method: "GET",
        }
      },
    }),
    getProfileAlbum: builder.mutation({
      query: () => {
        return {
          url: "/api/v1/album/full-info",
          method: "GET",
        }
      },
    }),
    getTotalImage: builder.mutation({
      query: () => {
        return {
          url: "/api/v1/images",
          method: "GET",
        }
      },
    }),
  }),
})

export const { useGetProfileMutation, useGetProfileAlbumMutation , useGetTotalImageMutation} = profileApi
