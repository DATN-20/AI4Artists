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
}: {
  name: string
  type: string
  defaultValue: boolean
  arrayType?: string
}) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = () => {
    const newValue = !value
    setValue(newValue)
    dispatch(setField({ field: `${arrayType}[0].${type}`, value: value }))
  }

  useEffect(() => {
    dispatch(
      setField({ field: `${arrayType}[0].${type}`, value: defaultValue }),
    )
  }, [])

  return (
    <div className="flex justify-between">
      <Label htmlFor="array-mode" className="text-lg font-semibold">
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
