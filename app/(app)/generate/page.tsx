"use client"

import { ChangeEvent, useContext, useEffect, useState } from "react"
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
  // setPositivePrompt,
  // setNegativePrompt,
  setHistory,
  setAIName,
  setField,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import { Skeleton } from "../../../components/ui/skeleton"
import Carousel from "@/components/generate/Carousel"
import GenerateControls from "@/components/generate/GenerateControls"
import Loading from "@/components/Loading"
import HistoryCarousel from "@/components/generate/HistoryCarousel"
import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import { CanvasModeContext } from "../../../store/canvasHooks"
import { Button } from "@/components/ui/button"

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
  const [promptPos, setPromptPos] = useState("")
  const [promptNeg, setPromptNeg] = useState("")
  const [isLoadingInformation, setIsLoadingInformation] = useState(true)
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const [useImg2Img, setUseImg2Img] = useState(false)

  const canvasModeContext = useContext(CanvasModeContext)
  const [
    getGenerationHistory,
    { data: historyData, error: historyError, isSuccess: getHistorySuccess },
  ] = useGetGenerationHistoryMutation()
  const authStates = useSelector(selectAuth)

  const fetchHistoryData = async () => {
    await getGenerationHistory(undefined)
  }


  const handlePosPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value
    setPromptPos(prompt)
    dispatch(setField({ field: "positivePrompt", value: prompt }))
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [textToImage] = useTextToImageMutation()
  const [imageToImage] = useImageToImageMutation()

  const [generateImgData, setGenerateImgData] = useState<string[] | null>(null)

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

  const downloadAllImages = async () => {
    if (historyData) {
      for (let i = 0; i < historyData.length; i++) {
        const item = historyData[i]
        if (item.images) {
          for (let j = 0; j < item.images.length; j++) {
            const imageUrl = item.images[j].url
            await saveImageToDisk(imageUrl)
          }
        }
      }
    }
  }


  const handleGenerate = async () => {
    fetchHistoryData()
    setIsLoading(true)
    setIsError(false)

    const formData = new FormData()

    if (generateStates.dataInputs) {
      generateStates.dataInputs.forEach((input, index) => {
        const { name, value } = input

        if (name === "image") {
          if (generateStates.useImage) {
            const imageInput = generateStates.dataInputs?.find(
              (input: any) => input.name === "image",
            )
            if (imageInput) {
              const base64String = (imageInput as any).value
              if (base64String) {
                const filename = "image.jpg"
                const imageFile = base64StringToFile(base64String, filename)
                formData.append("image", imageFile)
                return
              }
            }
          }
        }

        if (name === "controlNetImages") {
          const imageFile = base64StringToFile(value as string, "image.jpg")
          formData.append("controlNetImages", imageFile)
          return
        }
        formData.append(name, (value as any).toString())
      })
      formData.append("aiName", "comfyUI")
    }

    try {
      let result
      if (generateStates.useImage) {
        result = await imageToImage(formData).unwrap()
      } else {
        result = await textToImage(formData).unwrap()
      }
      console.log(result)
      setGenerateImgData(result)
    } catch (error) {
      console.error("Error generating image:", error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNegPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value
    setPromptNeg(prompt)
    dispatch(setField({ field: "negativePrompt", value: prompt }))
  }
  const [aiInformation, { data: inputData }] = useAiInformationMutation()

  useEffect(() => {
    const promptValue = localStorage.getItem("prompt")
    localStorage.removeItem("prompt")
    if (promptValue) {
      setPromptPos(promptValue)
    }
    const fetchAIData = async () => {
      await aiInformation(undefined)
    }
    fetchAIData()
    const fetchHistoryData = async () => {
      await getGenerationHistory(undefined)
    }
    fetchHistoryData()
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
  }, [])

  useEffect(() => {
    if (inputData) {
      dispatch(setAIName({ ai_name: inputData[0].ai_name }))
      dispatch(setInputs({ aiInputs: inputData[0].inputs }))
      setIsLoadingInformation(false)
    }
  }, [inputData])

  useEffect(() => {
    if (historyData) {
      dispatch(setHistory({ history: historyData }))
    }
  }, [historyData])
  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])
  return (
    <>
      {isLoadingInformation ? (
        <Loading />
      ) : (
        <div className="block gap-4 p-4 lg:grid lg:grid-cols-10">
          <div className="hidden lg:col-span-2 lg:block">
            <div className="no-scrollbar fixed left-0 top-0 h-screen min-h-screen w-1/5 overflow-y-scroll p-4">
              <GenerateSideBar />
            </div>
          </div>
          <div className="h-full w-full lg:col-span-8">
            <GenerateControls
              handlePosPromptChange={handlePosPromptChange}
              handleNegPromptChange={handleNegPromptChange}
              handleGenerate={handleGenerate}
              setUseNegativePrompt={setUseNegativePrompt}
              useNegativePrompt={useNegativePrompt}
              promptPos={promptPos}
            />
            {/* {isLoading ? (
              <Skeleton
                className="mt-5 rounded-xl"
                style={{ width: 512, height: 512 }}
              />
            ) : (
              generateImgData && (
                <Carousel
                  generateImgData={generateImgData}
                  width={512}
                  height={512}
                />
              )
            )} */}
            {/* <Button
              variant={"outline"}
              className="mt-[16px] w-fit  rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
              onClick={downloadAllImages}
            >
              Download all images
            </Button> */}
            {historyData &&
              historyData.map((item: any, index: number) => (
                <HistoryCarousel
                  key={index}
                  generateImgData={item.images}
                  width={512}
                  height={512}
                  styleAlbum={item.style}
                  prompt={item.prompt}
                  album={authStates.totalAlbum}
                />
              ))}
          </div>
        </div>
      )}
    </>
  )
}
