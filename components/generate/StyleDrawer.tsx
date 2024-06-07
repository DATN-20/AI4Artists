"use client"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { useGenerateStyleImageMutation } from "@/services/generate/generateApi"
import { renderInput } from "./renderInput"
import { base64StringToFile } from "@/lib/base64StringToFile"
import { toast } from "react-toastify"
import { TagsContext } from "../../store/tagsHooks"

const StyleDrawer = ({
  dispatch,
  generateStates,
  inputData,
}: {
  dispatch: any
  generateStates: any
  inputData: any
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const { openStyleDrawer, setOpenStyleDrawer } = useContext(TagsContext)
  const [generateStyle, { data: generateStyleData, isLoading, isError }] =
    useGenerateStyleImageMutation()

  const getMaxStep = () => {
    const maxIndex =
      generateStates.dataStyleInputs?.reduce((max: any, item: any) => {
        if (item.ArrayIndex !== undefined) {
          return item.ArrayIndex > max ? item.ArrayIndex : max
        }
        return max
      }, 0) ?? 0
    return maxIndex + 1
  }

  const navigateToStep = (step: number) => {
    if (step >= 1) {
      setCurrentStep(step)
    }
  }

  const addOrUpdateImageToData = () => {
    navigateToStep(currentStep + 1)
  }

  useEffect(() => {
    if (!openStyleDrawer) {
      setCurrentStep(1)
    }
  }, [openStyleDrawer])

  useEffect(() => {
    if (isError) {
      toast.error("Error generating image")
    }
  }, [isError])

  const submitData = async () => {
    const formData = new FormData()

    if (generateStates.dataStyleInputs) {
      console.log(generateStates.dataStyleInputs)
      if (
        !generateStates.dataStyleInputs.positivePrompt ||
        generateStates.dataStyleInputs.positivePrompt.value.trim() === ""
      ) {
        toast.error("Please enter a prompt or select tags")
        return
      }

      formData.append("aiName", generateStates.ai_name || "")

      generateStates.dataStyleInputs.forEach((input: any, index: any) => {
        const { name, value } = input
        if (name === "controlNetImages") {
          const imageFile = base64StringToFile(value as string, "image.jpg")
          formData.append("controlNetImages", imageFile)
          return
        }

        if (name === "imageForIpadapter") {
          const imageInput = generateStates.dataStyleInputs?.find(
            (input: any) => input.name === "imageForIpadapter",
          )
          if (imageInput) {
            const base64String = (imageInput as any).value
            if (base64String) {
              const filename = "image.png"
              const imageFile = base64StringToFile(base64String, filename)
              formData.append("imageForIpadapter", imageFile)
              return
            }
          }
        }

        formData.append(name, (value as any).toString())
      })
      formData.forEach((value, key) => {
        console.log(key, value)
      })

      try {
        await generateStyle(formData)
      } catch (error) {
        console.error("Error generating image:", error)
        toast.error("Error generating image")
      }
    } else {
      toast.error("Please fill all Input field")
    }
  }

  return (
    <Drawer
      direction="right"
      dismissible={false}
      open={openStyleDrawer}
      onOpenChange={setOpenStyleDrawer}
    >
      <DrawerTrigger>
        <Button
          variant={"outline"}
          className="mt-[16px] w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
        >
          Generate With Style
        </Button>
      </DrawerTrigger>
      <DrawerContent className="no-scrollbar left-1/2 right-0 h-screen overflow-y-scroll">
        <DrawerClose>
          <X className="absolute right-3 top-3" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Input your style Image here</DrawerTitle>
          <DrawerDescription>
            The more image you send in, the more accurately our model can
            generate
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-4 flex items-center justify-between">
          <Button
            onClick={() => navigateToStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <p>
            Step {currentStep}/{getMaxStep()}
          </p>
          <Button
            onClick={() => navigateToStep(currentStep + 1)}
            disabled={currentStep >= getMaxStep()}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        {inputData && (
          <div className="mx-4 mt-4 rounded-xl pb-4" key={`${currentStep - 1}`}>
            {renderInput(
              inputData,
              dispatch,
              generateStates,
              currentStep - 1,
              true,
              true,
            )}
          </div>
        )}
        <DrawerFooter>
          <Button variant={"outline"} onClick={addOrUpdateImageToData}>
            {currentStep >= getMaxStep() ? "Add Image" : "Update Image"}
          </Button>
          <Button onClick={submitData}>Generate With Style</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default StyleDrawer
