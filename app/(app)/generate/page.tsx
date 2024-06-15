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
  setHistory,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import HistoryCarousel from "@/components/generate/HistoryCarousel"
import { useGetProfileAlbumMutation } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import { toast } from "react-toastify"
import { TagsContext } from "@/store/tagsHooks"
import { IoIosClose } from "react-icons/io"
import { Switch } from "../../../components/ui/switch"
import { Label } from "../../../components/ui/label"
import ImageToTag from "../../../components/generate/ImageToTag"

export default function Generate() {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const [useNegativePrompt, setUseNegativePrompt] = useState(false)
  const [promptPos, setPromptPos] = useState("")
  const [promptNeg, setPromptNeg] = useState("")
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()

  const { data: historyData } = useGetGenerationHistoryQuery()
  const authStates = useSelector(selectAuth)
  const { setGenerateTags, generateTags, setOpenStyleDrawer } =
    useContext(TagsContext)

  const handlePosPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value
    setPromptPos(prompt)
    dispatch(
      setField({
        field: "positivePrompt",
        value: `${prompt}${generateTags.length > 0 ? `, ${generateTags}` : ""}`,
      }),
    )
    dispatch(
      setStyleField({
        field: "positivePrompt",
        value: `${prompt}${generateTags.length > 0 ? `, ${generateTags}` : ""}`,
      }),
    )
  }

  const [textToImage, { data: textToImgData, isLoading: textToImageLoading }] =
    useTextToImageMutation()
  const [imageToImage, { data: imgToImgData, isLoading: imgToImageLoading }] =
    useImageToImageMutation()
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
    if (generateStates.useStyleImage) {
      setOpenStyleDrawer(true)
      return
    }

    if (promptPos === "" && generateTags === "") {
      toast.error("Please enter a prompt or select tags")
      return
    }

    if (generateStates.useControlnet) {
      const controlNetImagesInput = generateStates.dataInputs?.find(
        (input: any) => input.name === "controlNetImages",
      )
      if (!controlNetImagesInput) {
        toast.error("Please upload control net images")
        return
      }
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
    dispatch(setStyleField({ field: "negativePrompt", value: prompt }))
  }
  useEffect(() => {
    const promptValue = localStorage.getItem("prompt")
    localStorage.removeItem("prompt")
    const similarPrompt = localStorage.getItem("similarPrompt")
    localStorage.removeItem("similarPrompt")
    if (promptValue) {
      setPromptPos(promptValue)
      dispatch(
        setField({
          field: "positivePrompt",
          value: `${promptValue}${generateTags.length > 0 ? `, ${generateTags}` : ""}`,
        }),
      )
      dispatch(
        setStyleField({
          field: "positivePrompt",
          value: `${promptValue}${generateTags.length > 0 ? `, ${generateTags}` : ""}`,
        }),
      )
    }

    if (similarPrompt) {
      setPromptPos(similarPrompt)
      dispatch(
        setField({
          field: "positivePrompt",
          value: `${similarPrompt}${generateTags.length > 0 ? `, ${generateTags}` : ""}`,
        }),
      )
      dispatch(
        setStyleField({
          field: "positivePrompt",
          value: `${similarPrompt}${generateTags.length > 0 ? `, ${generateTags}` : ""}`,
        }),
      )
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

  return (
    <>
      <div className="block gap-4 p-4 lg:grid lg:grid-cols-10">
        <div className="hidden lg:col-span-2 lg:block">
          <div className="no-scrollbar fixed left-0 top-0 h-screen min-h-screen w-1/5 overflow-y-scroll p-4">
            <GenerateSideBar />
          </div>
        </div>
        <div className="h-full w-full lg:col-span-8">
          {/* <GenerateControls
            handlePosPromptChange={handlePosPromptChange}
            handleNegPromptChange={handleNegPromptChange}
            handleGenerate={handleGenerate}
            setUseNegativePrompt={setUseNegativePrompt}
            useNegativePrompt={useNegativePrompt}
            promptPos={promptPos}
          /> */}
          <div className="flex items-center">
            <textarea
              placeholder="Type prompt here..."
              value={promptPos}
              onChange={handlePosPromptChange}
              className="flex-grow resize-none rounded-lg p-3 text-black placeholder-black outline-none dark:bg-[#2c2d31] dark:text-white dark:placeholder-white"
            />
            <button
              type="button"
              onClick={handleGenerate}
              className="ml-4 hidden items-center justify-center rounded-lg bg-gradient-to-br from-sky-300 to-primary-700 to-60% px-4 py-3 font-bold text-white hover:text-black hover:opacity-80 lg:flex"
            >
              <span className="mr-2">✨</span>
              Generate
            </button>
          </div>
          <div className="mt-5 flex items-center space-x-2">
            <Switch
              id="negative-mode"
              className="rounded-lg data-[state=unchecked]:bg-slate-600 data-[state=checked]:bg-primary-700 dark:data-[state=unchecked]:bg-white"
              onClick={() => setUseNegativePrompt(!useNegativePrompt)}
            />
            <Label htmlFor="negative-mode">Use Negative Prompt</Label>
          </div>
          {useNegativePrompt && (
            <textarea
              placeholder="Type what you don't want to see in a image ..."
              onChange={handleNegPromptChange}
              className="mt-5 w-full  flex-grow resize-none rounded-lg p-3 text-black placeholder-black outline-none dark:bg-[#2c2d31] dark:text-white dark:placeholder-white"
            />
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={textToImageLoading || imgToImageLoading}
            className="mt-4 flex select-none items-center justify-center rounded-full bg-purple-500 px-4 py-3 font-bold text-white hover:bg-purple-700 lg:hidden "
          >
            <span className="mr-2">✨</span>
            Generate
          </button>
          <ImageToTag />
          {generateTags.length > 0 && (
            <div className="relative my-4 w-full rounded-sm border-2 border-primary-700 bg-transparent p-2 text-sm font-bold text-primary-700 md:w-2/3">
              {generateTags}
              <IoIosClose
                className="absolute right-[-5px] top-[-10px] size-4 cursor-pointer rounded-full bg-red-500 text-sm text-white hover:bg-red-300"
                onClick={() => setGenerateTags("")}
              />
            </div>
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
