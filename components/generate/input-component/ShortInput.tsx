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
    <div className="flex items-center space-x-2 rounded bg-gray-700 p-2">
      <label htmlFor="currentInput" className="text-white">
        {title}
      </label>
      <input
        id="currentInput"
        type="text"
        value={current}
        onChange={handleInputChange}
        className="rounded bg-gray-600 px-2 text-white"
      />
    </div>
  )
}

export default ShortInput
