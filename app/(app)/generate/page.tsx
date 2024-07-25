"use client"

import { ChangeEvent, useContext, useEffect, useState } from "react"
import GenerateSideBar from "@/components/sidebar/GenerateSideBar"
import {
  useGenerateStyleImageMutation,
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
  clearAll,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import HistoryCarousel from "@/components/generate/HistoryCarousel"
import { useGetProfileAlbumQuery } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import { toast } from "react-toastify"
import { TagsContext } from "@/store/tagsHooks"
import { IoIosClose } from "react-icons/io"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import ImageToTag from "@/components/generate/ImageToTag"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { base64StringToFile } from "@/lib/base64StringToFile"
import StyleComponent from "../../../components/generate/StyleComponent"
import ControlnetComponent from "../../../components/generate/ControlnetComponent"

export default function Generate() {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const authStates = useSelector(selectAuth)
  const { data: albumData, refetch } = useGetProfileAlbumQuery()

  const [textToImage, { data: textToImgData, isLoading: textToImageLoading }] =
    useTextToImageMutation()
  const [imageToImage, { data: imgToImgData, isLoading: imgToImageLoading }] =
    useImageToImageMutation()

  const [generateStyle, { data: generateStyleData, isLoading, isError }] =
    useGenerateStyleImageMutation()
  const { data: historyData, refetch: refetchHistory } =
    useGetGenerationHistoryQuery()
  const { setGenerateTags, generateTags, setOpenStyleDrawer } =
    useContext(TagsContext)

  const [useNegativePrompt, setUseNegativePrompt] = useState<boolean>(false)
  const [promptPos, setPromptPos] = useState<string>("")
  const [promptNeg, setPromptNeg] = useState<string>("")
  const [sideBarKey, setSideBarKey] = useState<number>(0) // State to control rerendering

  const handlePosPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value
    setPromptPos(prompt)
    dispatch(
      setField({
        field: "positivePrompt",
        value: `${prompt}`,
      }),
    )
    dispatch(
      setStyleField({
        field: "positivePrompt",
        value: `${prompt}`,
      }),
    )
  }

  const handleClearAllInput = () => {
    dispatch(clearAll())
    setPromptPos("")
    setPromptNeg("")
    setSideBarKey((prevKey) => prevKey + 1)
    setGenerateTags("")
  }

  const handleGenerateStyle = async () => {
    const formData = new FormData()
    if (generateStates.dataStyleInputs) {
      const positivePromptCheck = generateStates.dataStyleInputs?.find(
        (input: any) => input.name === "positivePrompt",
      )

      if (!positivePromptCheck || positivePromptCheck.value.trim() === "") {
        toast.error("Please fill all Input field")
        return
      }

      //validate for imageForIpadapter
      const lastestArrayIndex = Math.max(
        ...generateStates.dataStyleInputs.map((input: any) => input.ArrayIndex),
      )

      const hasImageForIpadapter = generateStates.dataStyleInputs.find(
        (input: any) =>
          input.ArrayIndex === lastestArrayIndex &&
          input.name === "imageForIpadapter",
      )

      if (!hasImageForIpadapter) {
        toast.error("Please upload Image for Style Transfer")
        return
      }

      //validate for controlNetImages
      if (generateStates.useControlnet && generateStates.controlNetInputs) {
        const latestControlNetArrayIndex = Math.max(
          ...generateStates.controlNetInputs.map(
            (input: any) => input.arrayIndex,
          ),
        )
        const hasControlNetImages = generateStates.controlNetInputs.find(
          (input: any) =>
            input.arrayIndex === latestControlNetArrayIndex &&
            input.name === "controlNetImages",
        )
        if (!hasControlNetImages) {
          toast.error("Please upload Controlnet Image")
          return
        }
      }

      formData.append("aiName", generateStates.ai_name || "")

      generateStates.dataStyleInputs.forEach((input, index) => {
        const { name, value } = input
        if (name === "imageForIpadapter") {
          const base64String = value
          if (base64String) {
            const filename = "image.png"
            const imageFile = base64StringToFile(base64String, filename)
            formData.append("imageForIpadapter", imageFile)
            return
          }
        }

        formData.append(name, (value as any).toString())
      })
      if (generateStates.useControlnet) {
        generateStates.controlNetInputs?.forEach((input, index) => {
          const { name, value } = input
          if (name === "controlNetImages") {
            const imageFile = base64StringToFile(value as string, "image.jpg")
            formData.append("controlNetImages", imageFile)
            return
          }
          formData.append(name, (value as any).toString())
        })
      }

      try {
        await generateStyle(formData).unwrap()
        return
      } catch (error) {
        toast.error("Error generating image:")
        return
      }
    } else {
      toast.error("Please fill all Input field")
    }
  }

  const handleNormalGenerate = async () => {
    const formData = new FormData()

    if (promptPos === "" && generateTags === "") {
      toast.error("Please enter a prompt or select tags")
      return
    }

    if (generateStates.useControlnet && generateStates.controlNetInputs) {
      const latestControlNetArrayIndex = Math.max(
        ...generateStates.controlNetInputs.map((input: any) => input.ArrayIndex),
      )
      const hasControlNetImages = generateStates.controlNetInputs.find(
        (input: any) =>
          input.ArrayIndex === latestControlNetArrayIndex &&
          input.name === "controlNetImages",
      )
      if (!hasControlNetImages) {
        toast.error("Please upload Controlnet Image")
        return
      }
    }

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

        if (name === "positivePrompt") {
          if (generateTags.length > 0) {
            formData.append(name, `${promptPos}, ${generateTags}`)
          } else {
            formData.append(name, promptPos)
          }
          return
        }
        formData.append(name, (value as any).toString())
      })

      if (generateStates.useControlnet) {
        generateStates.controlNetInputs?.forEach((input, index) => {
          const { name, value } = input
          if (name === "controlNetImages") {
            const imageFile = base64StringToFile(value as string, "image.jpg")
            formData.append("controlNetImages", imageFile)
            return
          }
          formData.append(name, (value as any).toString())
        })
      }
    }

    try {
      if (generateStates.useImage) {
        await imageToImage(formData).unwrap()
      } else {
        await textToImage(formData).unwrap()
      }
    } catch (error: any) {
      toast.error(
        "Error generating image: " +
          (error as { data: { message: string } }).data.message,
      )
    }
  }

  const handleGenerate = async () => {
    if (generateStates.useStyleImage) {
      await handleGenerateStyle()
    } else {
      await handleNormalGenerate()
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
      <div className="block gap-4  p-4 lg:grid lg:grid-cols-10">
        <div className="hidden lg:col-span-2 lg:block">
          <div className="no-scrollbar fixed left-0 top-0 h-screen min-h-screen w-1/5 overflow-y-scroll p-4">
            <GenerateSideBar
              key={sideBarKey} //force rerender
            />
          </div>
        </div>
        <div className="h-full w-full lg:col-span-8">
          <div className="flex items-center">
            <textarea
              placeholder="Type prompt here..."
              value={promptPos}
              onChange={handlePosPromptChange}
              className="flex-grow resize-none rounded-lg p-3 text-black placeholder-black outline-none dark:bg-[#2c2d31] dark:text-white dark:placeholder-white"
            />
          </div>
          <div className="mt-3 flex items-center gap-6">
            <div className=" flex items-center space-x-2">
              <Switch
                id="negative-mode"
                className="rounded-lg data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-slate-600 dark:data-[state=unchecked]:bg-white"
                onClick={() => setUseNegativePrompt(!useNegativePrompt)}
                checked={useNegativePrompt}
              />
              <Label htmlFor="negative-mode">Use Negative Prompt</Label>
            </div>
          </div>

          {useNegativePrompt && (
            <textarea
              placeholder="Type what you don't want to see in a image ..."
              onChange={handleNegPromptChange}
              className="mt-5 w-full  flex-grow resize-none rounded-lg p-3 text-black placeholder-black outline-none dark:bg-[#2c2d31] dark:text-white dark:placeholder-white"
            />
          )}

          <div className="mt-3 flex items-center gap-4">
            <Button
              variant={"default"}
              className="flex w-fit select-none items-center gap-2 rounded-lg border-[2px] border-black bg-transparent px-4 py-2 font-bold hover:border-primary-700 hover:bg-transparent hover:text-primary-700 dark:border-white dark:hover:border-primary-700"
              onClick={() => {
                handleClearAllInput()
              }}
            >
              <Trash width={18} height={18} />
              Clear All
            </Button>
            <ImageToTag />
          </div>

          {generateTags.length > 0 && (
            <div className="relative my-4 w-full rounded-sm border-2 border-primary-700 bg-transparent p-2 text-sm font-bold text-primary-700 md:w-2/3">
              {generateTags}
              <IoIosClose
                className="absolute right-[-5px] top-[-10px] size-4 cursor-pointer rounded-full bg-red-500 text-sm text-white hover:bg-red-300"
                onClick={() => setGenerateTags("")}
              />
            </div>
          )}

          {generateStates.useControlnet
            ? generateStates.useStyleImage
              ? generateStates?.aiStyleInputs?.map((aiStyleInput: any) => {
                  if (aiStyleInput.input_property_name === "controlNets") {
                    return (
                      <ControlnetComponent
                        dispatch={dispatch}
                        generateStates={generateStates}
                        inputData={aiStyleInput}
                        title={aiStyleInput.name}
                        desc={aiStyleInput.desc}
                      />
                    )
                  }
                })
              : generateStates?.aiInputs?.map((inputData: any) => {
                  if (inputData.input_property_name === "controlNets") {
                    return (
                      <ControlnetComponent
                        dispatch={dispatch}
                        generateStates={generateStates}
                        inputData={inputData}
                        title={inputData.name}
                        desc={inputData.desc}
                      />
                    )
                  }
                })
            : null}

          {generateStates.useStyleImage &&
            generateStates?.aiStyleInputs?.map((aiStyleInput: any) => {
              if (
                aiStyleInput.input_property_name ===
                "ipadapterStyleTranferInputs"
              ) {
                return (
                  <StyleComponent
                    dispatch={dispatch}
                    generateStates={generateStates}
                    inputData={aiStyleInput}
                  />
                )
              }
            })}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={textToImageLoading || imgToImageLoading}
            className="mt-4 flex select-none items-center justify-center rounded-full bg-purple-500 px-4 py-3 font-bold text-white hover:bg-purple-700 lg:hidden "
          >
            <span className="mr-2">✨</span>
            Generate
          </button>
          <div className="mt-3 flex w-full items-end justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              className=" hidden items-center justify-center rounded-lg bg-gradient-to-br from-sky-300 to-primary-700 to-60% px-4 py-3 font-bold text-white hover:text-black hover:opacity-80 lg:flex"
            >
              <span className="mr-2">✨</span>
              Generate
            </button>
          </div>

          <h1 className="mt-5 text-3xl font-bold">Generated Images</h1>
          {historyData && historyData.length > 0 ? (
            historyData.map((item, index) => (
              <HistoryCarousel
                key={index}
                generateImgData={item.images}
                width={512}
                height={512}
                styleAlbum={item.style || undefined}
                prompt={item.prompt}
                album={authStates?.totalAlbum}
                generateType={item.images[0].type}
                aiName={item.images[0].ai_name}
              />
            ))
          ) : (
            <p className="mt-5">No Images Found</p>
          )}
        </div>
      </div>
    </>
  )
}
