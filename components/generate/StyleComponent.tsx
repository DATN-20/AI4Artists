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
import {
  useGenerateStyleImageMutation,
  useGetGenerationHistoryQuery,
} from "@/services/generate/generateApi"
import { renderInput } from "./renderInput"
import { base64StringToFile } from "@/lib/base64StringToFile"
import { toast } from "react-toastify"
import { TagsContext } from "../../store/tagsHooks"
import { eraseStyleStep } from "../../features/generateSlice"
import { Collapsible } from "@radix-ui/react-collapsible"
import CollapsibleSection from "./CollapsibleSection"
import { Carousel, CarouselContent } from "../ui/carousel"

const StyleComponent = ({
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
      if (currentStep === step - 1) {
        const currentStepData = generateStates.dataStyleInputs?.find(
          (input: any) =>
            input.ArrayIndex === currentStep - 1 &&
            input.name === "imageForIpadapter",
        )

        if (!currentStepData || !currentStepData.value) {
          toast.error("Please fill the imageForIpadapter field")
          return
        }
      }
      setCurrentStep(step)
    }
  }

  const addOrUpdateImageToData = () => {
    navigateToStep(currentStep + 1)
  }

  const handleEraseStep = (ArrayIndex: number) => {
    if (ArrayIndex !== 0) {
      dispatch(eraseStyleStep({ ArrayIndex }))
      if (currentStep > ArrayIndex) {
        setCurrentStep(currentStep - 1)
      }
    } else {
      toast.error("Cannot erase the initial step.")
    }
  }

  useEffect(() => {
    if (!openStyleDrawer) {
      setCurrentStep(getMaxStep())
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
      const positivePromptCheck = generateStates.dataStyleInputs?.find(
        (input: any) => input.name === "positivePrompt",
      )

      if (!positivePromptCheck || positivePromptCheck.value.trim() === "") {
        toast.error("Please fill all Input field")
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
      try {
        await generateStyle(formData).unwrap()
      } catch (error) {
        toast.error("Error generating image:")
      }
      setOpenStyleDrawer(false)
    } else {
      toast.error("Please fill all Input field")
    }
  }

  return (
    <>
      <CollapsibleSection
        title={"Generate with Style"}
        key={"generate-with-style"}
        desc={"Generate an image with style"}
        containerStyle="px-2 py-3 bg-card rounded-xl "
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <Button
              onClick={() => navigateToStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="bg-transparent p-0"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <div className="flex-1">
              {inputData && (
                <div className="rounded-xl pb-4" key={`${currentStep - 1}`}>
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
            </div>
            <Button
              onClick={() => navigateToStep(currentStep + 1)}
              disabled={currentStep >= getMaxStep()}
              className="bg-transparent p-0"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold">
              Step {currentStep}/{getMaxStep()}
            </p>
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                onClick={() => handleEraseStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                Erase Step
              </Button>
              {currentStep === getMaxStep() && (
                <Button variant={"outline"} onClick={addOrUpdateImageToData}>
                  Add Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </>
  )
}

export default StyleComponent
