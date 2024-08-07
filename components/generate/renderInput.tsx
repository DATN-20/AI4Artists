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
import DynamicImageInputSpecial from "./input-component/DynamicImageInputSpecial"

export const renderInput = (
  input: any,
  dispatch: any,
  generateStates: any,
  arrayIndex?: number,
  isStyleGenerate?: boolean,
  isStyleDrawer?: boolean,
  isControlnets?: boolean,
) => {
  const {
    name,
    type,
    default: defaultValue,
    input_property_name: propertyName,
    info,
    desc,
  } = input

  const existingValue = isControlnets
    ? generateStates.controlNetInputs?.find(
        (field: any) =>
          field.name === propertyName && field.ArrayIndex === arrayIndex,
      )
    : isStyleGenerate
      ? generateStates.dataStyleInputs?.find(
          (field: any) =>
            field.name === propertyName && field.ArrayIndex === arrayIndex,
        )
      : generateStates.dataInputs?.find(
          (field: any) => field.name === propertyName,
        )

  const checkDefaultValue = existingValue ? existingValue.value : defaultValue

  switch (type) {
    case "choice":
      return (
        <CollapsibleSection title={name} key={propertyName} desc={desc}>
          <InputSelect
            data={info.choices}
            type={propertyName}
            defaultValue={checkDefaultValue}
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
            isControlNets={isControlnets}
          />
        </CollapsibleSection>
      )

    case "slider":
      return (
        <CollapsibleSection title={name} key={propertyName} desc={desc}>
          <SliderInput
            min={info.min}
            max={info.max}
            step={info.step}
            defaultValue={checkDefaultValue}
            type={propertyName}
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
            isControlNets={isControlnets}
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
                  Use Image Input
                </Label>
                <Switch
                  id="image-mode"
                  className="rounded-lg data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-slate-600 dark:data-[state=unchecked]:bg-white"
                  onClick={() => {
                    dispatch(
                      setUseImage({
                        useImage: !generateStates.useImage,
                      }),
                    )
                  }}
                  checked={generateStates.useImage}
                />
              </div>
            )
          }
          return (
            <>
              <div className="flex justify-between p-4 pb-0">
                <Label htmlFor="image-mode" className="text-lg font-semibold">
                  Use Image Input
                </Label>
                <Switch
                  id="image-mode"
                  className="rounded-lg data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-slate-600 dark:data-[state=unchecked]:bg-white"
                  onClick={() => {
                    dispatch(
                      setUseImage({
                        useImage: !generateStates.useImage,
                      }),
                    )
                  }}
                  checked={generateStates.useImage}
                />
              </div>
              <div className="mt-4 px-4">
                <DynamicImageInput
                  name={name}
                  type={propertyName}
                  defaultValue={checkDefaultValue}
                />
              </div>
            </>
          )
        }

        case "controlNetImages":
          return (
            <CollapsibleSection title={name} key={propertyName} desc={desc}>
              <ControlnetDialog
                type={propertyName}
                isStyleGenerate={isStyleGenerate}
                defaultValue={checkDefaultValue}
                arrayIndex={arrayIndex}
              />
            </CollapsibleSection>
          )

        case "imageForIpadapter": {
          return (
            <DynamicImageInputSpecial
              name={name}
              type={propertyName}
              defaultValue={checkDefaultValue}
              isStyleGenerate={isStyleGenerate}
              arrayIndex={arrayIndex}
            />
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
            defaultValue={checkDefaultValue}
            arrayIndex={arrayIndex}
            isStyleGenerate={isStyleGenerate}
            isControlNets={isControlnets}
          />
        </div>
      )
    }

    case "array": {
      if (isStyleDrawer) {
        return (
          <>
            <div className="flex h-[256px] w-full gap-2">
              <div className="h-full w-1/3">
                {info.element.info.inputs.map((nestedInput: any) => {
                  if (nestedInput.input_property_name === "imageForIpadapter") {
                    return (
                      <Card
                        key={nestedInput.input_property_name}
                        className="h-full border-none bg-transparent px-0 lg:border"
                      >
                        {renderInput(
                          nestedInput,
                          dispatch,
                          generateStates,
                          arrayIndex,
                          true,
                          false,
                          false,
                        )}
                      </Card>
                    )
                  }
                  return null
                })}
              </div>

              <div className="no-scrollbar flex w-2/3 flex-col overflow-y-scroll">
                {info.element.info.inputs.map((nestedInput: any) => {
                  if (nestedInput.input_property_name !== "imageForIpadapter") {
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
                          false,
                        )}
                      </Card>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </>
        )
      }

      if (isControlnets) {
        return (
          <>
            <div className="flex h-[256px] w-full gap-2">
              <div className="h-full w-1/3">
                {info.element.info.inputs.map((nestedInput: any) => {
                  if (nestedInput.input_property_name === "controlNetImages") {
                    return (
                      <Card
                        key={nestedInput.input_property_name}
                        className="h-full border-none bg-transparent px-0 lg:border"
                      >
                        {generateStates.useuseStyleImage
                          ? renderInput(
                              nestedInput,
                              dispatch,
                              generateStates,
                              arrayIndex,
                              true,
                              false,
                              true,
                            )
                          : renderInput(
                              nestedInput,
                              dispatch,
                              generateStates,
                              arrayIndex,
                              false,
                              false,
                              true,
                            )}
                      </Card>
                    )
                  }
                  return null
                })}
              </div>

              <div className="no-scrollbar flex w-2/3 flex-col overflow-y-scroll">
                {info.element.info.inputs.map((nestedInput: any) => {
                  if (nestedInput.input_property_name !== "controlNetImages") {
                    return (
                      <Card
                        key={nestedInput.input_property_name}
                        className="border-none bg-transparent px-0 lg:border"
                      >
                        {generateStates.useuseStyleImage
                          ? renderInput(
                              nestedInput,
                              dispatch,
                              generateStates,
                              arrayIndex,
                              true,
                              false,
                              true,
                            )
                          : renderInput(
                              nestedInput,
                              dispatch,
                              generateStates,
                              arrayIndex,
                              false,
                              false,
                              true,
                            )}
                      </Card>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </>
        )
      }

      if (
        propertyName === "ipadapterStyleTranferInputs" &&
        isStyleGenerate &&
        !isStyleDrawer
      ) {
        return null
      }

      if (propertyName === "controlNets") {
        return (
          <>
            <div className="flex justify-between p-4 pb-0">
              <Label htmlFor="array-mode" className="text-lg font-semibold">
                {info.element.name}
              </Label>
              <Switch
                id="array-mode"
                className="rounded-lg data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-slate-600 dark:data-[state=unchecked]:bg-white"
                onClick={() => {
                  dispatch(
                    setUseControlnet({
                      useControlnet: !generateStates.useControlnet,
                    }),
                  )
                  if (!generateStates.useControlnet) {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                }}
                checked={generateStates.useControlnet}
              />
            </div>
          </>
        )
      }

      return null
    }

    default:
      return null
  }
}
