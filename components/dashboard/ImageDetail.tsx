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
import Loading from "../Loading"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { FaHeart } from "react-icons/fa"
import { Label } from "@radix-ui/react-label"
import { useLikeImageMutation } from "@/services/dashboard/dashboardApi"
import { IoPersonCircleSharp } from "react-icons/io5"
import probe from "probe-image-size"

const ImageDetail = ({
  image,
  index,
}: {
  image: DashboardImage
  index: number
}) => {
  const router = useRouter()
  const [processImage, { isLoading, isError, data }] = useProcessImageMutation()
  const [processType, setProcessType] = useState("original")
  const [selectedImage, setSelectedImage] = useState(image.url)
  const [open, setOpen] = useState(false)
  const [likeImage] = useLikeImageMutation()
  const [likeInfo, setlikeInfo] = useState({
    isLiked: image.is_liked,
    likeNumber: image.like_number,
  })
  const [dimension, setDimension] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  useEffect(() => {
    const fetchImageSize = async () => {
      try {
        const size = await probe(image.url)
        setDimension({ width: size.width, height: size.height })
      } catch (error) {
        console.error("Failed to load image size:", error)
      }
    }

    fetchImageSize()
  }, [])

  useEffect(() => {
    if (!open) {
      setSelectedImage(image.url)
      setProcessType("original")
    }
  }, [open])

  useEffect(() => {
    setlikeInfo({
      isLiked: image.is_liked,
      likeNumber: image.like_number,
    })
  }, [image])

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
      default:
        break
    }
  }

  const handleOnSelectUpscaleImage = async () => {
    const isUpscale = image.upscale != null && image.upscale !== ""

    if (isUpscale) {
      setSelectedImage(image.upscale)
    } else {
      try {
        const result = await processImage({
          processType: ProcessType.UPSCALE,
          imageId: image.id,
        })
        if ("data" in result) {
          setSelectedImage(result?.data.upscale)
        }
      } catch (error) {
        console.log("Error upscaling image:", error)
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
        setSelectedImage(result?.data.remove_background)
      }
    }
  }

  const handleLikeToggle = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    setlikeInfo({
      isLiked: !likeInfo.isLiked,
      likeNumber: likeInfo.isLiked
        ? likeInfo.likeNumber - 1
        : likeInfo.likeNumber + 1,
    })
    await likeImage({ imageId: image.id, type: "like" }).unwrap()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} key={index}>
      <DialogTrigger className="w-full">
        <Card className="transform transition-transform duration-300 hover:scale-105 ">
          <CardContent className=" p-0">
            <Image
              width={dimension.width}
              height={dimension.height}
              className="w-full rounded-lg"
              src={image.url}
              alt={image.prompt}
              loading="lazy"
            />
          </CardContent>
          <div className="absolute inset-0   bg-black bg-opacity-50 pt-10 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <div className="absolute top-0 flex w-full items-center justify-between p-3">
              <div className="flex content-center space-x-2">
                <div>
                  {image.created_user?.avatar ? (
                    <Image
                      height={25}
                      width={25}
                      className="rounded-full"
                      src={image.created_user?.avatar}
                      alt={image.prompt}
                      loading="lazy"
                    />
                  ) : (
                    <IoPersonCircleSharp size={25} />
                  )}
                </div>
                <p className="font-semibold text-white">
                  {image.created_user?.first_name}{" "}
                  {image.created_user?.last_name}
                </p>
              </div>

              <div className="flex w-1/3 items-center justify-between rounded-xl bg-white bg-opacity-20 px-3 py-1">
                <p className="text-white">{likeInfo.likeNumber}</p>
                <FaHeart
                  className={`font-bold ${likeInfo.isLiked ? "text-red-500" : ""}  hover:scale-125 hover:transition-transform`}
                  size={20}
                  onClick={handleLikeToggle}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 px-1 py-3 text-center text-white rounded-lg">
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
                    <a href={`/profile/${image.created_user?.id}`}>
                      <h1>
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
                    <a href={`/profile/${image.created_user?.id}`}>
                      <h1>
                        <IoPersonCircleSharp size={40} />
                      </h1>
                    </a>
                  )}
                </div>
                <a href={`/profile/${image.created_user?.id}`}>
                  <h1>
                    {image.created_user?.first_name}{" "}
                    {image.created_user?.last_name}
                  </h1>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{likeInfo.likeNumber}</h1>
                <FaHeart
                  className={`font-bold ${likeInfo.isLiked ? "text-red-500" : "hover:scale-125"} cursor-pointer hover:transition-transform`}
                  size={20}
                  onClick={handleLikeToggle}
                />
              </div>
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
              <div className="w-1/3">Type</div>
              <Button
                variant={"outline"}
                className="w-fit cursor-default rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700 hover:text-primary-700"
              >
                {image.type}
              </Button>
            </Label>
            <div className="mt-[8px] flex w-full items-center">
              <h1 className="w-1/3 text-lg font-semibold">Style</h1>
              <div className="w-2/3 rounded-lg bg-card">
                <p className="p-4">{image.style}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                AI Name
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{image.ai_name}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Created At
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">
                  {new Date(image.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Width
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{dimension.width}</p>
              </div>
            </div>

            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Height
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{dimension.height}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetail
