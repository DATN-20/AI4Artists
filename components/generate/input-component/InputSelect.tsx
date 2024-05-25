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
import { LuType } from "react-icons/lu"
import { useSelector } from "react-redux"

type InputSelectProps = {
  data: Record<string, string>
  type: string
  arrayType?: string
  defaultValue?: string
  arrayIndex?: number
  isStyleGenerate?: boolean
}

const InputSelect = ({
  data,
  type,
  arrayType,
  defaultValue,
  arrayIndex,
  isStyleGenerate,
}: InputSelectProps) => {
  const dispatch = useAppDispatch()
  const handleSelect = (value: string) => {
    if (arrayType) {
      if (isStyleGenerate) {
        dispatch(
          setStyleField({
            field: type,
            value: value,
            ArrayIndex: arrayIndex,
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
    if (arrayType) {
      if (isStyleGenerate) {
        dispatch(
          setStyleField({
            field: type,
            value: defaultValue,
            ArrayIndex: arrayIndex,
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
  }, [arrayIndex])


  return (
    <Select
      onValueChange={(value) => {
        handleSelect(value)
      }}
    >
      <SelectTrigger className="bg-card-highlight">
        <SelectValue placeholder={defaultValue} />
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
