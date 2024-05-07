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
