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

  const sliderRef = useRef<HTMLDivElement>(null)

  const [leftPosition, setLeftPosition] = useState("50%")

  const handleValueChange = (valueArray: number[]) => {
    setValue(valueArray[0])
  }

  useEffect(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth + 1
      const newPosition = ((value - min) / (max - min)) * sliderWidth
      setLeftPosition(`${newPosition}px`)
    }
  }, [value, min, max])

  return (
    <>
      <div className="flex gap-2">
        <p className="text-lg">{min}</p>
        <div className="mt-2 w-full">
          <div ref={sliderRef} className="my-auto">
            <Slider
              min={min}
              max={max}
              step={step}
              defaultValue={[defaultValue ?? Math.round((min + max) / 2)]}
              onValueChange={handleValueChange}
              value={[value]}
            />
          </div>
          <div
            className="relative pt-2 text-center text-lg"
            style={{
              left: leftPosition,
              transform: "translateX(-50%)",
            }}
          >
            {value}
          </div>
        </div>
        <p className="text-lg">{max}</p>
      </div>
    </>
  )
}

export default SliderInput
