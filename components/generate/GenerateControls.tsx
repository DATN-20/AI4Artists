import React from "react"

import { Search } from "lucide-react"
import { FaFilter, FaSort } from "react-icons/fa"
import ImageInput from "@/components/generate/input-component/ImageInput"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useAppDispatch } from "@/store/hooks"
import { selectGenerate, setUseImage } from "@/features/generateSlice"
import { useSelector } from "react-redux"

interface GenerateControlsProps {
  handlePosPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleNegPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleImageChange: (image: File) => void
  handleGenerate: () => void
  setUseNegativePrompt: React.Dispatch<React.SetStateAction<boolean>>
  setUseImg2Img: React.Dispatch<React.SetStateAction<boolean>>
  useNegativePrompt: boolean
  useImg2Img: boolean
}

const GenerateControls: React.FC<GenerateControlsProps> = ({
  handlePosPromptChange,
  handleNegPromptChange,
  handleImageChange,
  handleGenerate,
  setUseNegativePrompt,
  setUseImg2Img,
  useNegativePrompt,
  useImg2Img,
}) => {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)

  return (
    <>
      <div className="flex items-center">
        <textarea
          placeholder="Type prompt here..."
          onChange={handlePosPromptChange}
          className="flex-grow resize-none rounded-2xl bg-[#2c2d31] p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
        />
        <button
          type="button"
          onClick={handleGenerate}
          className="ml-4 hidden items-center justify-center rounded-full bg-gradient-default px-4 py-3 font-bold text-white hover:bg-purple-700 lg:flex"
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
        <textarea
          placeholder="Type what you don't want to see in a image (a negative prompt)..."
          onChange={handleNegPromptChange}
          className="mt-5 w-full  flex-grow resize-none rounded-2xl bg-[#2c2d31] p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
        />
      )}
      <div className="mt-5 flex items-center space-x-2">
        <Switch
          id="image-mode"
          className="bg-black"
          onClick={() => {
            setUseImg2Img(!useImg2Img)
            dispatch(setUseImage({ useImage: !generateStates.useImage }))
          }}
        />
        <Label htmlFor="image-mode">Use Image Generation</Label>
      </div>
      {useImg2Img && <ImageInput onImageChange={handleImageChange} />}
      <button
        type="button"
        onClick={handleGenerate}
        className="mt-4 flex items-center justify-center rounded-full bg-purple-500 px-4 py-3 font-bold text-white hover:bg-purple-700 lg:hidden "
      >
        <span className="mr-2">✨</span>
        Generate
      </button>
      <h1 className="mt-5 text-3xl font-bold">Generated Images</h1>
      <div className="mt-5 flex flex-col lg:flex-row">
        <div className="flex items-center justify-center rounded-full bg-card px-4">
          <input
            type="text"
            placeholder="Prompt"
            className="flex-grow bg-transparent p-2 placeholder-black outline-none dark:placeholder-white"
          />
          <Search className="dark:text-white" />
        </div>
        <div className="mt-4 flex gap-4 lg:mt-0">
          <Select>
            <SelectTrigger className=" w-[180px] bg-white dark:bg-zinc-800 lg:ml-5">
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
            <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-800 lg:ml-5">
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
      </div>
    </>
  )
}

export default GenerateControls
