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
import { setField } from "@/features/generateSlice"
import { toast } from "react-toastify"
import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import Image from "next/image"
import axios from "axios"

const DynamicImageInput = ({ name, type }: { name: string; type: string }) => {
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null)
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const authStates = useAppSelector(selectAuth)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const imageGen = files[0]
      setSelectedImage(imageGen)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          dispatch(setField({ field: "image", value: base64String }))
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

  const handleImageSelectFromAlbum = async (image: any) => {
    try {
      const response = await axios.get(image.image.url, {
        responseType: "blob",
      })
      const imageFile = new File([response.data], "image.jpg", {
        type: response.data.type,
      })
      setSelectedImage(imageFile)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          dispatch(setField({ field: "image", value: base64String }))
        }
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      console.error("Error fetching the image file: ", error)
    }

    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="array-mode" className="text-lg font-semibold">
          {name}
        </Label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button
              variant={"outline"}
              className="w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
            >
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContentLoginModal
            className="flex h-[80vh] min-h-[80vh] w-[80vw] min-w-[80vw] flex-col border-none p-0"
            style={{ borderRadius: 30 }}
          >
            <DialogHeader className="mt-12 flex w-full items-center space-y-0">
              <h2 className="text-2xl font-semibold">Add Image</h2>
            </DialogHeader>
            <Tabs defaultValue="local" className="mx-10 flex h-full flex-col">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="local">Upload </TabsTrigger>
                <TabsTrigger value="album">Album</TabsTrigger>
              </TabsList>
              <TabsContent value="local" className="mb-10 h-full">
                <div
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="mt-5 flex h-full cursor-pointer items-center justify-center space-y-0 rounded-xl border-2 border-dashed border-black p-5 text-center dark:border-white"
                >
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="mx-auto max-h-[512px] max-w-[512px]"
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
                  <div className="mt-3 grid grid-cols-4 gap-4 p-1">
                    {selectedAlbum.images &&
                      selectedAlbum.images.map(
                        (image: any, imageIndex: number) => (
                          <div
                            key={imageIndex}
                            className="relative h-40 cursor-pointer"
                            onClick={() => handleImageSelectFromAlbum(image)}
                          >
                            <Image
                              src={image.image.url}
                              alt={`Image ${imageIndex + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        ),
                      )}
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-4 gap-4 p-1">
                    {authStates?.totalAlbum?.map(
                      (album: any, index: number) => (
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
                              .map((image: any, imageIndex: number) => (
                                <div key={imageIndex} className="relative h-40">
                                  <Image
                                    src={image.image.url}
                                    alt={`Image ${imageIndex + 1}`}
                                    layout="fill"
                                    objectFit="cover"
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
              <div className="my-5 flex justify-end">
                <Button
                  variant={"outline"}
                  className=" flex w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
                  onClick={() => setOpen(false)}
                >
                  Save Changes
                </Button>
              </div>
            </Tabs>
          </DialogContentLoginModal>
        </Dialog>
      </div>
      {selectedImage && (
        <Image
          src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
          alt="Selected"
          className="h-[512px] w-full rounded-xl object-cover"
          width={512}
          height={512}
        />
      )}
    </div>
  )
}

export default DynamicImageInput
