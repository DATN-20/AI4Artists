"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  setControlNetField,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { useAppDispatch } from "@/store/hooks"
import { useEffect } from "react"

type InputSelectProps = {
  data: Record<string, string>
  type: string
  defaultValue?: string
  arrayIndex?: number
  isStyleGenerate?: boolean
  isControlNets?: boolean
}

const InputSelect = ({
  data,
  type,
  defaultValue,
  arrayIndex,
  isStyleGenerate,
  isControlNets,
}: InputSelectProps) => {
  const dispatch = useAppDispatch()
  const handleSelect = (value: string) => {
    if (isStyleGenerate) {
      dispatch(
        setStyleField({
          field: type,
          value: value,
          ArrayIndex: arrayIndex,
        }),
      )
    } else if (isControlNets) {
      dispatch(
        setControlNetField({
          field: type,
          value: value,
          ArrayIndex: arrayIndex,
        }),
      )
    } else {
      dispatch(setField({ field: type, value: value }))
    }
  }

  useEffect(() => {
    if (isStyleGenerate) {
      dispatch(
        setStyleField({
          field: type,
          value: defaultValue,
          ArrayIndex: arrayIndex,
        }),
      )
    } else if (isControlNets) {
      dispatch(
        setControlNetField({
          field: type,
          value: defaultValue,
          ArrayIndex: arrayIndex,
        }),
      )
    } else {
      dispatch(setField({ field: type, value: defaultValue }))
    }
  }, [arrayIndex, isStyleGenerate, type, defaultValue])

  const findDefaultValue = (data: any, defaultValue: string | undefined) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === defaultValue) {
        return key
      }
    }
    return null // Return null if the defaultValue is not found
  }

  return (
    <Select
      onValueChange={(value) => {
        handleSelect(value)
      }}
    >
      <SelectTrigger className="bg-card-highlight">
        <SelectValue placeholder={findDefaultValue(data, defaultValue)} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(data).map(([key, value], index) => (
            <SelectItem key={index} value={value}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default InputSelect
