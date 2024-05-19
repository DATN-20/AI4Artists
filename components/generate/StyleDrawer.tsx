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
import { useEffect, useState } from "react"
import { useAiStyleInformationMutation } from "../../services/generate/generateApi"
import { renderInput } from "./renderInput"
import { useAppDispatch } from "../../store/hooks"
import { useSelector } from "react-redux"
import {
  selectGenerate,
  setStyleField,
  eraseStyleFields,
} from "../../features/generateSlice"

const StyleDrawer = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)

  const [aiStyleInformation, { data: inputData }] =
    useAiStyleInformationMutation()

  useEffect(() => {
    const fetchData = async () => {
      await aiStyleInformation(undefined)
    }
    fetchData()
  }, [])

  const [open, setOpen] = useState(false)

  const getMaxStep = () => {
    const maxIndex =
      generateStates.dataStyleInputs?.reduce((max, item) => {
        const match = item.name.match(/ipadapterStyleTranferInputs\[(\d+)\]/)
        if (match) {
          const index = parseInt(match[1], 10)
          return index > max ? index : max
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

  const eraseStep = () => {
    dispatch(
      eraseStyleFields({
        arrayType: "ipadapterStyleTranferInputs",
        arrayIndex: currentStep - 1,
      }),
    )
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  useEffect(() => {
    if (!open) {
      setCurrentStep(1)
    }
  }, [open])

  const submitData = () => {
    console.log(generateStates.dataStyleInputs)
  }

  useEffect(() => {
    console.log("datastyle input", generateStates.dataStyleInputs)
  }, [generateStates.dataStyleInputs])

  return (
    <Drawer
      direction="right"
      dismissible={false}
      open={open}
      onOpenChange={setOpen}
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
        {inputData &&
          inputData[0].inputs.map((input: any, index: number) => {
            if (input.input_property_name === "ipadapterStyleTranferInputs") {
              return (
                <div className="mx-4 mt-4 rounded-xl pb-4" key={index}>
                  {renderInput(
                    input,
                    dispatch,
                    generateStates,
                    input.input_property_name,
                    currentStep - 1,
                    true,
                  )}
                </div>
              )
            }
            return null
          })}
        <DrawerFooter>
          <Button variant={"outline"} onClick={addOrUpdateImageToData}>
            {currentStep >= getMaxStep() ? "Add Image" : "Update Image"}
          </Button>
          <Button
            variant={"outline"}
            onClick={eraseStep}
            disabled={currentStep === 1}
          >
            Erase Step
          </Button>
          <Button onClick={submitData}>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default StyleDrawer
