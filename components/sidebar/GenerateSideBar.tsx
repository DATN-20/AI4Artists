"use client"

import { useEffect, useState } from "react"
import CollapsibleSection from "../generate/CollapsibleSection"
import ChooseInput from "../generate/input-component/ChooseInput"
import InputSelect from "../generate/input-component/InputSelect"
import SliderInput from "../generate/input-component/SliderInput"
import { Card, CardHeader } from "../ui/card"
import { useSelector } from "react-redux"
import { selectGenerate } from "@/features/generateSlice"
import Image from "next/image"
import { ArrowLeftFromLine } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GenerateSideBar() {
  const generateStates = useSelector(selectGenerate)
  const aiInputs = generateStates.aiInputs
  const router = useRouter()
  const [noiseElement, setNoiseElement] = useState<JSX.Element | null>(null)
  useEffect(() => {
    if (aiInputs && generateStates.useImage) {
      const noiseInput = aiInputs.find(
        (aiInput: any) => aiInput.input_property_name === "noise",
      )
      if (noiseInput) {
        const noiseSlider = (
          <CollapsibleSection title={"Noise"} key="noise">
            <SliderInput
              min={(noiseInput as any).min || 0}
              max={(noiseInput as any).max || 1}
              step={(noiseInput as any).step || 0.01}
              defaultValue={0.75}
              type="noise"
            />
          </CollapsibleSection>
        )
        setNoiseElement(() => noiseSlider)
      }
    } else {
      setNoiseElement(() => null)
    }
  }, [aiInputs, generateStates.useImage])

  const dimensionOptions = [
    { label: "512 x 512", value: "1" },
    { label: "768 x 768", value: "2" },
    { label: "512 x 1024", value: "3" },
    { label: "768 x 1024", value: "4" },
    { label: "1024 x 768", value: "5" },
    { label: "1024 x 1024", value: "6" },
  ]

  const renderInput = (input: any) => {
    const {
      name,
      type,
      default: defaultValue,
      input_property_name: propertyName,
      info,
    } = input

    switch (type) {
      case "choice":
        return (
          <CollapsibleSection title={name} key={propertyName}>
            <InputSelect
              data={info.choices}
              onSelect={(value) => console.log(`Selected ${name}:`, value)}
              type={propertyName}
            />
          </CollapsibleSection>
        )

      case "slider":
        return (
          <CollapsibleSection title={name} key={propertyName}>
            <SliderInput
              min={info.min}
              max={info.max}
              step={info.step}
              defaultValue={defaultValue}
              type={propertyName}
            />
          </CollapsibleSection>
        )
      default:
        return null
    }
  }

  return (
    <Card className="flex w-full flex-col border-none lg:border">
      <CardHeader className="relative mt-2 flex flex-row items-center justify-center space-y-0 p-0">
        <ArrowLeftFromLine
          className="absolute left-3 top-5 h-[42px] w-[42px]"
          onClick={() => {
            router.push("/dashboard")
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.cursor = "pointer"
          }}
        />
        <Image
          src="/logo.png"
          alt="logo"
          width={70}
          height={70}
          className="cursor-pointer"
          onClick={() => {
            router.push("/dashboard")
          }}
        />
      </CardHeader>
      {noiseElement}

      {aiInputs &&
        aiInputs.map((aiInput: any) => {
          if (
            aiInput.input_property_name === "image" ||
            aiInput.input_property_name === "noise" ||
            aiInput.input_property_name === "positivePrompt" ||
            aiInput.input_property_name === "negativePrompt" ||
            aiInput.input_property_name === "height"
          ) {
            return null
          }
          if (aiInput.input_property_name === "width") {
            return (
              <CollapsibleSection
                title={"Image Dimensions"}
                key="image-dimensions"
              >
                <ChooseInput options={dimensionOptions} type="dimension" />
              </CollapsibleSection>
            )
          }
          return (
            <Card
              key={aiInput.input_property_name}
              className="border-none lg:border"
            >
              {renderInput(aiInput)}
            </Card>
          )
        })}
    </Card>
  )
}
