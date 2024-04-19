"use client"

import NavigationSideBar from "@/components/sidebar/NavigationSideBar"
import { Facebook, Home, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { CiViewList } from "react-icons/ci"
import { IoImages, IoArrowBackOutline } from "react-icons/io5"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs"
import NextImage from "next/image"
import ProfileCarousel from "@/components/dashboard/ProfileCarousel"
import { MouseEventHandler, useEffect, useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { useSelector } from "react-redux"
import { selectGenerate } from "@/features/generateSlice"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import ProfileContent from "../../../components/profile/profile/ProfileContent"
import {
  useGetProfileAlbumMutation,
  useGetProfileMutation,
  useGetTotalImageMutation,
} from "@/services/profile/profileApi"
import {
  selectAuth,
  setTotalAlbum,
  setTotalImage,
  setUserData,
} from "@/features/authSlice"
import Loading from "@/components/Loading"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlbumWithImages } from "@/types/profile"
import PopupCarousel from "@/components/profile/profile/PopupCarousel"
import ProfileHeader from "@/components/profile/profile/ProfileHeader"
import AlbumCard from "@/components/profile/profile/AlbumCard"

const Profile = () => {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const authStates = useSelector(selectAuth)
  const [selectedAlbum, setSelectedAlbum] = useState(-1)
  const [getUser, { data: userData }] = useGetProfileMutation()
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const [getTotalImage, { data: imagesData }] = useGetTotalImageMutation()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      await getUser(undefined)
    }
    fetchUserData()
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
    const fetchUserImages = async () => {
      await getTotalImage(undefined)
    }
    fetchUserImages()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (userData) {
      dispatch(setUserData({ userData: userData }))
    }
  }, [userData])

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  useEffect(() => {
    if (imagesData) {
      dispatch(setTotalImage({ totalImage: imagesData }))
    }
  }, [imagesData])

  const [generateImgData, setGenerateImgData] = useState<string[] | null>(null)
  const { width, height } = generateStates.dataInputs || {}
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Dialog>
          <div className="flex gap-4 py-4 ">
            <div className="hidden lg:block lg:min-w-[300px]">
              <NavigationSideBar />
            </div>
            <div className="mr-8 h-full flex-1">
              <Tabs
                defaultValue="introduction"
                onValueChange={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                <ProfileHeader userData={userData} />
                <TabsContent value="introduction">
                  <h1 className=" text-2xl font-bold">Your Images</h1>
                  {imagesData && (
                    <ProfileCarousel
                      generateImgData={imagesData}
                      width={width}
                      height={height}
                    />
                  )}

                  <TabsList className="mb-5 bg-transparent">
                    <TabsTrigger value="album" className="text-white">
                      <div className="text-white">
                        <h1 className="text-2xl font-bold">Your Albums</h1>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {albumData?.map((album: any, index: number) => (
                      <AlbumCard
                        key={index}
                        albumData={album}
                        width={width}
                        height={height}
                        setSelectedAlbum={setSelectedAlbum}
                        selectedAlbum={selectedAlbum}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="profile">
                  <ProfileContent imagesData={imagesData} />
                </TabsContent>
                <TabsContent value="album">
                  <div className="min-h-96 rounded-lg bg-zinc-900">
                    <div className="mb-5 flex">
                      <div>
                        <TabsList className=" bg-transparent">
                          <TabsTrigger
                            value="introduction"
                            className="text-white"
                          >
                            <h1 className=" text-2xl font-bold">
                              <IoArrowBackOutline />
                            </h1>
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <div className=" flex items-center justify-center text-2xl font-bold">
                        Albums
                      </div>
                    </div>
                    {albumData?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="mb-10 "
                        onClick={() => {
                          setSelectedAlbum(item.album.id - 1)
                        }}
                      >
                        <div className="mb-5 ml-5">
                          Album: {item.album.name}
                        </div>
                        <div className="grid grid-cols-1 gap-2 bg-zinc-900 pl-5 pr-5 md:grid-cols-4">
                          {item.images && item.images.length > 0 ? (
                            <>
                              {item.images
                                .slice(0, 3)
                                .map((image: any, imageIndex: number) => (
                                  <div className="relative" key={imageIndex}>
                                    <div className="flex justify-center bg-zinc-900">
                                      <Image
                                        src={image.image.url}
                                        alt={`Image ${imageIndex + 1}`}
                                        width={width}
                                        height={height}
                                        className="max-h-full rounded-md"
                                      />
                                    </div>
                                  </div>
                                ))}
                              <div className="relative">
                                {item.images.length > 4 && (
                                  <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-75 text-white">
                                    <DialogTrigger asChild>
                                      <p className="text-lg">See all</p>
                                    </DialogTrigger>
                                    <DialogContent className=" lg:min-w-[950px]">
                                      {authStates.totalAlbum &&
                                        selectedAlbum !== -1 && (
                                          <PopupCarousel
                                            generateImgData={
                                              (
                                                authStates.totalAlbum as AlbumWithImages[]
                                              )[selectedAlbum]?.images
                                            }
                                            width={width}
                                            height={height}
                                          />
                                        )}
                                    </DialogContent>
                                  </div>
                                )}

                                <Image
                                  src={item.images[3].image.url}
                                  alt=""
                                  width={width}
                                  height={height}
                                  className="max-h-full rounded-md"
                                />
                              </div>
                            </>
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default Profile
