"use client"

import CollapsibleSection from "../generate/CollapsibleSection"
import ChooseInput from "../generate/input-component/ChooseInput"
import ChooseThreeInput from "../generate/input-component/ChooseThreeInput"
import InputSelect from "../generate/input-component/InputSelect"
import ShortInput from "../generate/input-component/ShortInput"
import ShortInputSelect from "../generate/input-component/ShortInputSelect"
import SliderInput from "../generate/input-component/SliderInput"
import { Card } from "../ui/card"

export default function GenerateSideBar() {
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
    <div className="fixed left-0 top-0 w-1/5 p-4">
      <Card className="no-scrollbar flex h-screen min-h-screen w-full flex-col overflow-y-scroll">
        <CollapsibleSection title={"Input Select"}>
          <InputSelect
            data={dropdownData}
            onSelect={handleInputDropDownSelection}
          />
        </CollapsibleSection>
        <CollapsibleSection title={"Choose Input"}>
          <ChooseInput
            options={chooseInputOptions}
            onSelect={handleChooseInputSelection}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Slider Input">
          <SliderInput min={1} max={10} step={1} />
        </CollapsibleSection>
        <CollapsibleSection title={"Short Input Select"}>
          <ShortInputSelect
            data={dropdownData}
            onSelect={handleInputDropDownSelection}
            content={"Content"}
          />
        </CollapsibleSection>
        <CollapsibleSection title={"Short Input"}>
          <ShortInput
            title="Current"
            onValueChange={handleShortInputValueChange}
          />
        </CollapsibleSection>
        <CollapsibleSection title={"Short Input"}>
          <ShortInput
            title="Current"
            onValueChange={handleShortInputValueChange}
          />
        </CollapsibleSection>
        <CollapsibleSection title={"Choose Input"}>
          <ChooseThreeInput
            options={chooseThreeInputOptions}
            onSelect={handleChooseThreeInputSelection}
          />
        </CollapsibleSection>
      </Card>
    </div>
  )
}
