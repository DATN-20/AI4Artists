"use client"
import InputDropDown from "../generate/input-component/InputDropDown"
import { Card } from "../ui/card"

export default function GenerateSideBar() {
  const dropdownData = [
    { label: "Profile", value: "profile" },
    { label: "Settings", value: "settings" },
  ]

  const handleSelection = (value) => {
    console.log("Selected:", value)
    // Handle the selected value here (e.g., update state or navigate)
  }
  return (
    <div className="no-scrollbarflex h-screen min-h-screen flex-col gap-4 overflow-y-scroll p-4 ">
      <Card className="">
        <InputDropDown data={dropdownData} onSelect={handleSelection} />
      </Card>
    </div>
  )
}
