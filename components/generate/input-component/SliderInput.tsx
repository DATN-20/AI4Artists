import { useState, useEffect, useRef } from "react"
import { Slider } from "../../ui/slider"

const SliderInput = ({
  min,
  max,
  step,
  defaultValue,
}: {
  min: number
  max: number
  step: number
  defaultValue?: number
}) => {
  const [value, setValue] = useState(
    defaultValue ?? Math.round((min + max) / 2),
  )

  const handleValueChange = (valueArray: number[]) => {
    setValue(valueArray[0])
  }

  return (
    <>
      <div className="flex w-full justify-between">
        <Slider
          min={min}
          max={max}
          step={step}
          defaultValue={[defaultValue ?? Math.round((min + max) / 2)]}
          onValueChange={handleValueChange}
          value={[value]}
          className="w-4/5 "
        />
        <div className=" px-4 py-2 text-lg">{value}</div>
      </div>
    </>
  )
}

export default SliderInput
