import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import { Button } from "@/components/ui/button"
import { adjustHistoryToIndex, redo } from "../HistoryUtilities"
import CanvasMode, { CanvasState } from "@/constants/canvas"
import { FaRegHandPaper, FaShapes } from "react-icons/fa"
import { IoIosBrush } from "react-icons/io"
import { LuMousePointer2, LuEraser } from "react-icons/lu"
import { MdEmojiPeople } from "react-icons/md"
import { useTheme } from "next-themes"

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
    cursor,
    setCursor,
  } = canvasModeContext!
  const { resolvedTheme } = useTheme()

  const tools = [
    {
      icon: <IoIosBrush className="dark:text-black" size={25} />,
      mode: CanvasMode.BRUSH_MODE,
      cursor: "crosshair",
    },
    {
      icon: <LuMousePointer2 className="dark:text-black" size={25} />,
      mode: CanvasMode.SELECT_MODE,
      cursor: "default",
    },
    {
      icon: <FaRegHandPaper className="dark:text-black" size={25} />,
      mode: CanvasMode.DRAG_MODE,
      cursor: "grab",
    },
    {
      icon: <FaShapes className="dark:text-black" size={25} />,
      mode: CanvasMode.SHAPE_MODE,
      cursor: "crosshair",
    },
    {
      icon: <LuEraser className="dark:text-black" size={25} />,
      mode: CanvasMode.ERASE_MODE,
      cursor: "crosshair",
    },
    {
      icon: <MdEmojiPeople className="dark:text-black" size={25} />,
      mode: CanvasMode.OPENPOSE_MODE,
      cursor: "crosshair",
    },
  ]

  return (
    <div>
      {tools.map((tool) => (
        <Button
          key={tool.mode}
          className={`rounded-xl dark:bg-current dark:bg-white dark:hover:bg-primary ${mode !== tool.mode ? "bg-card dark:bg-white" : "dark:bg-primary"} my-1 font-bold`}
          onClick={() => {
            if (mode === CanvasMode.SELECT_MODE && currentShape !== null) {
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
                resolvedTheme,
              )
              currentShape.draw(context, panOffset)
              setCurrentShape(null)
              setState(CanvasState.IDLE)
            }
            setMode(tool.mode)
            setCursor(tool.cursor)
          }}
        >
          {tool.icon}
        </Button>
      ))}
    </div>
  )
})
