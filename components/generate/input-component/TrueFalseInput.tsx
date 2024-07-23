import { useEffect, useState } from "react"
import {
  setControlNetField,
  setField,
  setStyleField,
} from "../../../features/generateSlice"
import { useAppDispatch } from "../../../store/hooks"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"

const TrueFalseInput = ({
  name,
  type,
  defaultValue,
  arrayIndex,
  isStyleGenerate,
  isControlNets,
}: {
  name: string
  type: string
  defaultValue: boolean
  arrayIndex?: number
  isStyleGenerate?: boolean
  isControlNets?: boolean
}) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = () => {
    const newValue = !value
    setValue(newValue)
    if (isStyleGenerate) {
      dispatch(
        setStyleField({
          field: type,
          value: newValue,
          ArrayIndex: arrayIndex,
        }),
      )
    } else if (isControlNets) {
      dispatch(
        setControlNetField({
          field: type,
          value: newValue,
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
  }, [])

  return (
    <div className="flex justify-between">
      <Label htmlFor="truefalse" className="text-lg font-semibold">
        {name}
      </Label>
      <Switch
        id={type}
        className="bg-black"
        checked={value}
        onClick={handleValueChange}
      />
    </div>
  )
}

export default TrueFalseInput
