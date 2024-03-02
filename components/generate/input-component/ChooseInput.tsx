import { useState } from "react"
import clsx from "clsx"
import { Button } from "../../ui/button"

type Option = {
  label: string
  value: string
}

const ChooseInput = ({
  options,
  onSelect,
  type,
}: {
  options: Option[]
  type: string
  onSelect: (value: string) => void
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(options[0].value)

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onSelect(value)
    console.log("You selected: ", value)
  }

  return (
    <div className="-mx-2 flex flex-wrap items-center">
      {options.map((option, index) => (
        <div key={index} className="mb-2 w-1/2 px-2">
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
        </div>
      ))}
    </div>
  )
}

export default ChooseInput
