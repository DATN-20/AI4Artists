import React, { useEffect, useState } from "react"
import NextImage from "next/image"
import { IoAddCircleOutline, IoEyeOutline } from "react-icons/io5"
import { AlbumData, Image } from "@/types/profile"
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
  useGetProfileAlbumQuery,
} from "@/services/profile/profileApi"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAppDispatch } from "@/store/hooks"
import { setTotalAlbum } from "@/features/authSlice"
import { ErrorObject } from "@/types"
import { useChangePublicStatusMutation } from "@/services/generate/generateApi"
import { FaRegEyeSlash } from "react-icons/fa"

interface CarouselProps {
  generateImgData: Image[] | null
  width?: number
  height?: number
  album?: AlbumData[] | null
  getTotalImage: () => void
}

const ProfileCarousel: React.FC<CarouselProps> = ({
  generateImgData,
  width,
  height,
  album,
  getTotalImage,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [closeDialog, setCloseDialog] = useState<boolean>(false)
  const [isPublic, setIsPublic] = useState<boolean[]>(
    generateImgData?.map((item) => item.visibility) || [],
  )
  const [addToAlbum] = useAddToAlbumMutation()
  const { data: albumData, refetch: fullInfoRefetch } =
    useGetProfileAlbumQuery()
  const dispatch = useAppDispatch()

  const handleAlbumSelect = (albumId: number) => {
    setSelectedAlbumId(albumId === selectedAlbumId ? null : albumId)
  }
  const [changeVisibility] = useChangePublicStatusMutation()

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
      await fullInfoRefetch()
    }
    if ((result as ErrorObject).error) {
      toast.error((result as ErrorObject).error.data.message)
    } else {
      toast.success("Add to album successfully")
    }
    setSelectedAlbumId(null)
    fetchAlbumData()
  }

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  const changePublicStatus = async (imageId: number, index: number) => {
    // setIsPublic((prev) => {
    //   const newState = [...prev]
    //   newState[index] = !newState[index]
    //   return newState
    // })
    changeVisibility(imageId)
    const fetchAlbumData = async () => {
      await fullInfoRefetch()
      await getTotalImage()
    }
    fetchAlbumData()
  }

  return (
    <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
      {generateImgData && generateImgData.length > 0 ? (
        <Carousel className="relative mt-3 w-full">
          <CarouselContent>
            {generateImgData.map((item: any, index: number) => (
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
                      <NextImage
                        alt="generated image"
                        width={width}
                        height={height}
                        src={item.url}
                        className="rounded-lg"
                      />
                    </CardContent>
                    <div className="absolute inset-0   bg-black bg-opacity-50 pt-5 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <div className="flex max-w-full justify-end gap-x-2  pr-5">
                        {item.visibility ? (
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
                        <IoAddCircleOutline
                          size={32}
                          className="cursor-pointer "
                          color="white"
                          onClick={() => {
                            setCloseDialog(true)
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
                {album && album.length > 0 ? (
                  album.map((albumItem) => (
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
                  ))
                ) : (
                  <p>No albums found</p>
                )}
              </div>
              <DialogFooter className="mt-4 flex justify-between">
                {album && album.length > 0 ? (
                  <Button
                    type="submit"
                    className="rounded-md px-4 py-2 text-white focus:outline-none"
                    onClick={() => {
                      handleAddToAlbum()
                      setCloseDialog(false)
                    }}
                  >
                    Save changes
                  </Button>
                ) : (
                  <></>
                )}

                <DialogClose>
                  <Button
                    onClick={() => {
                      setCloseDialog(false)
                    }}
                    type="button"
                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none"
                  >
                    Cancel
                  </Button>
                </DialogClose>
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
      ) : (
        <p>No images found</p>
      )}
    </Dialog>
  )
}

export default ProfileCarousel
