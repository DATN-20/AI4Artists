"use client"

import { useEffect } from "react"
import CollapsibleSection from "../generate/CollapsibleSection"
import ChooseInput from "../generate/input-component/ChooseInput"
import InputSelect from "../generate/input-component/InputSelect"
import SliderInput from "../generate/input-component/SliderInput"
import { Card, CardHeader } from "../ui/card"
import { useSelector } from "react-redux"
import { selectGenerate } from "@/features/generateSlice"
import Image from "next/image"
import { ArrowLeftFromLine } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GenerateSideBar() {
  const generateStates = useSelector(selectGenerate)
  const aiInputs = generateStates.aiInputs
  const router = useRouter()
  useEffect(() => {}, [])

  const dropdownData = [
    { label: "Profile", value: "profile" },
    { label: "Settings", value: "settings" },
  ]

  const chooseInputOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
    { label: "Option 5", value: "option5" },
    { label: "Option 6", value: "option6" },
  ]

  const dimensionOptions = [
    { label: "512 x 512", value: "1" },
    { label: "768 x 768", value: "2" },
    { label: "512 x 1024", value: "3" },
    { label: "768 x 1024", value: "4" },
    { label: "1024 x 768", value: "5" },
    { label: "1024 x 1024", value: "6" },
  ]

  const numberImageOptions = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
  ]

  const chooseThreeInputOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ]

  const handleInputDropDownSelection = (value: string) => {
    console.log("Selected:", value)
  }

  const handleChooseInputSelection = (value: string) => {
    console.log("You selected:", value)
  }

  const handleShortInputValueChange = (value: string) => {
    console.log("You entered:", value)
  }

  const handleChooseThreeInputSelection = (value: string) => {
    console.log("You selected:", value)
  }

  const renderInput = (input: any) => {
    const {
      name,
      type,
      default: defaultValue,
      input_property_name: propertyName,
      info,
    } = input

    switch (type) {
      case "choice":
        return (
          <CollapsibleSection title={name} key={propertyName}>
            <InputSelect
              data={info.choices}
              onSelect={(value) => console.log(`Selected ${name}:`, value)}
              type={propertyName}
            />
          </CollapsibleSection>
        )

      case "slider":
        return (
          <CollapsibleSection title={name} key={propertyName}>
            <SliderInput
              min={info.min}
              max={info.max}
              step={info.step}
              defaultValue={defaultValue}
              type={propertyName}
            />
          </CollapsibleSection>
        )
      default:
        return null
    }
  }

  return (
    <Card className="flex w-full flex-col border-none lg:border">
      <CardHeader className="relative mt-2 flex flex-row items-center justify-center space-y-0 p-0">
        <ArrowLeftFromLine
          className="absolute left-3 top-5 h-[42px] w-[42px]"
          onClick={() => {
            router.push("/dashboard")
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.cursor = "pointer"
          }}
        />
        <Image src="/logo.png" alt="logo" width={70} height={70} />
      </CardHeader>
      {aiInputs && generateStates.useImage && (
        <CollapsibleSection title={"Noise"}>
          <SliderInput
            min={aiInputs[0]?.inputs[9].min || 0}
            max={aiInputs[0]?.inputs[9].max || 1}
            step={aiInputs[0]?.inputs[9].step || 0.01}
            defaultValue={0.75}
            type="noise"
          />
        </CollapsibleSection>
      )}

      {aiInputs &&
        aiInputs.map((aiInput) => (
          <Card key={aiInput.ai_name} className="border-none lg:border">
            {aiInput.inputs.map((input) => {
              if (
                input.input_property_name === "image" ||
                input.input_property_name === "noise" ||
                input.input_property_name === "positivePrompt" ||
                input.input_property_name === "negativePrompt" ||
                input.input_property_name === "height"
              ) {
                return null
              }
              if (input.input_property_name === "width") {
                return (
                  <CollapsibleSection
                    title={"Image Dimensions"}
                    key="image-dimensions"
                  >
                    <ChooseInput
                      options={dimensionOptions}
                      onSelect={handleChooseInputSelection}
                      type="dimension"
                    />
                  </CollapsibleSection>
                )
              }

              return renderInput(input)
            })}
          </Card>
        ))}
    </Card>
  )
}
