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
import Carousel from "@/components/generate/Carousel"
import { Card, CardContent } from "../../../components/ui/card"
import Image from "next/image"
import GenerateControls from "@/components/generate/GenerateControls"

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

  const [generateImgData, setGenerateImgData] = useState<string[] | null>(null)

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
      <div className="col-span-8 mx-4 h-full">
        <GenerateControls
          handlePosPromptChange={handlePosPromptChange}
          handleNegPromptChange={handleNegPromptChange}
          handleImageChange={handleImageChange}
          handleGenerate={handleGenerate}
          setUseNegativePrompt={setUseNegativePrompt}
          setUseImg2Img={setUseImg2Img}
          useNegativePrompt={useNegativePrompt}
          useImg2Img={useImg2Img}
        />
        {isLoading ? (
          <Skeleton
            className="mt-5 rounded-xl"
            style={{ width: width, height: height }}
          />
        ) : (
          generateImgData && (
            <Carousel
              generateImgData={generateImgData}
              width={width}
              height={height}
            />
          )
        )}
      </div>
    </div>
  )
}
