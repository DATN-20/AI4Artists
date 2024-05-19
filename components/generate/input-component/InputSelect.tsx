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
import {
  selectGenerate,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { useAppDispatch } from "@/store/hooks"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

type InputSelectProps = {
  data: Record<string, string>
  onSelect: (value: string) => void
  type: string
  arrayType?: string
  arrayIndex?: number
  isStyleGenerate?: boolean
}

const InputSelect = ({
  data,
  onSelect,
  type,
  arrayType,
  arrayIndex,
  isStyleGenerate,
}: InputSelectProps) => {
  const [selected, setSelected] = useState("")
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)

    if (arrayType) {
      if (isStyleGenerate) {
        dispatch(
          setStyleField({
            field: `${arrayType}[${arrayIndex}].${type}`,
            value: value,
          }),
        )
      } else {
        dispatch(setField({ field: `${arrayType}[0].${type}`, value: value }))
      }
    } else {
      dispatch(setField({ field: type, value: value }))
    }
  }

  useEffect(() => {
    const defaultValue = Object.values(data)[0]
    if (defaultValue) {
      if (arrayType) {
        if (isStyleGenerate) {
          dispatch(
            setStyleField({
              field: `${arrayType}[${arrayIndex}].${type}`,
              value: defaultValue,
            }),
          )
        } else {
          dispatch(
            setField({ field: `${arrayType}[0].${type}`, value: defaultValue }),
          )
        }
      } else {
        dispatch(setField({ field: type, value: defaultValue }))
      }
      setSelected(defaultValue)
    }
  }, [arrayIndex])

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
