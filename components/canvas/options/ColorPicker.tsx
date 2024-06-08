import { Button } from "@/components/ui/button"
import React, { useContext } from "react"
import { SketchPicker } from "react-color"
import { CanvasModeContext } from "@/store/canvasHooks"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DialogHeader } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog"

const ColorPicker: React.FC = () => {
  const colorContext = useContext(CanvasModeContext)
  const { color, setColor } = colorContext!
  const [open, setOpen] = React.useState(false)
  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  return (
    <div className="relative inline-block">
      <div className="flex flex-col-reverse">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="absolute translate-x-[-5rem] translate-y-[-3rem] justify-center border-none p-0">
            <SketchPicker
              color={color}
              onChange={(color) => handleColorChange(color.hex)}
              className="border-none bg-transparent"
            />
          </DialogContent>
        </Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="flex w-full min-w-0 justify-start"
              onClick={() => setOpen(!open)}
            >
              <div className="mx-1 h-10 rounded-xl border-primary bg-card px-4 py-2 hover:bg-primary dark:bg-white">
                <div
                  className="h-[25px] w-[25px] rounded-lg border-2 border-primary-700"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] md:max-w-[400px]">
              Color
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default ColorPicker
