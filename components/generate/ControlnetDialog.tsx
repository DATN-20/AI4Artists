import Canvas from "../canvas/Canvas"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import OptionSelect from "../canvas/OptionSelect"
import ToolSelect from "../canvas/ToolSelect"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
export const ControlnetDialog: React.FC = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    imageRef,
    scale,
    setChosenFile
  } = canvasModeContext!

  return (
      <Dialog>
        <DialogHeader className="hidden" />
        <DialogTrigger>
          <Button
            variant={"outline"}
            className="ml-[16px] w-fit  rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
          >
            Add Pose Image
          </Button>
        </DialogTrigger>
        <DialogContent className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0">
          <Canvas />
          <div className="flex w-full lg:p-2">
            <div className="ml-40 mr-16 w-10/12">
              <div className="flex h-[650px] w-[1000px] items-center justify-center"></div>
              <OptionSelect />
            </div>

            <div className="z-10 flex h-[650px] w-1/12 items-center gap-4">
              <div className="mr-16 flex items-center justify-center rounded-lg bg-card px-4 dark:bg-white">
                <ToolSelect />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}
