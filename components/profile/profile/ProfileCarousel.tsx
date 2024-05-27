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
      <Carousel className="relative mt-3 w-full">
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
                <div className="relative flex h-full items-center justify-center p-1 ">
                  <Card className="transform transition-transform duration-300 hover:scale-105 ">
                    <CardContent className=" p-0">
                      <Image
                        alt="generated image"
                        width={width}
                        height={height}
                        src={item.url}
                        className="rounded-lg"
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
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 px-1 py-3 text-center text-white">
                        <p className="line-clamp-3">Prompt: {item.prompt}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg font-semibold">
                Add to Album
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Add this image to an album. Click "Save changes" when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {album?.map((albumItem) => (
                <Button
                  key={albumItem.album.id}
                  type="button"
                  className={`rounded-md px-3 py-2 ${
                    selectedAlbumId === albumItem.album.id
                      ? "bg-violet-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } transition-colors hover:bg-violet-600 hover:text-white focus:outline-none`}
                  onClick={() => handleAlbumSelect(albumItem.album.id)}
                >
                  {albumItem.album.name}
                </Button>
              ))}
            </div>
            <DialogFooter className="mt-4 flex justify-between">
              <Button
                type="submit"
                className="rounded-md px-4 py-2 text-white focus:outline-none"
                onClick={() => {
                  handleAddToAlbum()
                }}
              >
                Save changes
              </Button>
              <DialogClose>
                <Button
                  type="button"
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
        <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
      </Carousel>
    </Dialog>
  )
}

export default ProfileCarousel
