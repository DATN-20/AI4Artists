import React, { useState } from "react"
import { IoAddCircleOutline } from "react-icons/io5"

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
  const [addToAlbum] = useAddToAlbumMutation()

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
    setSelectedAlbumId(null)
  }
  return (
    <>
      <div className="mt-10 flex w-full items-center justify-between gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              <p className="truncate text-lg font-semibold">{prompt}</p>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] md:max-w-[400px]">
              {prompt}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant={"outline"}
          className="mt-[8px] min-w-[100px] rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
        >
          {styleAlbum}
        </Button>
      </div>

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
              <DialogHeader>
                <DialogTitle>Add to Album</DialogTitle>
                <DialogDescription>
                  Make changes to your image here. Click save when you're done.
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
          <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform" />
          <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform" />
        </Carousel>
      </Dialog>
    </>
  )
}

export default HistoryCarousel