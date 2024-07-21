"use client"

import { useEffect, useState } from "react"
import CollapsibleSection from "../generate/CollapsibleSection"
import ChooseInput from "../generate/input-component/ChooseInput"
import SliderInput from "../generate/input-component/SliderInput"
import { Card, CardHeader } from "../ui/card"
import { useSelector } from "react-redux"
import { selectGenerate, setUseStyleImage } from "@/features/generateSlice"
import Image from "next/image"
import { ArrowLeftFromLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "../../store/hooks"
import { renderInput } from "../generate/renderInput"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import ChooseAiInput from "../generate/input-component/ChooseAiInput"
import { useTheme } from "next-themes"

export default function GenerateSideBar() {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const aiInputs = generateStates.aiInputs
  const aiStyleInputs = generateStates.aiStyleInputs
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
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
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
          src={logoSrc}
          alt="logo"
          width={90}
          height={90}
          className="cursor-pointer"
          onClick={() => {
            router.push("/dashboard")
          }}
        />
      </CardHeader>

      <div className="mt-4 flex items-center justify-between p-4">
        <Label htmlFor="use-style-mode" className="text-lg font-semibold">
          Use Style Generation
        </Label>
        <Switch
          id="use-style-mode"
          className="rounded-lg data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-slate-600 dark:data-[state=unchecked]:bg-white"
          onClick={() => {
            dispatch(
              setUseStyleImage({
                useStyleImage: !generateStates.useStyleImage,
              }),
            )
          }}
        />
      </div>

      <CollapsibleSection
        title={"Choosing AI"}
        key="choosing-ai"
        containerStyle="pb-4"
        desc="Choosing Your AI"
      >
        <ChooseAiInput />
      </CollapsibleSection>

      {noiseElement}
      {generateStates.useStyleImage
        ? aiStyleInputs &&
          aiStyleInputs.map((aiInput: any) => {
            if (
              aiInput.input_property_name === "noise" ||
              aiInput.input_property_name === "positivePrompt" ||
              aiInput.input_property_name === "negativePrompt" ||
              aiInput.input_property_name === "height" || 
              aiInput.input_property_name === "ipadapterStyleTranferInputs"
            ) {
              return null
            }
            if (aiInput.input_property_name === "width") {
              return (
                <CollapsibleSection
                  title={"Image Dimensions"}
                  key="image-dimensions"
                  desc="Choose the dimensions of the image you want to generate."
                >
                  <ChooseInput
                    options={dimensionOptions}
                    type="dimension"
                    isStyle={true}
                  />
                </CollapsibleSection>
              )
            }
            return (
              <Card
                key={aiInput.input_property_name}
                className="border-none pb-4 lg:border"
              >
                {renderInput(aiInput, dispatch, generateStates, 0, true, false)}
              </Card>
            )
          })
        : aiInputs &&
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
                  desc="Choose the dimensions of the image you want to generate."
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
                {renderInput(
                  aiInput,
                  dispatch,
                  generateStates,
                  0,
                  false,
                  false,
                )}
              </Card>
            )
          })}
    </Card>
  )
}
