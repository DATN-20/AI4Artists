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
import ProfileCarousel from "@/components/dashboard/ProfileCarousel"
import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { useSelector } from "react-redux"
import { selectGenerate } from "@/features/generateSlice"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import ProfileContent from "../../../components/profile/profile/ProfileContent"

const Profile = () => {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const [generateImgData, setGenerateImgData] = useState<string[] | null>([
    "https://images.nightcafe.studio/jobs/KT9epXSL64glQXmXwWBK/KT9epXSL64glQXmXwWBK--1--rfvqe.jpg?tr=w-1600,c-at_max",
    "https://images.nightcafe.studio/jobs/KT9epXSL64glQXmXwWBK/KT9epXSL64glQXmXwWBK--1--rfvqe.jpg?tr=w-1600,c-at_max",
    "https://images.nightcafe.studio/jobs/KT9epXSL64glQXmXwWBK/KT9epXSL64glQXmXwWBK--1--rfvqe.jpg?tr=w-1600,c-at_max",
    "https://images.nightcafe.studio/jobs/KT9epXSL64glQXmXwWBK/KT9epXSL64glQXmXwWBK--1--rfvqe.jpg?tr=w-1600,c-at_max",
    "https://images.nightcafe.studio/jobs/KT9epXSL64glQXmXwWBK/KT9epXSL64glQXmXwWBK--1--rfvqe.jpg?tr=w-1600,c-at_max",
  ])
  const { width, height } = generateStates.dataInputs || {}
  return (
    <div className="flex gap-4 py-4 ">
      <div className="hidden lg:block lg:min-w-[300px]">
        <NavigationSideBar />
      </div>
      <div className="mr-8 h-full flex-1">
        <Tabs defaultValue="introduction">
          <div className="relative mb-4 flex flex-col">
            <div className="h-[164px] rounded-2xl bg-gray-500"></div>
            <div className=" absolute bottom-0 left-3 h-[128px] w-[128px] rounded-full bg-pink-400"></div>
            <div className="ml-[140px] flex items-center justify-between px-2 pt-2">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">Username</h1>
                <p className="text-lg font-light">nickname</p>
              </div>
              <div className="flex flex-col justify-end">
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
            <h1 className=" text-2xl font-bold">Popular Images</h1>
            <ProfileCarousel
              generateImgData={generateImgData}
              width={512}
              height={512}
            />

            <h1 className="mb-5 mt-10 text-2xl font-bold">Your Albums</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="relative flex justify-center">
                <div className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
                  {generateImgData && generateImgData.length > 0 ? (
                    generateImgData.slice(0, 4).map((imageUrl, index) => (
                      <div key={index} className="relative h-40">
                        <Image
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
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
                    <p className="text-center text-white">Image Overlay</p>
                  </div>
                </div>
              </Card>
              <Card className="relative flex justify-center">
                <div className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
                  {generateImgData && generateImgData.length > 0 ? (
                    generateImgData.slice(0, 4).map((imageUrl, index) => (
                      <div key={index} className="relative h-40">
                        <Image
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
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
                    <p className="text-center text-white">Image Overlay</p>
                  </div>
                </div>
              </Card>
              <Card className="relative flex justify-center">
                <div className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
                  {generateImgData && generateImgData.length > 0 ? (
                    generateImgData.slice(0, 4).map((imageUrl, index) => (
                      <div key={index} className="relative h-40">
                        <Image
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
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
                    <p className="text-center text-white">Image Overlay</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="profile">
            <ProfileContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile
