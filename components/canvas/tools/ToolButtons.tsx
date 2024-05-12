import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import { Button } from "@/components/ui/button"
import { adjustHistoryToIndex, redo } from "../HistoryUtilities"
import CanvasMode, { CanvasState } from "@/constants/canvas"
import { FaRegHandPaper, FaShapes } from "react-icons/fa"
import { IoIosBrush } from "react-icons/io"
import { LuMousePointer2, LuEraser } from "react-icons/lu"
import { MdEmojiPeople } from "react-icons/md"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const ToolButtons: React.FC = memo(() => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    currentShape,
    imageRef,
    mode,
    setCurrentShape,
    setState,
    setMode,
    setCursor,
  } = canvasModeContext!

  const tools = [
    {
      icon: <IoIosBrush className="dark:text-black" size={25} />,
      mode: CanvasMode.BRUSH_MODE,
      cursor: "handwriting.cur",
      tooltip: "Draw brush",
    },
    {
      icon: <LuMousePointer2 className="dark:text-black" size={25} />,
      mode: CanvasMode.SELECT_MODE,
      cursor: "pointer.cur",
      tooltip: "Select and drag object",
    },
    {
      icon: <FaRegHandPaper className="dark:text-black" size={25} />,
      mode: CanvasMode.DRAG_MODE,
      cursor: "grab_release.png",
      tooltip: "Drag canvas",
    },
    {
      icon: <FaShapes className="dark:text-black" size={25} />,
      mode: CanvasMode.SHAPE_MODE,
      cursor: "precision.cur",
      tooltip: "Draw shape",
    },
    {
      icon: <LuEraser className="dark:text-black" size={25} />,
      mode: CanvasMode.ERASE_MODE,
      cursor: "erase.cur",
      tooltip: "Erase object/image",
    },
    {
      icon: <MdEmojiPeople className="dark:text-black" size={25} />,
      mode: CanvasMode.OPENPOSE_MODE,
      cursor: "crosshair",
      tooltip: "Add pose",
    },
  ]

  return (
    <div>
      {tools.map((tool) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              <div
                className={`rounded-xl dark:bg-current dark:bg-white dark:hover:bg-primary ${mode !== tool.mode ? "bg-card dark:bg-white" : "dark:bg-primary"} p-3 `}
                onClick={() => {
                  if (
                    mode === CanvasMode.SELECT_MODE &&
                    currentShape !== null
                  ) {
                    const canvas = canvasRef.current
                    if (!canvas) return
                    const context = canvas.getContext("2d")
                    if (!context) return

                    currentShape.showBounding(false)
                    adjustHistoryToIndex(
                      canvas,
                      context,
                      initialRectPosition,
                      _history,
                      currentHistoryIndex,
                      panOffset,
                      true,
                      imageRef.current!,
                    )
                    currentShape.draw(context, panOffset)
                    setCurrentShape(null)
                  }
                  setState(CanvasState.IDLE)
                  setMode(tool.mode)
                  setCursor(tool.cursor)
                }}
              >
                {tool.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-[200px] md:max-w-[400px]"
              side="left"
            >
              {tool.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
})
