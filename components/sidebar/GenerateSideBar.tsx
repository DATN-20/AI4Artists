"use client"

import { useEffect, useState } from "react"
import CollapsibleSection from "../generate/CollapsibleSection"
import ChooseInput from "../generate/input-component/ChooseInput"
import InputSelect from "../generate/input-component/InputSelect"
import SliderInput from "../generate/input-component/SliderInput"
import { Card, CardHeader } from "../ui/card"
import { useSelector } from "react-redux"
import {
  selectGenerate,
  setField,
  setUseControlnet,
  setUseImage,
} from "@/features/generateSlice"
import Image from "next/image"
import { ArrowLeftFromLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { render } from "react-dom"
import { ControlnetDialog } from "../generate/ControlnetDialog"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { useAppDispatch } from "../../store/hooks"
import TrueFalseInput from "../generate/input-component/TrueFalseInput"
import DynamicImageInput from "../generate/input-component/DynamicImageInput"

export default function GenerateSideBar() {
  const dispatch = useAppDispatch()
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

  const renderInput = (input: any, arrayType?: string) => {
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
              arrayType={arrayType}
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
              arrayType={arrayType}
            />
          </CollapsibleSection>
        )

      case "image":
        switch (propertyName) {
          case "image": {
            if (!generateStates.useImage) {
              dispatch(
                setField({
                  field: "image",
                  delete: true,
                }),
              )
              dispatch(
                setField({
                  field: "noise",
                  delete: true,
                }),
              )
              return (
                <div className="flex justify-between p-4 pb-0">
                  <Label htmlFor="image-mode" className="text-lg font-semibold">
                    {name}
                  </Label>
                  <Switch
                    id="image-mode"
                    className="bg-black"
                    onClick={() => {
                      dispatch(
                        setUseImage({
                          useImage: !generateStates.useImage,
                        }),
                      )
                    }}
                  />
                </div>
              )
            }
            return (
              <>
                <div className="flex justify-between p-4 pb-0">
                  <Label htmlFor="image-mode" className="text-lg font-semibold">
                    {name}
                  </Label>
                  <Switch
                    id="image-mode"
                    className="bg-black"
                    onClick={() => {
                      dispatch(
                        setUseImage({
                          useImage: !generateStates.useImage,
                        }),
                      )
                    }}
                  />
                </div>
                <div className="w-full p-4 pb-0">
                  <DynamicImageInput name={name} type={propertyName} />
                </div>
              </>
            )
          }

          case "controlNetImages":
            return (
              <CollapsibleSection title={name} key={propertyName}>
                <ControlnetDialog type={propertyName} />
              </CollapsibleSection>
            )

          default:
            return null
        }

      case "boolean": {
        return (
          <div className="w-full p-4 pb-0">
            <TrueFalseInput
              name={name}
              type={propertyName}
              defaultValue={defaultValue}
              arrayType={arrayType}
            />
          </div>
        )
      }

      case "array": {
        return (
          <>
            <div className="flex justify-between p-4 pb-0">
              <Label htmlFor="array-mode" className="text-lg font-semibold">
                {info.element.name}
              </Label>
              <Switch
                id="array-mode"
                className="bg-black"
                onClick={() => {
                  dispatch(
                    setUseControlnet({
                      useControlnet: !generateStates.useControlnet,
                    }),
                  )
                }}
              />
            </div>

            {info.element.info.inputs.map((nestedInput: any) => {
              if (!generateStates.useControlnet) {
                dispatch(
                  setField({
                    field: `${info.element.input_property_name}[0].${nestedInput.input_property_name}`,
                    delete: true,
                  }),
                )
                dispatch(
                  setField({
                    field: "controlNetImages",
                    delete: true,
                  }),
                )
                return null
              } else {
                return (
                  <Card
                    key={nestedInput.input_property_name}
                    className="border-none px-0 lg:border"
                  >
                    {renderInput(nestedInput, info.element.input_property_name)}
                  </Card>
                )
              }
            })}
          </>
        )
      }

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
              className="border-none pb-4 lg:border"
            >
              {renderInput(aiInput)}
            </Card>
          )
        })}
    </Card>
  )
}
