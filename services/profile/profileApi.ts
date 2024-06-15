import { ImageTotal, Person } from "@/types/profile"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/",
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
          url: "/api/v1/albums/full-info",
          method: "GET",
        }
      },
    }),
    getTotalImage: builder.mutation<ImageTotal[], void>({
      query: () => {
        return {
          url: "/api/v1/images",
          method: "GET",
        }
      },
    }),
    getAlbum: builder.mutation<ImageTotal[], {  albumId: number }>({
      query: ({ albumId }) => ({
        url: `/api/v1/albums/${albumId}/images`,
        method: "GET",
      }),
    }),
    addToAlbum: builder.mutation<number[], { imageId: number[]; albumId: number }>({
      query: ({ imageId, albumId }) => ({
        url: `/api/v1/albums/${albumId}/images`,
        method: "POST",
        body: { imageIds: imageId },
      }),
    }),
    deleteFromAlbum: builder.mutation<number[], { imageId: number[]; albumId: number }>({
      query: ({ imageId, albumId }) => ({
        url: `/api/v1/albums/${albumId}/images`,
        method: "DELETE",
        body: { imageIds: imageId },
        responseHandler: "text"

      }),
    }),
    addNewAlbum: builder.mutation({
      query: ( albumName ) => ({
        url: "/api/v1/albums",
        method: "POST",
        body: {name: albumName},
      }),
    }),
    deleteAlbum: builder.mutation<number[], { albumId: number[] }>({
      query: ({ albumId }) => ({
        url: `/api/v1/albums`,
        method: "DELETE",
        body: { albumIds: albumId },
        responseHandler: "text"

      }),
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/me/avatar",
        method: "POST",
        body: formData,
      }),
    }),
    updateBackground: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/me/background",
        method: "POST",
        body: formData,
      }),
    }),
    updateProfile: builder.mutation({
      query: (body: {
        firstName: string | undefined
        aliasName: string | undefined
        lastName: string | undefined
        socials: { socialName: string; socialLink: string }[] | undefined
        
      }) => ({
        url: "/api/v1/users/me",
        method: "PUT",
        body,
      }),
    }),
    getGuestImage: builder.mutation({
      query: ({ id, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (page) searchParams.append("page", page)
        if (limit) searchParams.append("limit", limit)

        return {
          url: `api/v1/images/user/${id}?${searchParams}&type=LATEST`,
          method: "GET",
        }
      },
    }),
    getGuestProfile: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/api/v1/users/${id}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const { useGetProfileMutation, useGetProfileAlbumMutation , useGetTotalImageMutation, useAddToAlbumMutation, useDeleteFromAlbumMutation, useAddNewAlbumMutation, useDeleteAlbumMutation, useUpdateAvatarMutation, useUpdateBackgroundMutation, useUpdateProfileMutation, useGetGuestImageMutation, useGetGuestProfileMutation, useGetAlbumMutation} = profileApi
