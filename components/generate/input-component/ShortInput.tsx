import { setHeight, setWidth } from "@/features/generateSlice"
import { useAppDispatch } from "@/store/hooks"
import { on } from "events"
import { useState } from "react"
import { ReactFormState } from "react-dom/client"

const ShortInput = ({ title, type }: { title: string; type: string }) => {
  const [current, setCurrent] = useState("")
  const dispatch = useAppDispatch()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(event.target.value)
    if (type === "height") {
      dispatch(setHeight({ height: Number(current) }))
    } else if (type === "width") {
      dispatch(setWidth({ width: Number(current) }))
    }
  }

  return (
    <div className="ml-2 flex w-full justify-between gap-2 py-2">
      <label htmlFor="currentInput">{title}:</label>
      <input
        id="currentInput"
        type="number"
        value={current}
        onChange={handleInputChange}
        className="w-full rounded px-2"
      />
    </div>
  )
}

export default ShortInput
