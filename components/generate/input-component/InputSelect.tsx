"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setSample, setStyle } from "@/features/generateSlice"
import { useAppDispatch } from "@/store/hooks"
import { useState } from "react"

type InputSelectProps = {
  data: Record<string, string>
  onSelect: (value: string) => void
  type: string
}

const InputSelect = ({ data, onSelect, type }: InputSelectProps) => {
  const [selected, setSelected] = useState("")
  const dispatch = useAppDispatch()

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
    if (type === "style") {
      dispatch(setStyle({ style: value }))
    } else if (type === "sampleMethos") {
      dispatch(setSample({ sample: value }))
    }
  }

  const dataArray = Object.entries(data)

  const firstChoiceKey = dataArray.length > 0 ? dataArray[0][0] : ""

  return (
    <Select>
      <SelectTrigger className="bg-card-highlight">
        <SelectValue placeholder={firstChoiceKey} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataArray.map(([key, value], index) => (
            <SelectItem
              key={index}
              value={value}
              onSelect={() => handleSelect(value)}
            >
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default InputSelect
