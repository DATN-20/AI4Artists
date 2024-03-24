import { Button } from "@/components/ui/button"
import React from "react"
import { BrushSizeStateContext } from "@/store/canvasHooks"
import { RxBorderWidth } from "react-icons/rx"
import * as Slider from "@radix-ui/react-slider"

const BrushSizeInput = () => {
  const brushContext = React.useContext(BrushSizeStateContext)
  const { brushSettings, setBrushSettings } = brushContext!

  const updateBrushSettings = (newSettings: Partial<typeof brushSettings>) => {
    setBrushSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }))
  }

  return (
    <div className="relative inline-block">
      <div className="flex flex-col-reverse">
        <Button
          className="rounded-xl bg-card"
          onClick={() =>
            updateBrushSettings({ showSlider: !brushSettings.showSlider })
          }
        >
          <RxBorderWidth className="h-[30px] w-[27px]"></RxBorderWidth>
        </Button>
        {brushSettings.showSlider && (
          <div className="absolute left-0 top-0 z-10 mt-[-30px] flex h-7 w-[200px] items-center rounded bg-stone-600">
            <Slider.Root
              className="relative flex h-5 w-full touch-none select-none items-center px-2"
              defaultValue={[5]}
              min={1}
              max={10}
              step={1}
              aria-label="Volume"
              onValueChange={(e) => updateBrushSettings({ size: e[0] })}
              onBlur={() => updateBrushSettings({ showSlider: false })}
            >
              <Slider.Track className="relative h-3 grow rounded-xl bg-slate-200">
                <Slider.Range className="absolute h-3 rounded-xl bg-gradient-to-r from-sky-300 to-primary-700 to-60%" />
              </Slider.Track>
              <Slider.Thumb className="group relative block h-4 w-4 cursor-pointer rounded-full border-none bg-primary-600 outline-none duration-150 active:scale-125 ">
                <h1 className="absolute -translate-x-3 whitespace-nowrap rounded-xl bg-primary px-4 py-1 text-center text-xs font-bold text-white opacity-0 duration-150 ease-in-out group-active:-translate-y-8 group-active:opacity-100">
                  {brushSettings.size}
                </h1>
              </Slider.Thumb>
            </Slider.Root>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrushSizeInput
