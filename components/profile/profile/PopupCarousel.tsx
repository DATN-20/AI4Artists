import React, { useEffect, useState } from "react"
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import NextImage from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Image } from "@/types/profile"
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
import { IoCloseCircleOutline, IoEyeOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import {
  useDeleteFromAlbumMutation,
  useGetProfileAlbumQuery,
} from "@/services/profile/profileApi"
import { toast } from "react-toastify"
import { setTotalAlbum } from "@/features/authSlice"
import { useAppDispatch } from "@/store/hooks"
import { ErrorObject } from "@/types"
import { useChangePublicStatusMutation } from "@/services/generate/generateApi"
import { FaRegEyeSlash } from "react-icons/fa"

interface PopupCarouselProps {
  generateImgData: Image[] | null
  width?: number
  height?: number
  setSelectedAlbum: (albumId: number) => void
  selectedAlbum: number
  setOpenDialogCarousel: (can: boolean) => void
  getTotalImage: () => void
}

const PopupCarousel: React.FC<PopupCarouselProps> = ({
  generateImgData,
  width,
  height,
  setSelectedAlbum,
  selectedAlbum,
  setOpenDialogCarousel,
  getTotalImage,
}) => {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [deleteFromAlbum] = useDeleteFromAlbumMutation()
  const { data: albumData, refetch: fullInfoRefetch } =
    useGetProfileAlbumQuery()

  const [changeVisibility] = useChangePublicStatusMutation()
  const [isPublic, setIsPublic] = useState<boolean[]>(
    generateImgData?.map((item) => item.visibility) || [],
  )
  const dispatch = useAppDispatch()

  const changePublicStatus = async (imageId: number, index: number) => {
    setIsPublic((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
    changeVisibility(imageId)
    const fetchData = async () => {
      await getTotalImage()
    }
    fetchData()
  }

  const handleDeleteFromAlbum = async () => {
    if (!selectedImageId || !selectedAlbum) {
      return
    }

    const imageIds = Array.isArray(selectedImageId)
      ? selectedImageId
      : [selectedImageId]

    const result = await deleteFromAlbum({
      imageId: imageIds,
      albumId: selectedAlbum,
    })
    const fetchAlbumData = async () => {
      await fullInfoRefetch()
    }
    if ((result as ErrorObject).error) {
      toast.error((result as ErrorObject).error.data.message)
    } else {
      toast.success("Delete from album successfully")
    }
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
              generateImgData.map((item: Image, index: number) => (
                <CarouselItem
                  key={item.id}
                  className="lg:basis-1/3"
                  onClick={() => {
                    setSelectedImageId(item.id)
                  }}
                >
                  <div className="relative flex h-full items-center justify-center p-1">
                    <Card className="transform transition-transform duration-300 hover:scale-105">
                      <CardContent className=" p-0">
                        <NextImage
                          alt="generated image"
                          width={width}
                          height={height}
                          src={item.url}
                          className="rounded-lg"
                        />
                      </CardContent>
                      <div className="absolute inset-0   bg-black bg-opacity-50 pt-5 opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <div className="flex max-w-full justify-end  gap-x-2 pr-5">
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
                            <IoCloseCircleOutline
                              size={32}
                              className="cursor-pointer text-white"
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
                <DialogTitle>
                  Are you sure to remove this image from album?
                </DialogTitle>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    onClick={() => {
                      handleDeleteFromAlbum()
                      setOpenDialogCarousel(false)
                    }}
                  >
                    Yes
                  </Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      setOpenDialogCarousel(false)
                    }}
                    type="button"
                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                {/* </DialogClose> */}
              </DialogFooter>
            </DialogContent>
          </CarouselContent>
          {generateImgData && generateImgData.length > 3 && (
            <>
              <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
              <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
            </>
          )}
        </BaseCarousel>
      </Dialog>
    </>
  )
}

export default PopupCarousel
