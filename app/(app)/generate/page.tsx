"use client"

import { ChangeEvent, useEffect, useState } from "react"
import GenerateSideBar from "@/components/sidebar/GenerateSideBar"
import {
  useAiInformationMutation,
  useGetGenerationHistoryMutation,
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
  setHistory,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import { Skeleton } from "../../../components/ui/skeleton"
import Carousel from "@/components/generate/Carousel"
import GenerateControls from "@/components/generate/GenerateControls"
import Loading from "@/components/Loading"
import HistoryCarousel from "@/components/generate/HistoryCarousel"

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
  const [isLoadingInformation, setIsLoadingInformation] = useState(true)

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

  const [
    getGenerationHistory,
    { data: historyData, error: historyError, isSuccess: getHistorySuccess },
  ] = useGetGenerationHistoryMutation()

  const fetchHistoryData = async () => {
    await getGenerationHistory(undefined)
  }

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
    fetchHistoryData()
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
    const fetchAIData = async () => {
      await aiInformation(undefined)
    }
    fetchAIData()
    const fetchHistoryData = async () => {
      await getGenerationHistory(undefined)
    }
    fetchHistoryData()
  }, [])

  useEffect(() => {
    if (inputData) {
      dispatch(setInputs({ aiInputs: inputData }))
      setIsLoadingInformation(false)
    }
  }, [inputData])

  useEffect(() => {
    if (historyData) {
      dispatch(setHistory({ history: historyData }))
    }
  }, [historyData])

  return (
    <>
      {isLoadingInformation ? (
        <Loading />
      ) : (
        <div className="block gap-4 p-4 lg:grid lg:grid-cols-10">
          <div className="hidden lg:col-span-2 lg:block">
            <div className="fixed left-0 top-0 h-screen min-h-screen w-1/5 p-4">
              <GenerateSideBar />
            </div>
          </div>
          <div className="h-full w-full lg:col-span-8">
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
            {historyData &&
              historyData.map((item: any, index: number) => (
                <HistoryCarousel
                  key={index}
                  generateImgData={item.images}
                  width={width}
                  height={height}
                  styleAlbum={item.style}
                  prompt={item.prompt}
                />
              ))}
          </div>
        </div>
      )}
    </>
  )
}
