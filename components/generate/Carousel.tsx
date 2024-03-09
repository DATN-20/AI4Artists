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
    <BaseCarousel className="ml-10 mt-5 w-full max-w-5xl">
      <CarouselContent>
        {generateImgData &&
          generateImgData
            .slice()
            .reverse()
            .map((item: any) => (
              <CarouselItem key={item.id} className="lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex  items-center justify-center p-0">
                      <Image
                        alt="generated image"
                        width={width}
                        height={height}
                        src={item}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </BaseCarousel>
  )
}

export default Carousel
