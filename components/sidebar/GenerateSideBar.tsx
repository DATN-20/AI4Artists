"use client"

import { useEffect } from "react"
import CollapsibleSection from "../generate/CollapsibleSection"
import ChooseInput from "../generate/input-component/ChooseInput"
import ChooseThreeInput from "../generate/input-component/ChooseThreeInput"
import InputSelect from "../generate/input-component/InputSelect"
import ShortInput from "../generate/input-component/ShortInput"
import ShortInputSelect from "../generate/input-component/ShortInputSelect"
import SliderInput from "../generate/input-component/SliderInput"
import { Card } from "../ui/card"
import { useSelector } from "react-redux"
import { selectGenerate } from "@/features/generateSlice"

export default function GenerateSideBar() {
  const generateStates = useSelector(selectGenerate)
  const aiInputs = generateStates.aiInputs
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

  return (
    <Card className="no-scrollbar flex w-full flex-col overflow-y-scroll border-none lg:border">
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
      {aiInputs && (
        <Card className="border-none lg:border">
          <CollapsibleSection title={aiInputs[0]?.inputs[0].name}>
            <InputSelect
              data={aiInputs[0]?.inputs[0]?.info?.choices || {}}
              onSelect={handleInputDropDownSelection}
              type="style"
            />
          </CollapsibleSection>
          <CollapsibleSection title={"Image Dimensions"}>
            <ChooseInput
              options={dimensionOptions}
              onSelect={handleChooseInputSelection}
              type="dimension"
            />
          </CollapsibleSection>
          <CollapsibleSection title={"Number of Image"}>
            <ChooseInput
              options={numberImageOptions}
              onSelect={handleChooseInputSelection}
              type="numberOfImage"
            />
          </CollapsibleSection>
          <CollapsibleSection title={"Steps"}>
            <SliderInput
              min={aiInputs[0]?.inputs[6].min || 1}
              max={aiInputs[0]?.inputs[6].max || 50}
              step={1}
              defaultValue={20}
              type="steps"
            />
          </CollapsibleSection>
          <CollapsibleSection title={aiInputs[0]?.inputs[7].name}>
            <InputSelect
              data={aiInputs[0]?.inputs[7]?.info?.choices || {}}
              onSelect={handleInputDropDownSelection}
              type="sampling"
            />
          </CollapsibleSection>
          <CollapsibleSection title={"CFG"}>
            <SliderInput
              min={aiInputs[0]?.inputs[8].min || 1}
              max={aiInputs[0]?.inputs[8].max || 30}
              step={1}
              defaultValue={8}
              type="cfg"
            />
          </CollapsibleSection>
        </Card>
      )}
    </Card>
  )
}
