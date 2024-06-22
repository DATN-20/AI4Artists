"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContext, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import NextImage from "next/image"
import { TiTick } from "react-icons/ti"
import { Button } from "@/components/ui/button"

import { useGetProfileAlbumQuery } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import axios from "axios"
import { useGenerateTagsMutation } from "@/services/generate/generateApi"
import { AlbumData, Image } from "@/types/profile"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TagsContext } from "@/store/tagsHooks"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import Loading from "../Loading"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

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
          <TiTick
            className={`size-5 ${isTagChosens[index] ? "visible" : "invisible"}`}
          />
        </span>
      ))}
    </div>
  )
}

const ImageToTag = () => {
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null)
  const dispatch = useAppDispatch()
  const [selectedInputImage, setSelectedInputImage] = useState<File | null>(
    null,
  )
  const [selectedAlbumImage, setSelectedAlbumImage] = useState<File | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: albumData } = useGetProfileAlbumQuery()
  const authStates = useAppSelector(selectAuth)
  const [
    generateTags,
    { isLoading: isGeneratingTags, isSuccess: isTagsGenerated },
  ] = useGenerateTagsMutation()
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

  const handleAlbumClick = (album: AlbumData) => {
    setSelectedAlbum(album)
  }

  const handleImageSelectFromAlbum = async (image: Image, index: number) => {
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
      (selectedTab && !selectedAlbumImage) ||
      (!selectedTab && !selectedInputImage)
    ) {
      toast.error("Please select an image")
      return
    }

    if (selectedTab) {
      formData.append("image", selectedAlbumImage!)
    } else {
      formData.append("image", selectedInputImage!)
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

  useEffect(() => {
    if (open) {
      setSelectedTab(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="my-3 flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              <Button
                variant={"default"}
                className="w-fit select-none rounded-lg border-[2px] border-black bg-transparent px-6 py-2 font-bold hover:border-primary-700 hover:bg-transparent hover:text-primary-700 dark:border-white dark:hover:border-primary-700"
              >
                Tags
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-[200px] md:max-w-[300px]"
            >
              Use this option to generate tags from an image to use for positive
              prompts
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0">
        <div className="mr-8 h-1/2 flex-1">
          <Tabs
            defaultValue="local"
            className="mx-10 flex h-full flex-col"
            onValueChange={handleTabChange}
          >
            <TabsList className="mt-10 grid grid-cols-2 bg-black dark:bg-white">
              <TabsTrigger
                value="local"
                className={
                  selectedTab == true
                    ? "hover:text-primary-700"
                    : "font-bold dark:text-white"
                }
              >
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="album"
                className={
                  selectedTab == false
                    ? "hover:text-primary-700"
                    : "font-bold dark:text-white"
                }
              >
                Album
              </TabsTrigger>
            </TabsList>
            <TabsContent value="local" className="h-[300px]">
              <div className="flex w-full justify-center">
                <div
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ width: divWidth }}
                  className={`mt-5 flex h-[300px] cursor-pointer items-center justify-center space-y-0 rounded-xl hover:opacity-50 ${selectedInputImage ? "border-0" : "border-2"}  rounded-lg border-dashed border-black text-center dark:border-white`}
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
            <TabsContent value="album" className="h-[300px]">
              {authStates?.totalAlbum && authStates.totalAlbum.length > 0 ? (
                selectedAlbum ? (
                  <>
                    <Carousel className="relative mx-3 mt-5">
                      <CarouselContent>
                        {selectedAlbum.images &&
                          selectedAlbum.images.map(
                            (image: Image, imageIndex: number) => (
                              <CarouselItem
                                key={imageIndex}
                                className="relative me-2 ml-4 h-[300px] cursor-pointer p-0 transition-opacity duration-300 hover:opacity-50 lg:basis-[300px]"
                                onClick={() =>
                                  handleImageSelectFromAlbum(image, imageIndex)
                                }
                              >
                                <NextImage
                                  src={image.url}
                                  alt={`Image ${imageIndex + 1}`}
                                  fill
                                  sizes="25"
                                  style={{ objectFit: "cover" }}
                                  className={`rounded-md ${
                                    selectedAlbumImageIndex === imageIndex
                                      ? "border-2 border-primary-500 opacity-50"
                                      : ""
                                  }`}
                                />
                              </CarouselItem>
                            ),
                          )}
                      </CarouselContent>
                      {selectedAlbum.images.length > 3 && (
                        <>
                          <CarouselPrevious className="absolute left-0 top-1/2 z-20 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
                          <CarouselNext className="absolute right-0 top-1/2 z-20 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
                        </>
                      )}
                    </Carousel>
                    <Button
                      variant={"outline"}
                      className="relative z-50 mt-6 flex w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
                      onClick={() => setSelectedAlbum(null)}
                    >
                      Back
                    </Button>
                  </>
                ) : (
                  <Carousel className="relative mt-5 w-full">
                    <CarouselContent>
                      {authStates.totalAlbum.map(
                        (album: AlbumData, index: number) =>
                          album.images &&
                          album.images.length > 0 && (
                            <CarouselItem
                              key={index}
                              className="relative grid h-[300px] w-1/4 gap-1 lg:basis-[300px]"
                              onClick={() => handleAlbumClick(album)}
                            >
                              <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-lg border-2 border-white">
                                {album.images
                                  .slice(0, 4)
                                  .map((image: Image, imageIndex: number) => (
                                    <div key={imageIndex} className="relative">
                                      <NextImage
                                        src={image.url}
                                        alt={`Image ${imageIndex + 1}`}
                                        fill
                                        sizes="25"
                                        style={{ objectFit: "cover" }}
                                        className="rounded-md"
                                      />
                                    </div>
                                  ))}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:cursor-pointer hover:opacity-100">
                                <p className="text-center text-white">
                                  {album.album.name}
                                </p>
                              </div>
                            </CarouselItem>
                          ),
                      )}
                    </CarouselContent>
                    {authStates.totalAlbum.filter(
                      (album) => album.images.length > 0,
                    ).length > 3 && (
                      <>
                        <CarouselPrevious className="absolute left-0 top-1/2 z-20 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
                        <CarouselNext className="absolute right-0 top-1/2 z-20 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
                      </>
                    )}
                  </Carousel>
                )
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center">
                  No albums available
                </div>
              )}
            </TabsContent>
            <div className="my-5 flex justify-end">
              <Button
                variant={"default"}
                className="my-6 flex w-fit select-none rounded-xl border-[2px] border-black bg-gradient-to-br from-sky-300 to-primary-700 to-60% px-6 font-bold hover:text-white dark:hover:text-black"
                onClick={handleGenerate}
                disabled={isGeneratingTags}
              >
                {isGeneratingTags ? (
                  <>
                    <svg
                      className="mr-2  h-5 w-5 animate-spin text-primary-700"
                      viewBox="0 0 25 25"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth={4}
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Generate tags</span>
                )}
              </Button>
            </div>
            {tags.length > 0 && (
              <>
                <div>
                  <h4>Select your tags for positive prompts:</h4>
                  <div className="mt-4 flex items-center justify-start">
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
                    Confirm tags
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
