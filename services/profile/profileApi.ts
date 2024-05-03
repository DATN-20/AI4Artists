import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/",
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
    addToAlbum: builder.mutation<number[], { imageId: number[]; albumId: number }>({
      query: ({ imageId, albumId }) => ({
        url: `/api/v1/album/${albumId}`,
        method: "POST",
        body: { idImage: imageId },
      }),
    }),
    deleteFromAlbum: builder.mutation<number[], { imageId: number[]; albumId: number }>({
      query: ({ imageId, albumId }) => ({
        url: `/api/v1/album/${albumId}`,
        method: "DELETE",
        body: { idImage: imageId },
      }),
    }),
    addNewAlbum: builder.mutation({
      query: ( albumName ) => ({
        url: "/api/v1/album",
        method: "POST",
        body: {name: albumName},
      }),
    }),
    deleteAlbum: builder.mutation<number[], { albumId: number[] }>({
      query: ({ albumId }) => ({
        url: `/api/v1/album`,
        method: "DELETE",
        body: { albumIds: albumId },
      }),
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/me/avatar",
        method: "POST",
        body: formData,
      }),
    }),
  }),
})

export const { useGetProfileMutation, useGetProfileAlbumMutation , useGetTotalImageMutation, useAddToAlbumMutation, useDeleteFromAlbumMutation, useAddNewAlbumMutation, useDeleteAlbumMutation, useUpdateAvatarMutation} = profileApi
