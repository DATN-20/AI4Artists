"use client"

import { ChangeEvent, useContext, useEffect, useState } from "react"
import GenerateSideBar from "@/components/sidebar/GenerateSideBar"
import {
  useAiInformationQuery,
  useGetGenerationHistoryQuery,
  useImageToImageMutation,
  useTextToImageMutation,
} from "@/services/generate/generateApi"
import { useAppDispatch } from "@/store/hooks"
import {
  selectGenerate,
  setInputs,
  setHistory,
  setAIName,
  setField,
  setAIStyleInputs,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import GenerateControls from "@/components/generate/GenerateControls"
import Loading from "@/components/Loading"
import HistoryCarousel from "@/components/generate/HistoryCarousel"
import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import { toast } from "react-toastify"
import { TagsContext } from "@/store/tagsHooks"
import { IoIosClose } from "react-icons/io"

export default function Generate() {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const [useNegativePrompt, setUseNegativePrompt] = useState(false)
  const [promptPos, setPromptPos] = useState("")
  const [promptNeg, setPromptNeg] = useState("")
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const { data: historyData, refetch } = useGetGenerationHistoryQuery()
  const authStates = useSelector(selectAuth)
  const { setGenerateTags, generateTags } = useContext(TagsContext)

  const handlePosPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value
    setPromptPos(prompt)
    dispatch(
      setField({
        field: "positivePrompt",
        value: `${prompt} ${
          generateTags.length > 0 ? `, ${generateTags}` : ""
        }`,
      }),
    )
  }

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
      toast.success("Image saved successfully!")
    } catch (error: any) {
      toast.error("Error saving image")
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
    if (promptPos === "" && generateTags === "") {
      toast.error("Please enter a prompt or select tags")
      return
    }

    const formData = new FormData()
    formData.append("aiName", generateStates.ai_name || "")
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
    }

    try {
      let result
      if (generateStates.useImage) {
        result = await imageToImage(formData).unwrap()
      } else {
        result = await textToImage(formData).unwrap()
      }
      setGenerateImgData(result)
      toast.success(
        "Image is being generated! Please check for our notification.",
      )
    } catch (error: any) {
      console.log(error)
      toast.error(
        "Error generating image: " +
          (error as { data: { message: string } }).data.message,
      )
    }
  }

  const handleNegPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value
    setPromptNeg(prompt)
    dispatch(setField({ field: "negativePrompt", value: prompt }))
  }
  useEffect(() => {
    const promptValue = localStorage.getItem("prompt")
    localStorage.removeItem("prompt")
    if (promptValue) {
      setPromptPos(promptValue)
    }
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
  }, [])

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

  useEffect(() => {
    console.log(generateStates.dataStyleInputs)
    console.log(generateStates.dataInputs)
  }, [generateStates.dataStyleInputs, generateStates.dataInputs])

  return (
    <>
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
          {generateTags.length > 0 && (
            <span className="relative rounded-sm border-2 border-primary-700 bg-transparent p-2 text-sm font-bold text-primary-700">
              {generateTags}
              <IoIosClose
                className="absolute right-[-5px] top-[-10px] size-4 cursor-pointer rounded-full bg-red-500 text-sm text-white hover:bg-red-300"
                onClick={() => setGenerateTags("")}
              />
            </span>
          )}
          <h1 className="mt-5 text-3xl font-bold">Generated Images</h1>
          {historyData &&
            historyData.map((item: ImageGroup, index: number) => (
              <HistoryCarousel
                key={index}
                generateImgData={item.images}
                width={512}
                height={512}
                styleAlbum={item.style || undefined}
                prompt={item.prompt}
                album={authStates?.totalAlbum}
              />
            ))}
        </div>
      </div>
    </>
  )
}
