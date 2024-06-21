import { AllDashboardImageResponse } from "@/types/dashboard"
import { AlbumData, Image, Person } from "@/types/profile"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<Person,void>({
      query: () => {
        return {
          url: "/api/v1/users/me",
          method: "GET",
        }
      },
    }),
    getProfileAlbum: builder.query<AlbumData[], void>({
      query: () => {
        return {
          url: "/api/v1/albums/full-info",
          method: "GET",
        }
      },
    }),
    getTotalImage: builder.query<Image[], void>({
      query: () => {
        return {
          url: "/api/v1/images",
          method: "GET",
        }
      },
    }),
    getAlbum: builder.query<Image[], {  albumId: number }>({
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
        responseHandler: "text"

      }),
    }),
    updateBackground: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/me/background",
        method: "POST",
        body: formData,
        responseHandler: "text"

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
    getGuestImage: builder.query<AllDashboardImageResponse, {
      id: string
      page: number
      limit: number}>({
      query: ({ id, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (page) searchParams.append("page", page.toString())
        if (limit) searchParams.append("limit", limit.toString())

        return {
          url: `api/v1/images/user/${id}?${searchParams}&type=LATEST`,
          method: "GET",
        }
      },
    }),
    getGuestProfile: builder.query<Person, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/api/v1/users/${id}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const { useGetProfileQuery, useGetProfileAlbumQuery , useGetTotalImageQuery, useAddToAlbumMutation, useDeleteFromAlbumMutation, useAddNewAlbumMutation, useDeleteAlbumMutation, useUpdateAvatarMutation, useUpdateBackgroundMutation, useUpdateProfileMutation, useGetGuestImageQuery, useGetGuestProfileQuery, useGetAlbumQuery} = profileApi
