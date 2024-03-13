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
import { Button } from "../../ui/button"

type ShortInputSelectProps = {
  data: Array<{
    label: string
    value: string
  }>
  onSelect: (value: string) => void
  content: string
}

const ShortInputSelect = ({
  data,
  onSelect,
  content,
}: ShortInputSelectProps) => {
  const [selected, setSelected] = useState("")

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-lg font-semibold">{content}</p>
      <Select>
        <SelectTrigger className=" w-[150px] bg-card-highlight">
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
    </div>
  )
}

export default ShortInputSelect
