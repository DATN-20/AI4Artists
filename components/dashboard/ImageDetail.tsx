import { DashboardImage } from "@/types/dashboard"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
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
import { DialogClose } from "@radix-ui/react-dialog"

interface ImageDetailProps {
  image: DashboardImage
  index: number
}

const ImageDetail = ({ image, index }: ImageDetailProps) => {
  const router = useRouter()

  const [processImage, { isLoading, isError, data }] = useProcessImageMutation()
  const [processType, setProcessType] = useState("original")
  const [selectedImage, setSelectedImage] = useState(image.url)
  const [open, setOpen] = useState(false)

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
        router.push("/canvas")
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
        <img
          key={index}
          className="w-full rounded-lg"
          src={image.url}
          alt={image.prompt}
        />
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
                      Remove Backround
                    </SelectItem>
                    <SelectItem key="edit" value="edit">
                      Edit in Canvas
                    </SelectItem>
                    <SelectItem key="report" value="report">
                      Report this Image
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="ml-4 flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <div className="h-[32px] w-[32px] rounded-full bg-white" />
              <h1>
                {image.created_user?.first_name} {image.created_user?.last_name}
              </h1>
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
            <Button
              variant={"outline"}
              className="mt-[8px] w-fit  rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
            >
              {image.type}
            </Button>
            <div className="mt-[8px] flex items-center gap-4">
              <h1 className="text-lg font-semibold">Style:</h1>
              <div className="w-full rounded-lg bg-card">
                <p className="p-4">{image.style}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-4">
              <h1 className="flex-shrink-0 text-lg font-semibold">AI name:</h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{image.ai_name}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetail
