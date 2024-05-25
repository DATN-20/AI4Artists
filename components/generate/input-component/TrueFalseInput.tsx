import { useEffect, useState } from "react"
import { setField } from "../../../features/generateSlice"
import { useAppDispatch } from "../../../store/hooks"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"

const TrueFalseInput = ({
  name,
  type,
  defaultValue,
  arrayType,
  arrayIndex,
  isStyleGenerate,
}: {
  name: string
  type: string
  defaultValue: boolean
  arrayType?: string
  arrayIndex?: number
  isStyleGenerate?: boolean
}) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = () => {
    const newValue = !value
    setValue(newValue)
    if (arrayType) {
      if (isStyleGenerate) {
        dispatch(
          setField({
            field: `${arrayType}[${arrayIndex}].${type}`,
            value: newValue,
          }),
        )
      } else {
        dispatch(
          setField({ field: `${arrayType}[0].${type}`, value: newValue }),
        )
      }
    } else {
      dispatch(setField({ field: type, value: value }))
    }
  }

  useEffect(() => {
    if (arrayType) {
      if (isStyleGenerate) {
        dispatch(
          setField({
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
