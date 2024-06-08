"use client"
import Canvas from "../canvas/Canvas"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContentLoginModal,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import OptionSelect from "../canvas/OptionSelect"
import ToolSelect from "../canvas/ToolSelect"
import {
  selectGenerate,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useContext, useEffect, useState, useRef } from "react"
import { SaveChangesButton } from "../canvas/tools/SaveChangesButton"
import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import Image from "next/image"
import axios from "axios"
import { AlbumWithImages, ImageAlbum } from "@/types/profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const ControlnetDialog = ({
  type,
  isStyleGenerate,
}: {
  type: string
  isStyleGenerate?: boolean
}) => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { imageFile } = canvasModeContext!
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const authStates = useAppSelector(selectAuth)
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
                ArrayIndex: 0,
              }),
            )
          } else {
            dispatch(setField({ field: type, value: base64String }))
          }
        }
      }
      reader.readAsDataURL(imageGen)
    }
  }

  useEffect(() => {
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
  }, [])

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
                ArrayIndex: 0,
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

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          dispatch(setField({ field: "controlNetImages", value: base64String }))
        }
      }
      reader.readAsDataURL(imageFile)
      setSelectedImage(imageFile)
    }
  }, [imageFile])

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        {!selectedImage && (
          <DialogTrigger>
            <Button
              variant={"outline"}
              className="w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
            >
              Add Controlnet Image
            </Button>
          </DialogTrigger>
        )}
        <DialogContentLoginModal
          className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0"
          style={{ borderRadius: 30 }}
        >
          <Tabs
            defaultValue="local"
            className="mx-10 flex h-full w-full flex-col pt-14"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="local">Upload</TabsTrigger>
              <TabsTrigger value="album">Album</TabsTrigger>
              <TabsTrigger value="draw">Draw</TabsTrigger>
            </TabsList>
            <TabsContent
              value="local"
              className="no-scrollbar mb-10 mt-5 h-full w-full overflow-scroll"
            >
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className=" flex h-full w-full cursor-pointer items-center justify-center space-y-0 rounded-xl border-2 border-dashed border-black p-5 text-center dark:border-white"
              >
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="mx-auto h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <p className="dark:text-white">
                    Drag & drop an image here or click to select one
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
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
                        (image: ImageAlbum, imageIndex: number) => (
                          <div
                            key={imageIndex}
                            className="relative h-40 cursor-pointer transition-opacity duration-300 hover:opacity-50"
                            onClick={() =>
                              handleImageSelectFromAlbum(image, imageIndex)
                            }
                          >
                            <Image
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
                    (album: AlbumWithImages, index: number) => (
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
                            .map((image: ImageAlbum, imageIndex: number) => (
                              <div key={imageIndex} className="relative h-40">
                                <Image
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
            <TabsContent value="draw">
              <Canvas />
              <div className="flex w-full lg:p-2">
                <div className="ml-20 mr-16 w-10/12">
                  <div className="flex h-[650px] w-[1000px] items-center justify-center"></div>
                  <OptionSelect />
                </div>

                <div className="z-10  flex h-full w-1/12 flex-col items-center justify-center gap-12">
                  <div className="rounded-lg bg-card px-4 dark:bg-white">
                    <ToolSelect />
                  </div>
                  <SaveChangesButton open={open} setOpen={setOpen} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContentLoginModal>
      </Dialog>
      {selectedImage && (
        <Image
          src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
          alt="Selected"
          className="w-full rounded-xl object-cover"
          width={512}
          height={512}
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  )
}

export default ControlnetDialog
