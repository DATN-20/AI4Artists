"use client"

import NavigationSideBar from "@/components/sidebar/NavigationSideBar"
import { Facebook, Home, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { CiViewList } from "react-icons/ci"
import { IoImages } from "react-icons/io5"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs"
import NextImage from "next/image"
import ProfileCarousel from "@/components/dashboard/ProfileCarousel"
import { useEffect, useState } from "react"
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
import { setTotalAlbum, setTotalImage, setUserData } from "@/features/authSlice"
import Loading from "@/components/Loading"

const Profile = () => {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
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
        <div className="flex gap-4 py-4 ">
          <div className="hidden lg:block lg:min-w-[300px]">
            <NavigationSideBar />
          </div>
          <div className="mr-8 h-full flex-1">
            <Tabs defaultValue="introduction">
              <div className="relative mb-4 flex flex-col">
                <div className="h-[164px] rounded-2xl bg-gray-500 bg-[url('https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg')]"></div>
                <div className=" absolute bottom-0 left-3 h-[128px] w-[128px] rounded-full ">
                  <NextImage
                    height={128}
                    width={128}
                    className="h-full w-full rounded-full"
                    alt=""
                    src="https://4kwallpapers.com/images/wallpapers/viper-valorant-agent-2732x2732-9539.jpg"
                  ></NextImage>
                </div>
                <div className="ml-[140px] flex items-center justify-between px-2 pt-2">
                  <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">
                      {userData?.firstName + " " + userData?.lastName}
                    </h1>
                    <p className="text-lg font-light">{userData?.aliasName}</p>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="mb-5 flex">
                      {userData?.socials.map((item: any, index: number) => {
                        if (item.social_name === "facebook") {
                          return (
                            <a
                              href={item.social_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Facebook
                                key={index}
                                size={24}
                                className="ml-4 cursor-pointer"
                              />
                            </a>
                          )
                        } else if (item.social_name === "instagram") {
                          return (
                            <a
                              href={item.social_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Instagram
                                key={index}
                                size={24}
                                className="ml-4 cursor-pointer"
                              />
                            </a>
                          )
                        }
                        return null
                      })}
                    </div>

                    <TabsList className="flex justify-end gap-2 bg-inherit">
                      <TabsTrigger value="introduction" className="px-0 py-0">
                        <IoImages size={24} />
                      </TabsTrigger>
                      <TabsTrigger value="profile" className="ml-3 px-0 py-0">
                        <CiViewList size={26} />
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </div>
              <TabsContent value="introduction">
                <h1 className=" text-2xl font-bold">Your Images</h1>
                {imagesData && (
                  <ProfileCarousel
                    generateImgData={imagesData}
                    width={width}
                    height={height}
                  />
                )}

                <h1 className="mb-5 mt-10 text-2xl font-bold">Your Albums</h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {albumData?.map((item: any, index: number) => (
                    <Card key={index} className="relative flex justify-center">
                      <div className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
                        {item.images && item.images.length > 0 ? (
                          item.images
                            .slice(0, 4)
                            .map((image: any, imageIndex: number) => (
                              <div key={imageIndex} className="relative h-40">
                                <Image
                                  src={image.image.url}
                                  alt={`Image ${imageIndex + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              </div>
                            ))
                        ) : (
                          <p>No images available</p>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                          <p className="text-center text-white">
                            Album: {item.album.name}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="profile">
                <ProfileContent />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
