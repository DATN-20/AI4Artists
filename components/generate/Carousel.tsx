import React from "react"
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"
import { Card, CardContent } from "../../components/ui/card"
import Image from "next/image"
import { IoCloudDownloadOutline } from "react-icons/io5"

interface CarouselProps {
  generateImgData: string[] | null
  width?: number
  height?: number
}

const Carousel: React.FC<CarouselProps> = ({
  generateImgData,
  width,
  height,
}) => {
  async function saveImageToDisk(imageUrl: string) {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "image.jpg"
      document.body.appendChild(link)

      link.click()

      URL.revokeObjectURL(blobUrl)

      document.body.removeChild(link)

      console.log("Image saved successfully!")
    } catch (error) {
      console.error("Error saving image:", error)
    }
  }
  return (
    <BaseCarousel className="relative mt-5 w-full">
      <CarouselContent>
        {generateImgData &&
          generateImgData
            .slice()
            .reverse()
            .map((item: any) => (
              <CarouselItem key={item.id} className="lg:basis-1/3">
                <div className="relative p-1">
                  <Card className="transform transition-transform duration-300 hover:scale-105">
                    <CardContent className="flex items-center justify-center p-0">
                      <Image
                        alt="generated image"
                        width={width}
                        height={height}
                        src={item}
                        className={"rounded-lg"}
                      />
                    </CardContent>
                    <div className="absolute inset-0   bg-black bg-opacity-50 pt-10 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <div className="flex max-w-full justify-end pr-5">
                        <IoCloudDownloadOutline
                          size={32}
                          className="ml-5 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            saveImageToDisk(item.url)
                          }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 px-1 py-3 text-center text-white">
                        <p className="line-clamp-3">Prompt: {item.prompt}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
      </CarouselContent>

      {generateImgData && generateImgData.length > 3 && (
        <>
          <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
          <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-xl" />
        </>
      )}
    </BaseCarousel>
  )
}

export default Carousel
