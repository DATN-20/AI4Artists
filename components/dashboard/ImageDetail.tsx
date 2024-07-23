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
import { useEffect, useRef, useState } from "react"
import { useProcessImageMutation } from "@/services/image/imageApi"
import { ProcessType } from "../../types/Image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { FaHeart } from "react-icons/fa"
import { Label } from "@radix-ui/react-label"
import { useLikeImageMutation } from "@/services/dashboard/dashboardApi"
import { IoPersonCircleSharp } from "react-icons/io5"
import probe from "probe-image-size"
import { ErrorObject } from "@/types"
import { toast } from "react-toastify"
import Clamp from "react-multiline-clamp"

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
  const [upscaleImage, setUpscaleImage] = useState<string | null>(image.upscale)
  const [backgroundRemovedImage, setBackgroundRemovedImage] = useState<
    string | null
  >(image.remove_background)

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
      case "similar":
        localStorage.setItem("similarPrompt", image.prompt)
        router.push("/generate")
      default:
        break
    }
  }

  const handleOnSelectUpscaleImage = async () => {
    if (upscaleImage !== "" && upscaleImage !== null) {
      setSelectedImage(upscaleImage)
    } else {
      try {
        const result = await processImage({
          processType: ProcessType.UPSCALE,
          imageId: image.id,
        })
        if ("data" in result) {
          setSelectedImage(result?.data.upscale)
          setUpscaleImage(result?.data.upscale)
        } else {
          toast.error((result as ErrorObject).error.data.message)
          setSelectedImage(image.url)
        }
      } catch (error) {
        console.error("Failed to upscale image:", error)
        setSelectedImage(image.url)
      }
    }
  }

  const handleOnSelectRemoveBackground = async () => {
    if (backgroundRemovedImage !== "" && backgroundRemovedImage !== null) {
      setSelectedImage(backgroundRemovedImage)
    } else {
      const result = await processImage({
        processType: ProcessType.REMOVE_BACKGROUND,
        imageId: image.id,
      })
      if ("data" in result) {
        setSelectedImage(result?.data.remove_background)
        setBackgroundRemovedImage(result?.data.remove_background)
      } else {
        toast.error((result as ErrorObject).error.data.message)
        setSelectedImage(image.url)
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

  const displayNumberOfLikes = (likeCount: number) => {
    if (likeCount < 1000) {
      return likeCount
    } else if (likeCount < 1000000) {
      return `${Math.floor(likeCount / 1000)}K`
    } else {
      return `${Math.floor(likeCount / 1000000)}M`
    }
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
          <div className="absolute inset-0 bg-black bg-opacity-50 pt-10 opacity-0 transition-opacity duration-300 hover:opacity-100">
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
                    <IoPersonCircleSharp size={25} className="text-white" />
                  )}
                </div>
                <p className="line-clamp-1 font-semibold text-white">
                  {image.created_user?.first_name}{" "}
                  {image.created_user?.last_name}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl bg-white bg-opacity-20 px-3 py-1">
                <p className="text-sm text-white">
                  {displayNumberOfLikes(likeInfo.likeNumber)}
                </p>
                <FaHeart
                  className={`font-bold ${likeInfo.isLiked ? "text-red-500" : ""}  hover:scale-125 hover:transition-transform`}
                  size={20}
                  onClick={handleLikeToggle}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 px-1 py-3 text-center text-white">
              <p className="line-clamp-3">Prompt: {image.prompt}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-[85vw] md:max-w-[70vw]">
        <div className="flex w-full gap-2">
          <div className="flex w-1/2 flex-col gap-2">
            {isLoading ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={image.prompt}
                  className="h-auto w-full rounded-lg opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50">
                  <div className="flex flex-col items-center">
                    <svg
                      aria-hidden="true"
                      className="inline h-8 w-8 animate-spin fill-purple-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <div className="text-primary-700">Processing...</div>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={selectedImage}
                alt={image.prompt}
                className="h-auto w-full rounded-lg"
              />
            )}
            <div className="mt-[8px] flex gap-2 rounded-lg border-2 border-black dark:border-white">
              <Select
                onValueChange={(value) => {
                  handleSelectValue(value)
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Original" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem key="original" value="original">
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
                    <SelectItem key="similar" value="similar">
                      Generate With The Same Prompt
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
                  <h1 className="line-clamp-1 hover:text-primary-700">
                    {image.created_user?.first_name}{" "}
                    {image.created_user?.last_name}
                  </h1>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {displayNumberOfLikes(likeInfo.likeNumber)}
                </h1>
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
            {/* <div className="mt-[8px] w-full rounded-lg bg-card p-4">
              <p ref={ref} className={visible ? "" : "line-clamp-3"}>
                {image.prompt}
              </p>
              {clamps && (
                <button
                  onClick={() => setVisible(!visible)}
                  className="flex w-full justify-end text-purple-500"
                >
                  Show {visible ? "less" : "more"}
                </button>
              )}
            </div> */}
            <Clamp
              lines={3}
              maxLines={99}
              withToggle
              showMoreElement={({ toggle }: { toggle: () => void }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full justify-end text-purple-500"
                >
                  Show more
                </button>
              )}
              showLessElement={({ toggle }: { toggle: () => void }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full justify-end text-purple-500"
                >
                  Show less
                </button>
              )}
            >
              <div className="mt-[8px] w-full rounded-lg bg-card pb-1">
                <p className="mx-4 my-2">{image.prompt}</p>
              </div>
            </Clamp>
            <Label className="flex w-full items-center py-3 text-lg font-semibold">
              <div className="w-1/3">Type</div>
              <Button
                variant={"outline"}
                className="w-fit cursor-default rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700 hover:text-primary-700"
              >
                {image.type}
              </Button>
            </Label>
            {image.style && (
              <div className="mt-[8px] flex w-full items-center pb-3">
                <h1 className="w-1/3 text-lg font-semibold">Style</h1>
                <div className="w-2/3 rounded-lg bg-card">
                  <p className="p-4">{image.style}</p>
                </div>
              </div>
            )}
            <div className="mt-[8px] flex items-center pb-3">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                AI Name
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{image.ai_name}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center pb-3">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Created At
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">
                  {new Date(image.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-[8px] flex items-center pb-3">
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
