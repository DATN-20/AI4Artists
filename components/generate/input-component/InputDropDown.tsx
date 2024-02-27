"use client"
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type InputDropDownProps = {
  data: Array<{
    label: string
    value: string
  }>
  onSelect: (value: string) => void
}

const InputDropDown = ({ data, onSelect }: InputDropDownProps) => {
  const [selected, setSelected] = useState("")

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selected || "Select an option"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {data.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => handleSelect(item.value)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default InputDropDown
