"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  setAIName,
  setAIStyleInputs,
  setInputs,
} from "@/features/generateSlice"
import { useAppDispatch } from "@/store/hooks"
import { useEffect, useState } from "react"
import {
  useAiInformationQuery,
  useAiStyleInformationQuery,
} from "@/services/generate/generateApi"

const ChooseAiInput = () => {
  const dispatch = useAppDispatch()
  const { data: inputData, refetch: refetchData } = useAiInformationQuery()
  const { data: inputStyleData, refetch: refetchStyleData } =
    useAiStyleInformationQuery()
  const [selectedAI, setSelectedAI] = useState(inputData?.[0]?.ai_name || "")
  const initialAIName =
    inputData?.[0]?.ai_name.replace("comfy_ui", "comfyUI") || ""

  useEffect(() => {
    if (inputData) {
      setSelectedAI(initialAIName)
      dispatch(
        setAIName({
          ai_name: initialAIName,
        }),
      )
      dispatch(setInputs({ aiInputs: inputData[0]?.inputs || [] }))
    }
  }, [inputData, dispatch])

  useEffect(() => {
    if (inputStyleData) {
      dispatch(
        setAIStyleInputs({ aiStyleInputs: inputStyleData[0]?.inputs || [] }),
      )
    }
  }, [inputStyleData, dispatch])

  const handleSelect = (value: string) => {
    setSelectedAI(value)
    const selectedAIData = inputData?.find((ai) => ai.ai_name === value)
    if (selectedAIData) {
      dispatch(setInputs({ aiInputs: selectedAIData.inputs }))
    }
    const selectedAIStyleData = inputStyleData?.find(
      (ai) => ai.ai_name === value,
    )
    if (selectedAIStyleData) {
      dispatch(setAIStyleInputs({ aiStyleInputs: selectedAIStyleData.inputs }))
    }
  }

  return (
    <Select
      onValueChange={(value) => {
        handleSelect(value)
      }}
    >
      <SelectTrigger className="bg-card-highlight">
        <SelectValue placeholder={"comfy_ui"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {inputData?.map((ai, index) => (
            <SelectItem key={index} value={ai.ai_name}>
              {ai.ai_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ChooseAiInput
