"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContentLoginModal,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog"
import { Label } from "../../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setField, setStyleField } from "@/features/generateSlice"
import { useGetProfileAlbumQuery } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import NextImage from "next/image"
import axios from "axios"
import { AlbumData, Image } from "@/types/profile"

const DynamicImageInputSpecial = ({
  name,
  type,
  defaultValue,
  isStyleGenerate,
  arrayIndex,
}: {
  name: string
  type: string
  defaultValue?: string
  isStyleGenerate?: boolean
  arrayIndex?: number
}) => {
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null)
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: albumData } = useGetProfileAlbumQuery()
  const authStates = useAppSelector(selectAuth)
  const [selectedInputImage, setSelectedInputImage] = useState<File | null>(
    null,
  )
  const [selectedAlbumImage, setSelectedAlbumImage] = useState<File | null>(
    null,
  )
  const [selectedAlbumImageIndex, setSelectedAlbumImageIndex] =
    useState<number>(-1)

  const base64ToFile = async (
    base64: string,
    filename: string,
  ): Promise<File> => {
    const response = await fetch(base64)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  useEffect(() => {
    if (defaultValue) {
      base64ToFile(defaultValue, "defaultImage.jpg").then((file) => {
        setSelectedImage(file)
      })
    }
  }, [defaultValue])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const imageGen = files[0]
      setSelectedImage(imageGen)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          if (isStyleGenerate) {
            dispatch(
              setStyleField({
                field: type,
                value: base64String,
                ArrayIndex: arrayIndex,
              }),
            )
          } else {
            dispatch(setField({ field: "image", value: base64String }))
          }
        }
      }
      reader.readAsDataURL(imageGen)
    }
  }

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    setSelectedImage(file)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAlbumClick = (album: any) => {
    setSelectedAlbum(album)
  }

  const handleImageSelectFromAlbum = async (image: any, index: number) => {
    try {
      const response = await axios.get(image.url, {
        responseType: "blob",
      })
      const imageFile = new File([response.data], "image.jpg", {
        type: response.data.type,
      })
      setSelectedImage(imageFile)
      setSelectedAlbumImageIndex(index)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()

        if (base64String) {
          if (isStyleGenerate) {
            dispatch(
              setStyleField({
                field: type,
                value: base64String,
                ArrayIndex: arrayIndex,
              }),
            )
          } else {
            dispatch(setField({ field: "image", value: base64String }))
          }
        }
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      console.error("Error fetching the image file: ", error)
    }

    setOpen(false)
  }

  return (
    <div className="flex h-full w-full items-center justify-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="h-full w-full">
          {!selectedImage && (
            <div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-black dark:border-white">
              Add Image
            </div>
          )}
        </DialogTrigger>
        <DialogContentLoginModal
          className="flex h-[80vh] max-h-[80vh] w-[80vw] min-w-[80vw] flex-col border-none p-0"
          style={{ borderRadius: 30 }}
        >
          <DialogHeader className="mt-12 flex w-full items-center space-y-0">
            <h2 className="text-2xl font-semibold">Add Image</h2>
          </DialogHeader>
          <Tabs
            defaultValue="local"
            className="mx-10 flex h-full max-h-full flex-col"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="local">Upload </TabsTrigger>
              <TabsTrigger value="album">Album</TabsTrigger>
            </TabsList>
            <TabsContent
              value="local"
              className=" mb-10 h-full max-h-full pt-5"
            >
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex h-full max-h-fit cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-black p-5 text-center caret-transparent dark:border-white"
              >
                {selectedImage ? (
                  <div className="relative h-full w-full">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="absolute inset-0 h-full w-full rounded-xl object-contain"
                    />
                  </div>
                ) : (
                  <p className="dark:text-white">
                    Drag & drop an image here or click to select one
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="pointer-events-none hidden"
                  ref={fileInputRef}
                  placeholder="Upload an image"
                />
              </div>
            </TabsContent>
            <TabsContent value="album">
              {selectedAlbum ? (
                <>
                  <div className="mt-3 grid h-[300px] grid-cols-4 gap-4 p-1">
                    {selectedAlbum.images &&
                      selectedAlbum.images.map(
                        (image: Image, imageIndex: number) => (
                          <div
                            key={imageIndex}
                            className="relative h-40 cursor-pointer transition-opacity duration-300 hover:opacity-50"
                            onClick={() =>
                              handleImageSelectFromAlbum(image, imageIndex)
                            }
                          >
                            <NextImage
                              src={image.url}
                              alt={`Image ${imageIndex + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                              className={`rounded-md ${selectedAlbumImageIndex === imageIndex ? "border-2 border-primary-500 opacity-50" : ""}`}
                            />
                          </div>
                        ),
                      )}
                  </div>
                  <Button
                    variant={"outline"}
                    className=" flex w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
                    onClick={() => setSelectedAlbum(null)}
                  >
                    Back
                  </Button>
                </>
              ) : (
                <div className="mt-3 grid h-[300px] grid-cols-4 gap-4 p-1">
                  {authStates?.totalAlbum?.map(
                    (album: AlbumData, index: number) => (
                      <div
                        key={index}
                        className={`relative grid h-full w-full gap-1 ${
                          album.images && album.images.length === 0
                            ? "grid-cols-1 grid-rows-1"
                            : "grid-cols-2 grid-rows-2"
                        }`}
                        onClick={() => handleAlbumClick(album)}
                      >
                        {album.images &&
                          album.images.length > 0 &&
                          album.images
                            .slice(0, 4)
                            .map((image: Image, imageIndex: number) => (
                              <div key={imageIndex} className="relative h-40">
                                <NextImage
                                  src={image.url}
                                  alt={`Image ${imageIndex + 1}`}
                                  fill
                                  style={{ objectFit: "cover" }}
                                  className="rounded-md"
                                />
                              </div>
                            ))}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                          <p className="text-center text-white">
                            Album: {album.album.name}
                          </p>
                        </div>
                        {album.images && album.images.length === 0 && (
                          <div className="mt-20 flex max-h-full max-w-full justify-center">
                            No images available
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContentLoginModal>
      </Dialog>
      {selectedImage && (
        <NextImage
          src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
          alt="Selected"
          className="h-full w-full rounded-xl object-cover"
          width={512}
          height={512}
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  )
}

export default DynamicImageInputSpecial
