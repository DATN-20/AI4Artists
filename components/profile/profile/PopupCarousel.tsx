import React from "react"
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ImageAlbum, ImageTotal } from "@/types/profile"

interface PopupCarouselProps {
  generateImgData: ImageAlbum[] | null
  width?: number
  height?: number
}

const PopupCarousel: React.FC<PopupCarouselProps> = ({
  generateImgData,
  width,
  height,
}) => {
  return (
    <>
      <BaseCarousel className="relative mt-5 w-full ">
        <CarouselContent>
          {generateImgData &&
            generateImgData.map((item: any) => (
              <CarouselItem key={item.id} className="lg:basis-1/4">
                <div className="relative p-1">
                  <Card className="transform transition-transform duration-300 hover:scale-105">
                    <CardContent className="flex items-center justify-center p-0">
                      <Image
                        alt="generated image"
                        width={width}
                        height={height}
                        src={item.image.url}
                      />
                    </CardContent>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <p className="text-center text-white">
                        Your text overlay
                      </p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 transform" />
        <CarouselNext className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 transform" />
      </BaseCarousel>
    </>
  )
}

export default PopupCarousel
