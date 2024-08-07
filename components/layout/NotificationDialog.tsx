import { DashboardImage } from "@/types/dashboard"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import probe from "probe-image-size"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { convertModelNameToStyleName, formatAIName } from "@/constants/utilities"

export interface NotificationImageProps {
  style: string | undefined
  prompt: string
  images: DashboardImage[]
}

const NotificationImage = ({
  style,
  prompt,
  images,
}: NotificationImageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  )
  useEffect(() => {
    const getSize = async () => {
      const size = await probe(images[0].url)
      setImageSize(size)
    }
    getSize()
  }, [])

  const nextImage = () => {
    if (selectedImageIndex === images.length - 1) {
      setSelectedImageIndex(0)
    } else {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (selectedImageIndex === 0) {
      setSelectedImageIndex(images.length - 1)
    } else {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  return (
    <div className="flex h-fit flex-col gap-4">
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="mb-5 flex w-full items-center justify-center gap-4">
            <Image
              src={images[selectedImageIndex].url}
              alt="image"
              className="h-auto w-full rounded-lg"
              width={512}
              height={512}
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-between">
            <FaArrowLeft
              size={20}
              className="hover:cursor-pointer hover:text-primary-700"
              onClick={prevImage}
            />
            <div className="flex justify-between gap-4">
              {images.map((image: DashboardImage, index: number) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt="image"
                  className={`h-[80px] w-[80px] rounded-lg border-2 object-cover hover:cursor-pointer hover:border-primary hover:shadow-md
                    ${selectedImageIndex === index ? "border-primary" : ""}
                `}
                  width={80}
                  height={80}
                  loading="lazy"
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
            <FaArrowRight
              size={20}
              className="hover:cursor-pointer hover:text-primary-700"
              onClick={nextImage}
            />
          </div>
        </div>
        <div className="fixed left-1/2 w-1/2 p-4">
          <div className="flex flex-col gap-4">
            <h1 className="mt-[8px] font-semibold text-primary-700">
              Prompt Detail
            </h1>
            <div className="mt-[8px] w-full rounded-lg bg-card">
              <p className="p-4">{prompt}</p>
            </div>
            <Label className="mt-[8px] flex w-full items-center text-lg font-semibold">
              <div className="w-1/3">Type</div>
              <Button
                variant={"outline"}
                className="w-fit cursor-default rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700 hover:text-primary-700"
              >
                {images[selectedImageIndex].type}
              </Button>
            </Label>
            {style && (
              <div className="mt-[8px] flex w-full items-center">
                <h1 className="w-1/3 text-lg font-semibold">Style</h1>
                <div className="w-2/3 rounded-lg bg-card">
                  <p className="p-4">{convertModelNameToStyleName[style]}</p>
                </div>
              </div>
            )}
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                AI Name
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{formatAIName[images[selectedImageIndex].ai_name]}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Created At
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">
                  {new Date(
                    images[selectedImageIndex].created_at,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Width
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{imageSize.width}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Height
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{imageSize.height}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationImage
