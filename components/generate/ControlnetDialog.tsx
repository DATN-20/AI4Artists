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
import NextImage from "next/image"
import {
  selectGenerate,
  setControlNetField,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useContext, useEffect, useState, useRef } from "react"
import { SaveChangesButton } from "../canvas/tools/SaveChangesButton"
import { useGetProfileAlbumQuery } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import Image from "next/image"
import axios from "axios"
import { AlbumData, ImageAlbum } from "@/types/profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { base64StringToFile } from "@/lib/base64StringToFile"
import { IoIosClose } from "react-icons/io"
import { IoCloudUploadOutline } from "react-icons/io5"
import { FaDrawPolygon } from "react-icons/fa"

const ControlnetDialog = ({
  type,
  isStyleGenerate,
  defaultValue,
  arrayIndex,
}: {
  type: string
  isStyleGenerate?: boolean
  defaultValue?: string
  arrayIndex?: number
}) => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { imageFile, setImageFile } = canvasModeContext!
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [openLocal, setOpenLocal] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(
    defaultValue ? base64StringToFile(defaultValue, "image.jpg") : null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: albumData, refetch: fullInfoRetch } = useGetProfileAlbumQuery()
  const authStates = useAppSelector(selectAuth)
  const [selectedAlbumImageIndex, setSelectedAlbumImageIndex] =
    useState<number>(-1)

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
            dispatch(setField({ field: type, value: base64String }))
          }
          dispatch(
            setControlNetField({
              field: type,
              value: base64String,
              ArrayIndex: arrayIndex,
            }),
          )
          setOpenLocal(false)
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
    setOpenLocal(false)
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

    setOpenLocal(false)
  }

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          dispatch(
            setControlNetField({
              field: type,
              value: base64String,
              ArrayIndex: arrayIndex,
            }),
          )
        }
      }
      reader.readAsDataURL(imageFile)
      setSelectedImage(imageFile)
      setImageFile(null)
    }
  }, [imageFile])

  const handleCloseChosenImage = () => {
    setSelectedImage(null)
    setImageFile(null)
    dispatch(
      setControlNetField({
        field: type,
        value: "",
        ArrayIndex: 0,
      }),
    )
  }

  return (
    <div className="flex h-48 flex-col items-center justify-center">
      <>
        {!selectedImage && <div>Choose source of image</div>}
        <Dialog open={openLocal} onOpenChange={setOpenLocal}>
          <DialogTrigger>
            {!selectedImage && (
              <Button
                variant={"outline"}
                className="my-4 w-48 rounded-xl border-[2px] px-6 font-bold text-primary-700"
              >
                <div className="flex items-center gap-3">
                  <IoCloudUploadOutline size={25} />
                  Device or Album
                </div>
              </Button>
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
                    {authStates?.totalAlbum
                      ?.filter(
                        (album: AlbumData) =>
                          album.images && album.images.length > 0,
                      )
                      ?.map((album: AlbumData, index: number) => (
                        <div
                          key={index}
                          className={`relative grid gap-1 ${
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
                                <div key={imageIndex} className="relative">
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
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContentLoginModal>
        </Dialog>

        <Dialog open={open} onOpenChange={setOpen}>
          {!selectedImage && (
            <DialogTrigger>
              <Button
                variant={"outline"}
                className="w-48 rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
              >
                <div className="flex items-center gap-3">
                  <FaDrawPolygon size={20} />
                  Custom canvas
                </div>
              </Button>
            </DialogTrigger>
          )}
          <DialogContentLoginModal
            className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0"
            style={{ borderRadius: 30 }}
          >
            <Canvas />
            <OptionSelect />
            <ToolSelect />
            <SaveChangesButton open={open} setOpen={setOpen} />
          </DialogContentLoginModal>
        </Dialog>
        {selectedImage && (
          <div className="relative">
            <Image
              src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
              alt="Selected"
              className="rounded-xl object-cover"
              width={200}
              height={200}
              style={{ width: 200, height: 200 }}
            />
            <IoIosClose
              className="absolute right-[-5px] top-[-10px] size-4 cursor-pointer rounded-full bg-red-500 text-sm text-white hover:bg-red-300"
              onClick={handleCloseChosenImage}
            />
          </div>
        )}
      </>
    </div>
  )
}

export default ControlnetDialog
