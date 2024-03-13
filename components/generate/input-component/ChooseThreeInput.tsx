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
    <div className="flex gap-2">
      {options.map((option, index) => (
        <Button
          variant={"outline"}
          className={clsx(
            "w-full rounded-lg border px-4 py-2 text-text transition-colors",
            {
              "bg-accent text-accent-foreground":
                selectedValue === option.value,
              "border-card-hightlight border-none":
                selectedValue !== option.value,
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
