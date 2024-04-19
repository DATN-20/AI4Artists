import React, { useEffect, useState } from "react"

import Image from "next/image"
import { IoAddCircleOutline } from "react-icons/io5"
import { AlbumWithImages, ImageTotal } from "@/types/profile"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  useAddToAlbumMutation,
  useGetProfileAlbumMutation,
} from "@/services/profile/profileApi"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAppDispatch } from "@/store/hooks"
import { setTotalAlbum } from "@/features/authSlice"

interface CarouselProps {
  generateImgData: ImageTotal[] | null
  width?: number
  height?: number
  album?: AlbumWithImages[] | null
}

const ProfileCarousel: React.FC<CarouselProps> = ({
  generateImgData,
  width,
  height,
  album,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [addToAlbum] = useAddToAlbumMutation()
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const dispatch = useAppDispatch()

  const handleAlbumSelect = (albumId: number) => {
    setSelectedAlbumId(albumId === selectedAlbumId ? null : albumId)
  }

  const handleAddToAlbum = async () => {
    console.log("image:", selectedImageId)
    console.log("album:", selectedAlbumId)
    if (!selectedImageId || !selectedAlbumId) {
      return
    }

    const imageIds = Array.isArray(selectedImageId)
      ? selectedImageId
      : [selectedImageId]

    const result = await addToAlbum({
      imageId: imageIds,
      albumId: selectedAlbumId,
    })
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }

    toast.success("Add to album successfully")
    setSelectedAlbumId(null)
    fetchAlbumData()
  }

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  return (
    <Dialog>
      <Carousel className="relative mt-5 w-full">
        <CarouselContent>
          {generateImgData &&
            generateImgData.map((item: any) => (
              <CarouselItem
                key={item.id}
                className="lg:basis-1/3"
                onClick={() => {
                  setSelectedImageId(item.id)
                }}
              >
                <div className="relative p-1">
                  <Card className="transform transition-transform duration-300 hover:scale-105">
                    <CardContent className="flex items-center justify-center p-0">
                      <Image
                        alt="generated image"
                        width={width}
                        height={height}
                        src={item.url}
                      />
                    </CardContent>
                    <div className="absolute inset-0   bg-black bg-opacity-50 pt-10 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <div className="flex max-w-full justify-end pr-5">
                        <DialogTrigger asChild>
                          <IoAddCircleOutline
                            size={32}
                            className="cursor-pointer"
                          />
                        </DialogTrigger>
                      </div>
                      <div className="flex  flex-col items-center justify-center pt-10">
                        <p className="mb-5 text-center text-white">
                          Prompt: {item.prompt}
                        </p>
                        <p className="mb-5 text-center text-white">
                          Style: {item.style}
                        </p>
                        <p className="mb-5 text-center text-white">
                          AI: {item.aiName}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Album</DialogTitle>
              <DialogDescription>
                Add this image to album. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="">
              {album?.map((albumItem) => (
                <button
                  key={albumItem.album.id}
                  className={`mr-5 rounded-md px-3 py-2 ${
                    selectedAlbumId === albumItem.album.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } transition-colors hover:bg-blue-600 hover:text-white`}
                  onClick={() => handleAlbumSelect(albumItem.album.id)}
                >
                  {albumItem.album.name}
                </button>
              ))}
            </div>
            <DialogFooter>
              {/* <DialogClose asChild> */}
              <Button
                type="submit"
                className="bg-grey border-inherit	"
                onClick={() => {
                  handleAddToAlbum()
                }}
              >
                Save changes
              </Button>
              <DialogClose asChild>
                <Button type="button" className="bg-grey border-inherit	">
                  Close
                </Button>
              </DialogClose>
              {/* </DialogClose> */}
            </DialogFooter>
          </DialogContent>
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform" />
        <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform" />
      </Carousel>
    </Dialog>
  )
}

export default ProfileCarousel
