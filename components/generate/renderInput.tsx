import CollapsibleSection from "./CollapsibleSection"
import InputSelect from "./input-component/InputSelect"
import SliderInput from "./input-component/SliderInput"
import {
  setField,
  setStyleField,
  setUseControlnet,
  setUseImage,
} from "../../features/generateSlice"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import DynamicImageInput from "./input-component/DynamicImageInput"
import ControlnetDialog from "./ControlnetDialog"
import TrueFalseInput from "./input-component/TrueFalseInput"
import { Card } from "../ui/card"
import StyleDrawer from "./StyleDrawer"

export const renderInput = (
  input: any,
  dispatch: any,
  generateStates: any,
  arrayIndex?: number,
  isStyleGenerate?: boolean,
  isStyleDrawer?: boolean,
) => {
  const {
    name,
    type,
    default: defaultValue,
    input_property_name: propertyName,
    info,
  } = input

  const existingValue = isStyleGenerate
    ? generateStates.dataStyleInputs?.find(
        (field: any) =>
          field.name === propertyName && field.ArrayIndex === arrayIndex,
      )
    : generateStates.dataInputs?.find(
        (field: any) =>
          field.name === propertyName,
      )

  const checkDefaultValue = existingValue ? existingValue.value : defaultValue

  switch (type) {
    case "choice":
      return (
        <CollapsibleSection title={name} key={propertyName}>
          <InputSelect
            data={info.choices}
            type={propertyName}
            defaultValue={checkDefaultValue}
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
            defaultValue={checkDefaultValue}
            type={propertyName}
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
                  Apply Image to Image
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
                  Apply Image to Image
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
              <CollapsibleSection title={name} key={propertyName} isHidden={true}>
                <DynamicImageInput name={name} type={propertyName} defaultValue={checkDefaultValue} />
              </CollapsibleSection>
            </>
          )
        }

        case "controlNetImages":
          return (
            <CollapsibleSection title={name} key={propertyName}>
              <ControlnetDialog
                type={propertyName}
                isStyleGenerate={isStyleGenerate}
                defaultValue = {checkDefaultValue}
              />
            </CollapsibleSection>
          )

        case "imageForIpadapter": {
          return (
            <CollapsibleSection title={name} key={propertyName} isHidden={true}>
              <DynamicImageInput
                name={name}
                type={propertyName}
                defaultValue={checkDefaultValue}
                isStyleGenerate={isStyleGenerate}
                arrayIndex={arrayIndex}
              />
            </CollapsibleSection>
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
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
          />
        </div>
      )
    }

    case "array": {
      if (isStyleDrawer) {
        return (
          <>
            {info.element.info.inputs.map((nestedInput: any) => {
              return (
                <Card
                  key={nestedInput.input_property_name}
                  className="border-none bg-transparent px-0 lg:border"
                >
                  {renderInput(
                    nestedInput,
                    dispatch,
                    generateStates,
                    arrayIndex,
                    true,
                    false,
                  )}
                </Card>
              )
            })}
          </>
        )
      }
      if (
        propertyName === "ipadapterStyleTranferInputs" &&
        isStyleGenerate &&
        !isStyleDrawer
      ) {
        return (
          <CollapsibleSection title={name} key={propertyName}>
            <StyleDrawer
              dispatch={dispatch}
              generateStates={generateStates}
              inputData={input}
            />
          </CollapsibleSection>
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
              if (isStyleGenerate) {
                dispatch(
                  setStyleField({
                    field: nestedInput.input_property_name,
                    delete: true,
                  }),
                )
              } else {
                dispatch(
                  setField({
                    field: nestedInput.input_property_name,
                    delete: true,
                  }),
                )
              }
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
                    arrayIndex,
                    isStyleGenerate,
                    false,
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
