"use client"

import { ChangeEvent, useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { Search } from "lucide-react"
import { FaSort, FaFilter, FaImage } from "react-icons/fa"
import ImageInput from "@/components/generate/input-component/ImageInput"
import GenerateSideBar from "@/components/sidebar/GenerateSideBar"
import {
  useAiInformationMutation,
  useImageToImageMutation,
  useTextToImageMutation,
} from "@/services/generate/generateApi"
import { useAppDispatch } from "@/store/hooks"
import {
  selectGenerate,
  setInputs,
  setUseImage,
  setPositivePrompt,
  setNegativePrompt,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import { Skeleton } from "../../../components/ui/skeleton"

interface AIField {
  ai_name: string | null
  inputs: InputField[]
}

// Định nghĩa interface cho các trường dữ liệu input
interface InputField {
  name: string
  default: string | number | null
  typeName: string
  max?: number
  min?: number
  step?: number
  info?: {
    choices?: Record<string, string>
  }
}

export default function Generate() {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const [useNegativePrompt, setUseNegativePrompt] = useState(false)
  const [useImg2Img, setUseImg2Img] = useState(false)
  const [promptPos, setPromptPos] = useState("")
  const [promptNeg, setPromptNeg] = useState("")

  const {
    aiName,
    positivePrompt,
    negativePrompt,
    style,
    width,
    height,
    numberOfImage,
    steps,
    sampleMethod,
    cfg,
    noise,
    image,
  } = generateStates.dataInputs || {}

  const handleImageChange = (image: File) => {
    // Do something with the selected image file
  }
  const handlePosPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    const prompt = event.target.value
    setPromptPos(prompt)
    dispatch(setPositivePrompt({ value: prompt }))
  }

  function base64StringToFile(base64String: string, filename: string): File {
    const byteString = atob(base64String.split(",")[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: "image/jpeg" })
    return new File([blob], filename)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [textToImage] = useTextToImageMutation()
  const [imageToImage] = useImageToImageMutation()

  const [generateImgData, setGenerateImgData] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setIsError(false)

    let formData = new FormData()

    formData.append("aiName", aiName || "")
    formData.append("positivePrompt", positivePrompt || "")
    formData.append("negativePrompt", negativePrompt || "")
    formData.append("style", style || "")
    formData.append("width", width?.toString() || "")
    formData.append("height", height?.toString() || "")
    formData.append("numberOfImage", numberOfImage?.toString() || "")
    formData.append("steps", steps?.toString() || "")
    formData.append("sampleMethod", sampleMethod || "")
    formData.append("cfg", cfg?.toString() || "")
    formData.append("noise", noise?.toString() || "")

    if (useImg2Img) {
      const base64String = generateStates.dataInputs?.image
      if (base64String) {
        const filename = "image.jpg"
        const imageFile = base64StringToFile(base64String, filename)
        formData.append("image", imageFile)
      }
    }
    const requestBody = {
      aiName,
      positivePrompt,
      negativePrompt,
      style,
      width: width,
      height: height,
      numberOfImage: numberOfImage,
      steps: steps,
      sampleMethod,
      cfg: cfg,
      noise: noise,
    }

    try {
      let result
      if (useImg2Img) {
        result = await imageToImage(formData).unwrap()
      } else {
        result = await textToImage(requestBody).unwrap()
      }
      setGenerateImgData(result)
    } catch (error) {
      console.error("Error generating image:", error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNegPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    const prompt = event.target.value
    setPromptNeg(prompt)
    dispatch(setNegativePrompt({ value: prompt }))
  }
  const [aiInformation, { data: inputData }] = useAiInformationMutation()

  useEffect(() => {
    const fetchData = async () => {
      await aiInformation(undefined)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (inputData) {
      dispatch(setInputs({ aiInputs: inputData }))
    }
  }, [inputData])

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
            onChange={handlePosPromptChange}
            className="flex-grow rounded-2xl p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
          />
          <button
            type="button"
            onClick={handleGenerate}
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
            onChange={handleNegPromptChange}
            className="mt-5 w-full max-w-[1050px] flex-grow rounded-2xl p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
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

        <h1 className="mt-5 text-3xl font-bold">Generated Images</h1>
        <div className="mt-5 flex">
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
        {isLoading ? (
          <Skeleton
            className="mt-5 rounded-xl"
            style={{ width: width, height: height }}
          />
        ) : (
          generateImgData && (
            <>
              <div className="mb-2 ml-1 mt-5 flex justify-between	">
                <div>Lastest Generate Image</div>
                <div className="flex">
                  <div>Anime</div>
                  <div className="ml-10 flex items-center justify-center">
                    <span>5</span> <FaImage className="ml-2 flex " />
                  </div>
                  <div className="ml-10">27/2/2024</div>
                </div>
              </div>
              <img
                src={generateImgData}
                alt="Generated"
                style={{ width: width }}
                className="mt-5 rounded-xl"
              />
            </>
          )
        )}
      </div>
    </div>
  )
}
