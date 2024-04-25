import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import { RiArrowGoForwardLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { adjustHistoryToIndex, redo } from "../HistoryUtilities"
import CanvasMode, { CanvasState } from "@/constants/canvas"
import { FaRegHandPaper, FaShapes } from "react-icons/fa"
import { IoIosBrush } from "react-icons/io"
import { LuMousePointer2, LuEraser } from "react-icons/lu"
import { MdEmojiPeople } from "react-icons/md"

export const ToolButtons: React.FC = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    currentShape,
    imageFile,
    mode,
    setCurrentShape,
    setState,
    setMode,
  } = canvasModeContext!

  const tools = [
    { icon: <IoIosBrush size={25} />, mode: CanvasMode.BRUSH_MODE },
    { icon: <LuMousePointer2 size={25} />, mode: CanvasMode.SELECT_MODE },
    { icon: <FaRegHandPaper size={25} />, mode: CanvasMode.DRAG_MODE },
    { icon: <FaShapes size={25} />, mode: CanvasMode.SHAPE_MODE },
    { icon: <LuEraser size={25} />, mode: CanvasMode.ERASE_MODE },
    { icon: <MdEmojiPeople size={25} />, mode: CanvasMode.OPENPOSE_MODE },
  ]

  return (
    <div>
      {tools.map((tool) => (
        <Button
          key={tool.mode}
          className={`rounded-xl ${mode !== tool.mode ? "bg-card" : ""} py-6 font-bold`}
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
                imageFile,
              )
              currentShape.draw(context, panOffset)
              setCurrentShape(null)
              setState(CanvasState.IDLE)
            }
            setMode(tool.mode)
          }}
        >
          {tool.icon}
        </Button>
      ))}
    </div>
  )
}
