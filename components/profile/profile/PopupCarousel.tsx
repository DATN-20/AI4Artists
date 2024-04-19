import React, { useEffect, useState } from "react"
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ImageAlbum, ImageTotal } from "@/types/profile"
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
import { IoCloseCircleOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import {
  useDeleteFromAlbumMutation,
  useGetProfileAlbumMutation,
} from "@/services/profile/profileApi"
import { toast } from "react-toastify"
import { setTotalAlbum } from "@/features/authSlice"
import { useAppDispatch } from "@/store/hooks"

interface PopupCarouselProps {
  generateImgData: ImageAlbum[] | null
  width?: number
  height?: number
  setSelectedAlbum: (albumId: number) => void
  selectedAlbum: number
}

const PopupCarousel: React.FC<PopupCarouselProps> = ({
  generateImgData,
  width,
  height,
  setSelectedAlbum,
  selectedAlbum,
}) => {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [deleteFromAlbum] = useDeleteFromAlbumMutation()
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const dispatch = useAppDispatch()

  const handleDeleteFromAlbum = async () => {
    console.log("image:", selectedImageId)
    console.log("album:", selectedAlbum + 1)

    if (!selectedImageId || !(selectedAlbum + 1)) {
      return
    }

    const imageIds = Array.isArray(selectedImageId)
      ? selectedImageId
      : [selectedImageId]

    const result = await deleteFromAlbum({
      imageId: imageIds,
      albumId: selectedAlbum + 1,
    })
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }

    toast.success("Delete from album successfully")
    fetchAlbumData()
  }

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])
  return (
    <>
      <Dialog>
        <BaseCarousel className="relative mt-5 w-full ">
          <CarouselContent>
            {generateImgData &&
              generateImgData.map((item: any) => (
                <CarouselItem
                  key={item.image.id}
                  className="lg:basis-1/3"
                  onClick={() => {
                    setSelectedImageId(item.image.id)
                  }}
                >
                  <div className="relative p-1">
                    <Card className="transform transition-transform duration-300 hover:scale-105">
                      <CardContent className="flex items-center justify-center p-0">
                        <Image
                          alt="generated image"
                          width={width}
                          height={height}
                          src={item.image.url}
                        />
                      </CardContent>
                      <div className="absolute inset-0   bg-black bg-opacity-50 pt-10 opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <div className="flex max-w-full justify-end pr-5">
                          <DialogTrigger asChild>
                            <IoCloseCircleOutline
                              size={32}
                              className="cursor-pointer"
                            />
                          </DialogTrigger>
                        </div>
                        <div className="flex  flex-col items-center justify-center pt-10">
                          <p className="mb-5 text-center text-white">
                            Prompt: {item.image.prompt}
                          </p>
                          <p className="mb-5 text-center text-white">
                            Style: {item.image.style}
                          </p>
                          <p className="mb-5 text-center text-white">
                            AI: {item.image.aiName}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Are you sure to remove this image from album?
                </DialogTitle>
              </DialogHeader>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-grey border-inherit	"
                  onClick={() => {
                    handleDeleteFromAlbum()
                  }}
                >
                  Yes
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
        </BaseCarousel>
      </Dialog>
    </>
  )
}

export default PopupCarousel
