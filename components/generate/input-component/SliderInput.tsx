import { useState, useEffect, useRef } from "react"
import { Slider } from "../../ui/slider"
import { useAppDispatch } from "@/store/hooks"
import {
  selectGenerate,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"

const SliderInput = ({
  min,
  max,
  step,
  defaultValue,
  type,
  arrayIndex,
  isStyleGenerate,
}: {
  min: number
  max: number
  step: number
  defaultValue?: number
  type: string
  arrayIndex?: number
  isStyleGenerate?: boolean
}) => {
  const dispatch = useAppDispatch()

  const [value, setValue] = useState(
    defaultValue ?? Math.round((min + max) / 2),
  )

  const handleValueChange = (valueArray: number[], type: string) => {
    setValue(valueArray[0])

    if (isStyleGenerate) {
      dispatch(
        setStyleField({
          field: type,
          value: valueArray[0],
          ArrayIndex: arrayIndex,
        }),
      )
    } else {
      dispatch(setField({ field: type, value: valueArray[0] }))
    }
  }
  useEffect(() => {
    if (isStyleGenerate) {
      dispatch(
        setStyleField({
          field: type,
          value: value,
          ArrayIndex: arrayIndex,
        }),
      )
    } else {
      dispatch(setField({ field: type, value: value }))
    }
  }, [isStyleGenerate])

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
