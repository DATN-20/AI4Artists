import { useState, useEffect, useRef } from "react"
import { Slider } from "../../ui/slider"
import { useAppDispatch } from "@/store/hooks"
import { setCFG, setNoise, setSteps } from "@/features/generateSlice"

const SliderInput = ({
  min,
  max,
  step,
  defaultValue,
  type,
}: {
  min: number
  max: number
  step: number
  defaultValue?: number
  type: string
}) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(
    defaultValue ?? Math.round((min + max) / 2),
  )

  const handleValueChange = (valueArray: number[], type: string) => {
    setValue(valueArray[0])
    if (type === "steps") {
      dispatch(setSteps({ steps: valueArray[0] }))
    } else if (type === "cfg") {
      dispatch(setCFG({ cfg: valueArray[0] }))
    } else if (type === "noise") {
      dispatch(setNoise({ noise: valueArray[0] }))
    }
  }

  return (
    <>
      <div className="flex w-full justify-between">
        <Slider
          min={min}
          max={max}
          step={step}
          defaultValue={[defaultValue ?? Math.round((min + max) / 2)]}
          onValueChange={(valueArray: number[]) =>
            handleValueChange(valueArray, type)
          }
          value={[value]}
          className="w-4/5 "
        />
        <div className=" px-4 py-2 text-lg">{value}</div>
      </div>
    </>
  )
}

export default SliderInput
