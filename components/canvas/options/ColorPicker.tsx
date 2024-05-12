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
  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  return (
    <div className="relative inline-block">
      <div className="flex flex-col-reverse">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              <Dialog>
                <DialogHeader className="hidden" />
                <DialogTrigger>
                  <Button className="mx-1 rounded-xl bg-card dark:bg-white dark:hover:bg-primary">
                    <div
                      className="h-[25px]  w-[25px] rounded-lg"
                      style={{ backgroundColor: color }}
                    ></div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="absolute translate-y-[-20rem] justify-center border-none p-0">
                  <SketchPicker
                    color={color}
                    onChange={(color) => handleColorChange(color.hex)}
                    className="bg-transparent border-nonez"
                  />
                </DialogContent>
              </Dialog>
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
