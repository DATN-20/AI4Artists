import { useSelector } from "react-redux"
import { useAppDispatch } from "../../store/hooks"
import CollapsibleSection from "./CollapsibleSection"
import InputSelect from "./input-component/InputSelect"
import SliderInput from "./input-component/SliderInput"
import {
  selectGenerate,
  setField,
  setStyleField,
  setUseControlnet,
  setUseImage,
} from "../../features/generateSlice"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import DynamicImageInput from "./input-component/DynamicImageInput"
import { ControlnetDialog } from "./ControlnetDialog"
import TrueFalseInput from "./input-component/TrueFalseInput"
import { Card } from "../ui/card"

export const renderInput = (
  input: any,
  dispatch: any,
  generateStates: any,
  arrayType?: string,
  arrayIndex?: number,
  isStyleGenerate?: boolean,
) => {
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
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
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
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
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
        case "imageForIpadapter": {
          dispatch( 
            setStyleField({
              field: `${arrayType}[${arrayIndex}].${propertyName}`,
            }),
          )

          return (
            <div className="w-full p-4 pb-0">
              <DynamicImageInput name={name} type={propertyName} />
            </div>
          )
        }
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
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
          />
        </div>
      )
    }

    case "array": {
      if (isStyleGenerate) {
        return (
          <>
            {info.element.info.inputs.map((nestedInput: any) => {
              return (
                <Card
                  key={nestedInput.input_property_name}
                  className="border-none px-0 lg:border bg-transparent"
                >
                  {renderInput(
                    nestedInput,
                    dispatch,
                    generateStates,
                    info.element.input_property_name,
                    arrayIndex,
                    true
                  )}
                </Card>
              )
            })}
          </>
        )
      }

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
                  {renderInput(
                    nestedInput,
                    dispatch,
                    generateStates,
                    info.element.input_property_name,
                    arrayIndex,
                    false
                  )}
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
