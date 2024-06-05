"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContext, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import Image from "next/image"
import { TiTick } from "react-icons/ti"
import { Button } from "@/components/ui/button"

import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import axios from "axios"
import { useGenerateTagsMutation } from "@/services/generate/generateApi"
import { AlbumWithImages, ImageAlbum } from "@/types/profile"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TagsContext } from "@/store/tagsHooks"

const TagsDisplay = () => {
  const { tags, isTagChosens, setTagChosens } = useContext(TagsContext)

  const toggleChecked = (index: number) => () => {
    const newIsTagChosens = [...isTagChosens]
    newIsTagChosens[index] = !newIsTagChosens[index]
    setTagChosens(newIsTagChosens)
  }

  return (
    <div className="flex flex-wrap">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`m-1 flex cursor-pointer select-none content-center items-center gap-3 rounded border-2 border-primary-700 px-2 py-1 text-sm ${isTagChosens[index] ? " bg-primary-700 text-black hover:bg-transparent hover:text-primary-700" : "bg-transparent text-primary-700 hover:bg-primary-700 hover:text-black"}`}
          onClick={toggleChecked(index)}
        >
          {tag}
          {isTagChosens[index] && <TiTick className="size-5" />}
        </span>
      ))}
    </div>
  )
}

const ImageToTag = () => {
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithImages | null>(
    null,
  )
  const dispatch = useAppDispatch()
  const [selectedInputImage, setSelectedInputImage] = useState<File | null>(
    null,
  )
  const [selectedAlbumImage, setSelectedAlbumImage] = useState<File | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const authStates = useAppSelector(selectAuth)
  const [generateTags] = useGenerateTagsMutation()
  const { tags, setTags, initTagChosen, setGenerateTags, isTagChosens } =
    useContext(TagsContext)
  const [divWidth, setDivWidth] = useState("300px")
  const [selectedTab, setSelectedTab] = useState<boolean>(false)
  const [selectedAlbumImageIndex, setSelectedAlbumImageIndex] =
    useState<number>(-1)

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const response = await axios.get(URL.createObjectURL(file), {
      responseType: "blob",
    })
    const imageFile = new File([response.data], "image.jpg", {
      type: response.data.type,
    })
    setSelectedInputImage(imageFile)
  }

  useEffect(() => {
    if (selectedInputImage) {
      const img = document.createElement("img")
      img.src = URL.createObjectURL(selectedInputImage)
      img.onload = () => {
        setDivWidth(`${(img.width / img.height) * 300}px`)
      }
    }
  }, [selectedInputImage])

  useEffect(() => {
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
  }, [])

  useEffect(() => {
    initTagChosen()
  }, [tags])

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
    setSelectedInputImage(file)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAlbumClick = (album: AlbumWithImages) => {
    setSelectedAlbum(album)
  }

  const handleImageSelectFromAlbum = async (
    image: ImageAlbum,
    index: number,
  ) => {
    try {
      const response = await axios.get(image.url, {
        responseType: "blob",
      })
      const imageFile = new File([response.data], "image.jpg", {
        type: response.data.type,
      })
      setSelectedAlbumImage(imageFile)
      setSelectedAlbumImageIndex(index)
    } catch (error: any) {
      toast.error("Error fetching the image file: " + error.message)
    }
  }

  const handleGenerate = async () => {
    const formData = new FormData()
    if (
      (selectedTab && !selectedInputImage) ||
      (!selectedTab && !selectedAlbumImage)
    ) {
      toast.error("Please select an image")
      return
    }

    if (selectedTab) {
      formData.append("image", selectedInputImage!)
    } else {
      formData.append("image", selectedAlbumImage!)
    }
    let result = await generateTags(formData).unwrap()
    setTags(
      (result as string)
        .split(", ")
        .map((keyword) =>
          keyword
            .replace(/_/g, " ")
            .replace(/\\\(/g, "(")
            .replace(/\\\)/g, ")"),
        ),
    )
  }

  const handleTabChange = () => {
    setSelectedTab((prev) => !prev)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader className="hidden" />
      <DialogTrigger className="my-3 flex">
        <Button
          variant={"outline"}
          className="w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
        >
          Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0">
        <div className="mr-8 h-1/2 flex-1">
          <Tabs
            defaultValue="local"
            className="mx-10 flex h-full flex-col"
            onChange={handleTabChange}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="local">Upload </TabsTrigger>
              <TabsTrigger value="album">Album</TabsTrigger>
            </TabsList>
            <TabsContent value="local" className="mb-10 h-full">
              <div className="flex w-full justify-center">
                <div
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ width: divWidth }}
                  className={`mt-5 flex h-[300px] cursor-pointer items-center justify-center space-y-0 rounded-xl ${selectedInputImage ? "border-0" : "border-2"}  rounded-lg border-dashed border-black text-center dark:border-white`}
                >
                  {selectedInputImage ? (
                    <img
                      src={URL.createObjectURL(selectedInputImage)}
                      alt="Selected"
                      className="h-[300px] w-[300px] rounded-lg"
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
                              layout="fill"
                              objectFit="cover"
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
                onClick={handleGenerate}
              >
                Generate tags
              </Button>
            </div>
            {tags.length > 0 && (
              <>
                <div>
                  <h4>Select your tags for positive prompts:</h4>
                  <div className="flex items-center justify-center">
                    {tags && <TagsDisplay />}
                  </div>
                </div>
                <div className="my-5 flex justify-end">
                  <Button
                    variant={"outline"}
                    className=" flex w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
                    onClick={() => {
                      setGenerateTags(
                        tags
                          .filter((_, index) => isTagChosens[index])
                          .join(", "),
                      )
                      setOpen(false)
                    }}
                  >
                    OK
                  </Button>
                </div>
              </>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default ImageToTag
