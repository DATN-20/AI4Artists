import { DashboardImage } from "@/types/dashboard"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useProcessImageMutation } from "@/services/image/imageApi"
import { ProcessType } from "../../types/Image"
import { useRouter } from "next/navigation"
import { set } from "react-hook-form"
import Loading from "../Loading"
import { Card, CardContent } from "../ui/card"
import { extractCloudinaryId } from "../../lib/cloudinary"
import Image from "next/image"
import { FaHeart } from "react-icons/fa"
import { IconContext } from "react-icons"
import { Label } from "@radix-ui/react-label"
import { useLikeImageMutation } from "@/services/dashboard/dashboardApi"
import { IoPersonCircleSharp } from "react-icons/io5"

interface ImageDetailProps {
  image: DashboardImage
  index: number
  width: number
  height: number
}

const ImageDetail = ({ image, index, width, height }: ImageDetailProps) => {
  const router = useRouter()
  const [processImage, { isLoading, isError, data }] = useProcessImageMutation()
  const [processType, setProcessType] = useState("original")
  const [selectedImage, setSelectedImage] = useState(image.url)
  const [open, setOpen] = useState(false)
  const [likeImage] = useLikeImageMutation()

  useEffect(() => {
    if (!open) {
      setSelectedImage(image.url)
      setProcessType("original")
    }
  }, [open])

  const handleSelectValue = (processType: string) => {
    setProcessType(processType)
    switch (processType) {
      case "original":
        setSelectedImage(image.url)
        break
      case ProcessType.UPSCALE:
        handleOnSelectUpscaleImage()
        break
      case ProcessType.REMOVE_BACKGROUND:
        handleOnSelectRemoveBackground()
        break
      case "edit":
        localStorage.setItem("imageUrl", image.url)
        router.push(`/canvas`)
        break
      case "report":
        // reportImage()
        break
      default:
        break
    }
  }

  const handleOnSelectUpscaleImage = async () => {
    const isUpscale = image.upscale != null && image.upscale !== ""

    if (isUpscale) {
      setSelectedImage(image.upscale)
    } else {
      const result = await processImage({
        processType: ProcessType.UPSCALE,
        imageId: image.id,
      })
      if ("data" in result) {
        setSelectedImage(result?.data.upscale)
      }
    }
  }

  const handleOnSelectRemoveBackground = async () => {
    const isRemoveBackground =
      image.remove_background != null && image.remove_background !== ""

    if (isRemoveBackground) {
      setSelectedImage(image.remove_background)
    } else {
      const result = await processImage({
        processType: ProcessType.REMOVE_BACKGROUND,
        imageId: image.id,
      })
      if ("data" in result) {
        setSelectedImage(result?.data.removeBackground)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <Card className="transform transition-transform duration-300 hover:scale-105 ">
          <CardContent className=" p-0">
            <Image
              width={width}
              height={height}
              key={index}
              className="w-full rounded-lg"
              src={image.url}
              alt={image.prompt}
              loading="lazy"
            />
          </CardContent>
          <div className="absolute inset-0   bg-black bg-opacity-50 pt-10 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <div className="absolute top-0 flex w-full items-center justify-between p-3">
              <div className="flex space-x-2">
                <div>
                  <Image
                    height={0}
                    width={25}
                    className="h-[25px] rounded-full"
                    src={image.url}
                    alt={image.prompt}
                  />
                </div>
                <p className="font-semibold text-white">
                  {image.created_user?.first_name}{" "}
                  {image.created_user?.last_name}
                </p>
              </div>

              <div className="flex w-1/3 items-center justify-between rounded-xl bg-white bg-opacity-20 px-3 py-1">
                <p className="text-white">{image.like_number}</p>
                <FaHeart
                  className={`font-bold ${image.is_liked ? "text-red-500" : ""}  hover:scale-125 hover:transition-transform`}
                  size={20}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 px-1 py-3 text-center text-white">
              <p className="line-clamp-3">Prompt: {image.prompt}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-scroll sm:max-w-[80vw] md:max-w-[60vw]">
        <div className="flex w-full gap-2">
          <div className="flex w-1/2 flex-col gap-2">
            {isLoading ? (
              <Loading />
            ) : isError ? (
              <p>Error</p>
            ) : (
              <img
                src={selectedImage}
                alt={image.prompt}
                className="h-auto w-full rounded-lg"
              />
            )}
            <div className="mt-[8px] flex gap-2">
              <Select
                onValueChange={(value) => {
                  handleSelectValue(value)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Original" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      key="original"
                      value="original"
                      onSelect={() => {
                        setSelectedImage(image.url)
                      }}
                    >
                      Original
                    </SelectItem>
                    <SelectItem
                      key={ProcessType.UPSCALE}
                      value={ProcessType.UPSCALE}
                    >
                      Upscale Image
                    </SelectItem>
                    <SelectItem
                      key={ProcessType.REMOVE_BACKGROUND}
                      value={ProcessType.REMOVE_BACKGROUND}
                    >
                      Remove Background
                    </SelectItem>
                    <SelectItem key="edit" value="edit">
                      Edit In Canvas
                    </SelectItem>
                    <SelectItem key="report" value="report">
                      Report This Image
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="ml-4 flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  {image.created_user?.avatar ? (
                    <a href="/profile">
                      <h1
                        onClick={() => {
                          localStorage.setItem(
                            "guestID",
                            (image.created_user?.id).toString(),
                          )
                        }}
                      >
                        <Image
                          src={image.created_user?.avatar}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </h1>
                    </a>
                  ) : (
                    <a href="/profile">
                      <h1
                        onClick={() => {
                          localStorage.setItem(
                            "guestID",
                            (image.created_user?.id).toString(),
                          )
                        }}
                      >
                        <IoPersonCircleSharp size={40} />
                      </h1>
                    </a>
                  )}
                </div>
                <a href="/profile">
                  <h1
                    onClick={() => {
                      localStorage.setItem(
                        "guestID",
                        (image.created_user?.id).toString(),
                      )
                    }}
                  >
                    {image.created_user?.first_name}{" "}
                    {image.created_user?.last_name}
                  </h1>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{image.like_number}</h1>
                <FaHeart
                  className={`font-bold ${image.is_liked ? "text-red-500" : "hover:scale-125"} cursor-pointer hover:transition-transform`}
                  size={20}
                  onClick={() => {
                    likeImage({ imageId: image.id, type: "like" })
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{image.like_number}</h1>
                <FaHeart
                  className={`font-bold ${image.is_liked ? "text-red-500" : "hover:scale-125"} cursor-pointer hover:transition-transform`}
                  size={20}
                  onClick={() => {
                    likeImage({ imageId: image.id, type: "like"})
                  }}
                />
              </div>
            <h1 className="mt-[16px] text-lg font-semibold">
              This is the Image I created with the new AI
            </h1>
            <h1 className="mt-[8px] font-semibold text-primary-700">
              Prompt Detail
            </h1>
            <div className="mt-[8px] w-full rounded-lg bg-card">
              <p className="p-4">{image.prompt}</p>
            </div>
            <Label className="mt-[8px] flex w-full items-center text-lg font-semibold">
              <div className="w-1/4">Type</div>
              <Button
                variant={"outline"}
                className="w-fit cursor-default rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700 hover:text-primary-700"
              >
                {image.type}
              </Button>
            </Label>
            <div className="mt-[8px] flex items-center gap-5">
              <h1 className="w-1/4 text-lg font-semibold">Style</h1>
              <div className="w-full rounded-lg bg-card">
                <p className="p-4">{image.style}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-4">
              <h1 className="flex-shrink-0 text-lg font-semibold">AI Name</h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{image.ai_name}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-4">
              <h1 className="flex-shrink-0 text-lg font-semibold">
                Created At
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">
                  {new Date(image.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-4">
              <h1 className="flex-shrink-0 text-lg font-semibold">Dimension</h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">
                  {width} x {height}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetail
