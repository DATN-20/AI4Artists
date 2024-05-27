"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useSelector } from "react-redux"
import { selectGenerate, setField } from "@/features/generateSlice"
import Image from "next/image"

import { Button } from "@/components/ui/button"

import NavigationSideBarCard from "@/components/sidebar/card/NavigationSideBarCard"
import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import axios from "axios"
import { useGenerateTagsMutation } from "@/services/generate/generateApi"

const Tags = () => {
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null)
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const authStates = useAppSelector(selectAuth)
  const [generateTags] = useGenerateTagsMutation()

  const base64ToFile = async (
    base64: string,
    filename: string,
  ): Promise<File> => {
    const response = await fetch(base64)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  // useEffect(() => {
  //   if (defaultValue) {
  //     base64ToFile(defaultValue, "defaultImage.jpg").then((file) => {
  //       setSelectedImage(file)
  //     })
  //   }
  // }, [defaultValue])
  const generateStates = useSelector(selectGenerate)
  const [generateTagsData, setGenerateTagsData] = useState<string[] | null>(
    null,
  )

  function base64StringToFile(base64String: string, filename: string): File {
    const byteString = atob(base64String.split(",")[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: "image/jpeg" })
    return new File([blob], filename)
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

  const handleGenerate = async () => {
    const formData = new FormData()
    let result
    let imageData

    if (generateStates.dataInputs) {
      generateStates.dataInputs.forEach((input) => {
        const { name, value } = input

        if (name === "image") {
          const imageInput = generateStates.dataInputs?.find(
            (input: any) => input.name === "image",
          )
          if (imageInput) {
            const base64String = (imageInput as any).value
            if (base64String) {
              const filename = "image.jpg"
              imageData = base64StringToFile(base64String, filename)
              formData.append("image", imageData)
              return
            }
          }
        }
      })

      try {
        if (imageData) {
          result = await generateTags(formData).unwrap()
          setGenerateTagsData(result)
        } else {
          console.error("No image data available.")
        }
      } catch (error) {
        console.error("Error generating image:", error)
      }
    } else {
      console.error("No data inputs available.")
    }
  }
  return (
    <>
      <div className="flex gap-4 py-4">
        <div className="hidden lg:block lg:min-w-[300px]">
          <div className="no-scrollbar fixed left-0 top-0 flex h-screen min-h-screen w-[300px] flex-col gap-4 overflow-y-scroll p-4">
            <NavigationSideBarCard />
          </div>
        </div>
        <div className="mr-8 h-full flex-1">
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
                  {authStates?.totalAlbum?.map((album: any, index: number) => (
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
                  ))}
                </div>
              )}
            </TabsContent>
            <div className="my-5 flex justify-end">
              <Button
                variant={"outline"}
                className=" flex w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
                onClick={() => {
                  setOpen(false)
                  handleGenerate()
                }}
              >
                Generate tags
              </Button>
            </div>
            {selectedImage && (
              <div className="flex items-center justify-center	">
                <Image
                  src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
                  alt="Selected"
                  className="h-[512px]  rounded-xl object-cover"
                  width={512}
                  height={512}
                />
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </>
  )
}
export default Tags
