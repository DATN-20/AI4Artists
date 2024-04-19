import { DashboardImage } from "@/types/dashboard"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectTriggerWithoutChevron,
  SelectValue,
} from "@/components/ui/select"
import { FaEllipsisH } from "react-icons/fa"

interface ImageDetailProps {
  image: DashboardImage
  index: number
}

const ImageDetail = ({ image, index }: ImageDetailProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          key={index}
          className="h-auto w-full rounded-lg"
          src={image.url}
          alt={image.prompt}
          width={200}
          height={200}
        />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-scroll sm:max-w-[80vw] md:max-w-[60vw]">
        <div className="flex w-full gap-2">
          <div className="flex w-1/2 flex-col gap-2">
            <Image
              src={image.url}
              alt={image.prompt}
              className="h-auto w-full rounded-lg"
              width={200}
              height={200}
            />
            <div className="flex gap-2 mt-[8px]">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Original" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Upscale your Image</SelectLabel>
                    <SelectItem value="512x1024">2X</SelectItem>
                    <SelectItem value="1024x1024">3X</SelectItem>
                    <SelectItem value="768x1024">4X</SelectItem>
                    <SelectItem value="768x768">5X</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTriggerWithoutChevron className='w-fit'>
                  <FaEllipsisH />
                </SelectTriggerWithoutChevron>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="removebg">Remove BackGround</SelectItem>
                    <SelectItem value="edit">Edit in Canvas</SelectItem>
                    <SelectItem value="report">Report this Image</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="ml-4 flex flex-col flex-1">
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
              <p className="p-4">
                {image.prompt}
              </p>
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
