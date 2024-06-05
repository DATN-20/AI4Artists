import { DashboardImage } from "@/types/dashboard"
import Image from "next/image"
import { useState } from "react"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

export interface NotificationImageProps {
  style: string
  prompt: string
  images: DashboardImage[]
}

const NotificationImage = ({
  style,
  prompt,
  images,
}: NotificationImageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  return (
    <div className="flex h-fit flex-col gap-4">
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="mb-5 flex w-full justify-center">
            <Image
              src={images[selectedImageIndex].url}
              alt="image"
              className="w-full h-auto rounded-lg"
              width={512}
              height={512}
              loading="lazy"
            />
          </div>
          <div className="flex justify-around gap-4">
            {images.map((image: DashboardImage, index: number) => (
              <Image
                key={image.id}
                src={image.url}
                alt="image"
                className={`border-2 object-cover hover:cursor-pointer hover:border-primary hover:shadow-md w-[80px] h-[80px] rounded-lg
                    ${selectedImageIndex === index ? "border-primary" : ""}
                `}
                width={80}
                height={80}
                loading="lazy"
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 p-4">
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
                {style}
              </Button>
            </Label>
            <div className="mt-[8px] flex w-full items-center">
              <h1 className="w-1/3 text-lg font-semibold">Style</h1>
              <div className="w-2/3 rounded-lg bg-card">
                <p className="p-4">{images[selectedImageIndex].style}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                AI Name
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">{images[selectedImageIndex].ai_name}</p>
              </div>
            </div>
            <div className="mt-[8px] flex items-center">
              <h1 className="w-1/3 flex-shrink-0 text-lg font-semibold">
                Created At
              </h1>
              <div className="flex-grow rounded-lg bg-card">
                <p className="p-4">
                  {new Date(images[selectedImageIndex].created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationImage