import { useEffect, useState } from "react"
import clsx from "clsx"
import { Button } from "../../ui/button"
import { useAppDispatch } from "@/store/hooks"
import {
  selectGenerate,
  setDimension,
  setStyleDimension,
  setUseCustomDimension,
} from "@/features/generateSlice"
import { useSelector } from "react-redux"
import SliderInput from "./SliderInput"
import CollapsibleSection from "../CollapsibleSection"

type Option = {
  label: string
  value: string
}

const ChooseInput = ({
  options,
  type,
  isStyle = false,
}: {
  options: Option[]
  type: string
  isStyle?: boolean
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(options[0].value)
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)

  const handleSelect = (value: string, type: string) => {
    setSelectedValue(value)
    if (type === "dimension") {
      const dimensions: { [key: string]: { width: number; height: number } } = {
        "1": { width: 512, height: 512 },
        "2": { width: 768, height: 768 },
        "3": { width: 512, height: 1024 },
        "4": { width: 768, height: 1024 },
        "5": { width: 1024, height: 768 },
        default: { width: 1024, height: 1024 },
      }

      const dimension = dimensions[value] || dimensions["default"]

      if (isStyle) {
        dispatch(setStyleDimension(dimension))
      } else {
        dispatch(setDimension(dimension))
      }
    }
  }
  useEffect(() => {
    if (type === "dimension") {
      if (isStyle) {
        dispatch(setStyleDimension({ width: 512, height: 512 }))
      } else {
        dispatch(setDimension({ width: 512, height: 512 }))
      }
    }
  }, [isStyle])

  return (
    <div className="-mx-2 flex flex-wrap items-center">
      {options.map((option, index) => (
        <div key={index} className="mb-2 w-1/2 px-2">
          <Button
            variant={"outline"}
            disabled={generateStates.useCustomDimension && type === "dimension"}
            className={clsx(
              "w-full rounded-lg border-2 border-primary-700 px-4 py-2 text-primary-700 text-text transition-colors",
              {
                "bg-accent text-primary-700": selectedValue === option.value,
                "border-card-hightlight border-none":
                  selectedValue !== option.value,
              },
            )}
            onClick={() => handleSelect(option.value, type)}
          >
            {option.label}
          </Button>
        </div>
      ))}
      {type === "dimension" && (
        <>
          <Button
            variant={"outline"}
            className="mb-5 ml-2  mt-[16px] w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
            onClick={() => {
              dispatch(
                setUseCustomDimension({
                  useCustomDimension: !generateStates.useCustomDimension,
                }),
              )
            }}
          >
            Use Custom Dimension
          </Button>
          {generateStates.useCustomDimension && (
            <>
              <CollapsibleSection title={"Width"} key={"width"}>
                <SliderInput
                  min={64}
                  max={1280}
                  step={1}
                  defaultValue={512}
                  type="width"
                />
              </CollapsibleSection>
              <CollapsibleSection title={"Height"} key={"height"}>
                <SliderInput
                  min={64}
                  max={1280}
                  step={1}
                  defaultValue={512}
                  type="height"
                />
              </CollapsibleSection>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ChooseInput
