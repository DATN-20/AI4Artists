import React, { useState } from "react"
import { IoAddCircleOutline, IoCloudDownloadOutline } from "react-icons/io5"

import Image from "next/image"
import {
  Dialog,
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
import { useAddToAlbumMutation } from "@/services/profile/profileApi"
import { AlbumWithImages } from "@/types/profile"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IoEyeOutline } from "react-icons/io5"
import { FaRegEyeSlash } from "react-icons/fa"
import { useChangePublicStatusMutation } from "@/services/generate/generateApi"
import { toast } from "react-toastify"
import { ErrorObject } from "@/types"
interface HistoryCarouselProps {
  generateImgData: Image[] | null
  width?: number
  height?: number
  styleAlbum?: string
  prompt?: string
  album?: AlbumWithImages[] | null
}

const HistoryCarousel: React.FC<HistoryCarouselProps> = ({
  generateImgData,
  width,
  height,
  styleAlbum,
  prompt,
  album,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [isPublic, setIsPublic] = useState<boolean[]>(
    generateImgData?.map((item) => item.visibility) || [],
  )
  const [changeVisibility] = useChangePublicStatusMutation()
  const [addToAlbum] = useAddToAlbumMutation()

  const handleAlbumSelect = (albumId: number) => {
    setSelectedAlbumId(albumId === selectedAlbumId ? null : albumId)
  }
  async function saveImageToDisk(imageUrl: string) {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "image.jpg"
      document.body.appendChild(link)

      link.click()

      URL.revokeObjectURL(blobUrl)

      document.body.removeChild(link)

      toast.success("Image saved successfully!")
    } catch (error) {
      toast.error("Error saving image:" + error)
    }
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

    if ((result as ErrorObject).error) {
      toast.error((result as ErrorObject).error.data.message)
    } else {
      toast.success("Add to album successfully")
    }

    setSelectedAlbumId(null)
  }

  const changePublicStatus = async (imageId: number, index: number) => {
    setIsPublic((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
    changeVisibility(imageId)
  }

  return (
    <>
      <div className="mt-10 flex w-full items-center justify-between gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex min-w-0 justify-start">
              <p className="truncate text-lg font-semibold">{prompt}</p>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] md:max-w-[400px]">
              {prompt}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant={"outline"}
          className="mt-[8px] min-w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700 hover:cursor-default"
        >
          {styleAlbum}
        </Button>
      </div>

      <Dialog>
        <Carousel className="relative mt-5 w-full">
          <CarouselContent>
            {generateImgData &&
              generateImgData.map((item: Image, index: number) => (
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
                          className="rounded-lg"
                        />
                      </CardContent>
                      <div className="absolute inset-0   bg-black bg-opacity-50 pt-5 opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <div className="flex max-w-full items-center justify-end gap-x-2 pr-5">
                          {isPublic[index] ? (
                            <IoEyeOutline
                              size={32}
                              className="cursor-pointer text-white hover:text-primary"
                              onClick={() => changePublicStatus(item.id, index)}
                            />
                          ) : (
                            <FaRegEyeSlash
                              size={32}
                              className="cursor-pointer text-white hover:text-primary"
                              onClick={() => changePublicStatus(item.id, index)}
                            />
                          )}
                          <DialogTrigger asChild>
                            <IoAddCircleOutline
                              size={32}
                              className="cursor-pointer text-white hover:text-primary"
                            />
                          </DialogTrigger>
                          <IoCloudDownloadOutline
                            size={32}
                            className="cursor-pointer text-white hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              saveImageToDisk(item.url)
                            }}
                          />
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
              <DialogHeader>
                <DialogTitle>Add to Album</DialogTitle>
                <DialogDescription>
                  Make changes to your image here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex flex-wrap gap-3">
                {album?.map((albumItem) => (
                  <button
                    key={albumItem.album.id}
                    className={`mr-5 rounded-md px-3 py-2 ${
                      selectedAlbumId === albumItem.album.id
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    } transition-colors hover:bg-primary hover:text-white`}
                    onClick={() => handleAlbumSelect(albumItem.album.id)}
                  >
                    {albumItem.album.name}
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    handleAddToAlbum()
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </CarouselContent>
          {generateImgData && generateImgData.length > 3 && (
            <>
              <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
              <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
            </>
          )}
        </Carousel>
      </Dialog>
    </>
  )
}

export default HistoryCarousel
