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
import { useState } from "react"

type InputSelectProps = {
  data: Record<string, string>
  onSelect: (value: string) => void
  type: string
}

const InputSelect = ({ data, onSelect }: InputSelectProps) => {
  const [selected, setSelected] = useState("")

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }

  const dataArray = Object.entries(data)

  return (
    <Select>
      <SelectTrigger className="bg-card-highlight">
        {/* <SelectValue
          placeholder={"dataArray.length > 0 ? dataArray[0][1] : """}
        /> */}
        <SelectValue placeholder={"Anime"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataArray.map(([key, value], index) => (
            <SelectItem
              key={index}
              value={value}
              onSelect={() => handleSelect(value)}
            >
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default InputSelect
