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
  data: Array<{
    label: string
    value: string
  }>
  onSelect: (value: string) => void
}

const InputSelect = ({ data, onSelect }: InputSelectProps) => {
  const [selected, setSelected] = useState("")

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={data[0].label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item, index) => (
            <SelectItem
              key={index}
              value={item.value}
              onSelect={() => handleSelect(item.value)}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default InputSelect
