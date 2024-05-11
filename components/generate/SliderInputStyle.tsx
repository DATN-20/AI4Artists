import { useState, useEffect, useRef } from "react"
import { useAppDispatch } from "@/store/hooks"
import { Slider } from "../ui/slider"

const SliderInputStyle = ({
  min,
  max,
  step,
  defaultValue,
  handleValueChange,
  value,
  setValue,
}: {
  min: number
  max: number
  step: number
  defaultValue?: number
  handleValueChange: (value: number) => void
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}) => {
  return (
    <>
      <div className="flex w-full justify-between">
        <Slider
          min={min}
          max={max}
          step={step}
          defaultValue={[defaultValue ?? Math.round((min + max) / 2)]}
          onValueChange={(valueArray: number[]) => {
            setValue(valueArray[0])
            handleValueChange(valueArray[0])
          }}
          value={[value]}
          className="w-4/5 "
        />
        <div className=" px-4 py-2 text-lg">{value}</div>
      </div>
    </>
  )
}

export default SliderInputStyle
