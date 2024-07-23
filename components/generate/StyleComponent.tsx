"use client"

import { Button } from "../ui/button"
import {  ChevronLeft, ChevronRight } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import {
  useGenerateStyleImageMutation,
} from "@/services/generate/generateApi"
import { renderInput } from "./renderInput"
import { base64StringToFile } from "@/lib/base64StringToFile"
import { toast } from "react-toastify"
import { TagsContext } from "../../store/tagsHooks"
import { eraseStyleStep } from "../../features/generateSlice"
import CollapsibleSection from "./CollapsibleSection"

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
                    false
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
