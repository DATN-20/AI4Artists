import { FaRegHandPaper, FaShapes } from "react-icons/fa"
import { FaCropSimple } from "react-icons/fa6"
import { IoIosBrush } from "react-icons/io"
import { LuEraser, LuMousePointer2 } from "react-icons/lu"
import CanvasMode, { CanvasState } from "@/constants/canvas"
import { Button } from "../ui/button"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import { setPreviousHistory } from "./Canvas"
import { MdEmojiPeople } from "react-icons/md"

const ToolSelect = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    mode,
    setMode,
    prevMode,
    currentShape,
    canvasRef,
    initialRect,
    _history,
    setCurrentShape,
    setState,
    panOffset,
    currentHistoryIndex
  } = canvasModeContext!

  const tools = [
    { icon: <IoIosBrush size={25} />, mode: CanvasMode.BRUSH_MODE },
    { icon: <LuMousePointer2 size={25} />, mode: CanvasMode.SELECT_MODE },
    { icon: <FaRegHandPaper size={25} />, mode: CanvasMode.DRAG_MODE },
    { icon: <FaShapes size={25} />, mode: CanvasMode.SHAPE_MODE },
    { icon: <LuEraser size={25} />, mode: CanvasMode.ERASE_MODE },
    { icon: <FaCropSimple size={25} />, mode: CanvasMode.CROP_MODE },
    { icon: <MdEmojiPeople size={25} />, mode: CanvasMode.OPENPOSE_MODE },
  ]

  return (
    <div className="my-4 flex flex-col items-center gap-4">
      {tools.map((tool) => (
        <Button
          key={tool.mode}
          className={`rounded-xl ${mode !== tool.mode ? "bg-card" : ""} py-6 font-bold`}
          onClick={() => {
            setMode(tool.mode)
            if (prevMode === CanvasMode.SELECT_MODE && currentShape !== null) {
              const canvas = canvasRef.current
              if (!canvas) return
              const context = canvas.getContext("2d")
              if (!context) return

              currentShape.showBounding(false)
              setPreviousHistory(canvas, context, initialRect, _history, currentHistoryIndex, panOffset)
              currentShape.draw(context)
              setCurrentShape(null)
              setState(CanvasState.IDLE)
            }
            if (tool.mode === CanvasMode.CROP_MODE) {
              //setIsZooming(false)
            } else {
              //setIsCropping(false)
              //setIsZooming(false)
            }
          }}
        >
          {tool.icon}
        </Button>
      ))}
    </div>
  )
}

export default ToolSelect
