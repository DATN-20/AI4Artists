import { Button } from "@/components/ui/button"
import React from "react"
import { CanvasModeContext } from "@/store/canvasHooks"
import { RxBorderWidth } from "react-icons/rx"
import * as Slider from "@radix-ui/react-slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DialogHeader } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog"

const BrushSizeInput = () => {
  const brushContext = React.useContext(CanvasModeContext)
  const { brushSize, setBrushSize } = brushContext!
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative inline-block">
      <div className="flex flex-col-reverse">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="absolute translate-y-[-4.5rem] justify-center border-none p-0">
            <div className="absolute flex h-7 w-[200px] items-center rounded-lg bg-stone-600">
              <Slider.Root
                className="relative flex h-5 w-full cursor-pointer touch-none select-none items-center px-2"
                defaultValue={[brushSize]}
                min={1}
                max={10}
                step={1}
                aria-label="Volume"
                onValueChange={(e) => setBrushSize(e[0])}
              >
                <Slider.Track className="relative h-3 grow rounded-xl bg-slate-200">
                  <Slider.Range className="absolute h-3 rounded-xl bg-gradient-default-to-r" />
                </Slider.Track>
                <Slider.Thumb className="group relative block h-4 w-4 cursor-pointer rounded-full border-none bg-primary-600 outline-none duration-150 active:scale-125 ">
                  <h1 className="absolute -translate-x-3 whitespace-nowrap rounded-xl bg-primary px-4 py-1 text-center text-xs font-bold text-white opacity-0 duration-150 ease-in-out group-active:-translate-y-8 group-active:opacity-100">
                    {brushSize}
                  </h1>
                </Slider.Thumb>
              </Slider.Root>
            </div>
          </DialogContent>
        </Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="flex w-full min-w-0 justify-start"
              onClick={() => setOpen(!open)}
            >
              <div className="mx-1 h-10 rounded-xl bg-card px-4 py-2 hover:bg-gradient-to-br from-sky-300 to-primary-700 to-60% dark:bg-white">
                <RxBorderWidth className="h-[25px] w-[27px] dark:text-black"></RxBorderWidth>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] md:max-w-[400px]">
              Brush size
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default BrushSizeInput
