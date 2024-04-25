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
import ImageInputStyle from "./ImageInputStyle"
import SliderInputStyle from "./SliderInputStyle"
import CollapsibleSection from "./CollapsibleSection"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { ChevronRight } from "lucide-react"

const StyleDrawer = () => {
  const [imagesData, setImagesData] = useState<
    Array<{ image: File | null; strength: number; noise: number }>
  >([])
  const [currentImage, setCurrentImage] = useState<File | null>(null)
  const [currentStrength, setCurrentStrength] = useState(1)
  const [currentNoise, setCurrentNoise] = useState(0.1)
  const [currentStep, setCurrentStep] = useState(1)

  const [open, setOpen] = useState(false)

  const handleImageChange = (image: File) => {
    setCurrentImage(image)
  }

  const handleValueChange = (value: number, type: string) => {
    if (type === "strength") {
      setCurrentStrength(value)
    } else if (type === "noise") {
      setCurrentNoise(value)
    }
  }

  const navigateToStep = (step: number, maxSteps: number) => {
    if (step >= 1 && step <= maxSteps) {
      console.log("Navigating to step:", step)
      setCurrentStep(step)
      const imageData = imagesData[step - 1]
      if (imageData) {
        setCurrentImage(imageData.image)
        setCurrentStrength(imageData.strength)
        setCurrentNoise(imageData.noise)
      } else {
        setCurrentImage(null)
        setCurrentStrength(1)
        setCurrentNoise(0.1)
      }
    }
  }

  const addOrUpdateImageToData = () => {
    const newData = {
      image: currentImage,
      strength: currentStrength,
      noise: currentNoise,
    }
    let updatedImagesData = [...imagesData]
    if (currentStep - 1 < imagesData.length) {
      updatedImagesData[currentStep - 1] = newData
      setImagesData(updatedImagesData)
    } else {
      setImagesData((prevImagesData) => {
        const updatedImagesData = [...prevImagesData, newData]
        const newStep = currentStep + 1
        const maxSteps = updatedImagesData.length + 1;
        navigateToStep(newStep, maxSteps)
        return updatedImagesData
      })
    }
  }

  useEffect(() => {
    if (!open) {
      setCurrentImage(null)
      setCurrentStrength(1)
      setCurrentNoise(0.1)
      setImagesData([])
      setCurrentStep(1)
    }
  }, [open])

  const submitData = () => {
    console.log(imagesData)
  }

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
          className="mt-[16px] w-fit  rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
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
            The more image you sent in, the more exactly our model can generate
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center justify-between mx-4">
          <Button
            onClick={() => navigateToStep(currentStep - 1, imagesData.length + 1)}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <p>
            Step {currentStep}/{imagesData.length + 1}
          </p>
          <Button
            onClick={() => navigateToStep(currentStep + 1, imagesData.length + 1)}
            disabled={currentStep > imagesData.length}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col">
          <ImageInputStyle
            onImageChange={handleImageChange}
            selectedImage={currentImage}
            setSelectedImage={setCurrentImage}
          />
          <div className="flex flex-col">
            <CollapsibleSection title={"Strength"}>
              <SliderInputStyle
                min={0}
                max={2}
                step={0.1}
                defaultValue={currentStrength}
                handleValueChange={(value) =>
                  handleValueChange(value, "strength")
                }
                value={currentStrength}
                setValue={setCurrentStrength}
              />
            </CollapsibleSection>
            <CollapsibleSection title={"Noise Agementation"}>
              <SliderInputStyle
                min={0}
                max={1}
                step={0.1}
                defaultValue={currentNoise}
                handleValueChange={(value) => handleValueChange(value, "noise")}
                value={currentNoise}
                setValue={setCurrentNoise}
              />
            </CollapsibleSection>
          </div>
        </div>
        <DrawerFooter>
          <Button variant={"outline"} onClick={addOrUpdateImageToData}>
            {currentStep > imagesData.length ? "Add Image" : "Update Image"}
          </Button>
          <Button onClick={submitData}>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default StyleDrawer
