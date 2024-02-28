import { useState } from "react"
import clsx from "clsx"
import { Button } from "../../ui/button"

type Option = {
  label: string
  value: string
}

const ChooseThreeInput = ({
  options,
  onSelect,
}: {
  options: Option[]
  onSelect: (value: string) => void
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("")

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onSelect(value)
    console.log("You selected: ", value)
  }

  return (
    <div className="flex gap-3">
      {options.map((option, index) => (
        <Button
          key={index}
          className={clsx(
            "w-full rounded-lg border px-4 py-2 transition-colors",
            "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
            {
              "bg-lightblue-500 border-blue-500 text-primary":
                selectedValue === option.value,
              "border-gray-300 bg-white": selectedValue !== option.value,
            },
          )}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export default ChooseThreeInput
