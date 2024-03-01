"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Search } from "lucide-react"
import { FaSort, FaFilter, FaImage } from "react-icons/fa"
import ImageInput from "@/components/generate/input-component/ImageInput"
import GenerateSideBar from "@/components/sidebar/GenerateSideBar"

export default function Generate() {
  const [useNegativePrompt, setUseNegativePrompt] = useState(false)
  const [useImg2Img, setUseImg2Img] = useState(false)
  const handleImageChange = (image: File) => {
    // Do something with the selected image file
    console.log("Selected image:", image)
  }
  // Dữ liệu mẫu cho carousel
  const imageData = [
    {
      id: 1,
      imageUrl:
        "https://app-cdn.acelitchi.com/prod/app/6/29/438054761093351838.webp",
    },
    {
      id: 2,
      imageUrl: "https://avatarfiles.alphacoders.com/367/367848.png",
    },
    {
      id: 3,
      imageUrl:
        "https://img.getimg.ai/generated/img-RqUYqXaUnRy2xfYjyI5ep.jpeg",
    },
    {
      id: 4,
      imageUrl:
        "https://pics.janitorai.com/bot-avatars/8e200160-5b85-428f-b436-1a3a179d75e1.webp",
    },
    {
      id: 5,
      imageUrl:
        "https://i.pinimg.com/564x/b4/cc/27/b4cc2795a633d57ac5eed6327ec01b3c.jpg",
    },
  ]

  return (
    <div className="grid grid-cols-10 gap-4 p-4">
      <div className="col-span-2">
        <GenerateSideBar />
      </div>
      <div className="col-span-8 ml-4 h-full w-full">
        <div className="flex max-w-[1050px]">
          <input
            type="text"
            placeholder="Type prompt here..."
            className="flex-grow rounded-2xl p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
          />
          <button
            type="button"
            className="ml-4 flex items-center justify-center rounded-full bg-purple-500 px-4 py-3 font-bold text-white hover:bg-purple-700"
          >
            <span className="mr-2">✨</span>
            Generate
          </button>
        </div>
        <div className="mt-5 flex items-center space-x-2">
          <Switch
            id="negative-mode"
            className="bg-black"
            onClick={() => setUseNegativePrompt(!useNegativePrompt)}
          />
          <Label htmlFor="negative-mode">Use Negative Prompt</Label>
        </div>
        {useNegativePrompt && (
          <input
            type="text"
            placeholder="Type what you don't want to see in a image (a negative prompt)..."
            className="mt-5 w-full max-w-[1050px] flex-grow rounded-2xl p-3 text-black placeholder-black outline-none dark:placeholder-white"
          />
        )}
        <div className="mt-5 flex items-center space-x-2">
          <Switch
            id="image-mode"
            className="bg-black"
            onClick={() => setUseImg2Img(!useImg2Img)}
          />
          <Label htmlFor="image-mode">Use Image Generation</Label>
        </div>
        {useImg2Img && <ImageInput onImageChange={handleImageChange} />}

        <h1 className="mt-5 text-3xl font-bold">Generated Images</h1>
        <div className="ml-10 mt-5 flex">
          <div className="flex items-center justify-center rounded-full bg-card px-4 ">
            <input
              type="text"
              placeholder="Prompt"
              className="flex-grow bg-transparent  p-2 placeholder-black outline-none dark:placeholder-white"
            />
            <Search className="dark:text-white" />
          </div>
          <Select>
            <SelectTrigger className=" ml-5 w-[180px] bg-white dark:bg-zinc-800">
              <FaFilter />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="alphabet">Alphabet</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="ml-5 w-[180px] bg-white dark:bg-zinc-800">
              <FaSort />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="descending">
                  Time Created: Descending
                </SelectItem>
                <SelectItem value="ascending">
                  Time Created: Ascending
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Carousel className="ml-10 mt-5 w-full max-w-5xl">
          <div className="mb-2 ml-1 flex justify-between	">
            <div>An anime girl </div>
            <div className="flex">
              <div>Stable Diffusion 1.5</div>
              <div className="ml-10 flex items-center justify-center">
                <span>5</span> <FaImage className="ml-2 flex " />
              </div>
              <div className="ml-10">27/2/2024</div>
            </div>
          </div>

          <CarouselContent>
            {imageData.map((item) => (
              <CarouselItem key={item.id} className="lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex  items-center justify-center p-0">
                      <img width={512} height={512} src={item.imageUrl} />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Carousel className="ml-10 mt-5 w-full max-w-5xl">
          <div className="mb-2 ml-1 flex justify-between	">
            <div>An anime girl </div>
            <div className="flex">
              <div>Stable Diffusion 1.5</div>
              <div className="ml-10 flex items-center justify-center">
                <span>5</span> <FaImage className="ml-2 flex " />
              </div>
              <div className="ml-10">27/2/2024</div>
            </div>
          </div>

          <CarouselContent>
            {imageData
              .slice()
              .reverse()
              .map((item) => (
                <CarouselItem key={item.id} className="lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex  items-center justify-center p-0">
                        <img width={512} height={512} src={item.imageUrl} />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
