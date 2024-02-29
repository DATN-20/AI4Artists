import { on } from "events"
import { useState } from "react"
import { ReactFormState } from "react-dom/client"

const ShortInput = ({
  title,
  onValueChange,
}: {
  title: string
  onValueChange: (value: string) => void
}) => {
  const [current, setCurrent] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(event.target.value)
    onValueChange(event.target.value)
  }

  return (
    <div className="flex justify-between gap-2 py-2">
      <label htmlFor="currentInput">{title}</label>
      <input
        id="currentInput"
        type="text"
        value={current}
        onChange={handleInputChange}
        className="w-[150px] rounded px-2"
      />
    </div>
  )
}

export default ShortInput
