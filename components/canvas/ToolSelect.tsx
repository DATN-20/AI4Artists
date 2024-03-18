import { FaRegHandPaper, FaShapes } from "react-icons/fa"
import { FaCropSimple } from "react-icons/fa6"
import { IoIosBrush } from "react-icons/io"
import { LuEraser, LuMousePointer2 } from "react-icons/lu"
import CanvasMode from "@/constants/canvas"
import { Button } from "../ui/button"
import { useCanvasState } from "@/store/canvasHooks"

const ToolSelect = () => {
  const { mode, setMode, setIsCropping, setIsZooming } = useCanvasState()

  const tools = [
    { icon: <IoIosBrush size={25} />, mode: CanvasMode.BRUSH_MODE },
    { icon: <LuMousePointer2 size={25} />, mode: CanvasMode.DRAG_MODE },
    { icon: <FaRegHandPaper size={25} />, mode: CanvasMode.SELECT_MODE },
    { icon: <FaShapes size={25} />, mode: CanvasMode.SHAPE_MODE },
    { icon: <LuEraser size={25} />, mode: CanvasMode.ERASE_MODE },
    { icon: <FaCropSimple size={25} />, mode: CanvasMode.CROP_MODE },
  ]

  return (
    <div className="my-4 flex flex-col items-center gap-4">
      {tools.map((tool) => (
        <Button
          className={`rounded-xl ${mode !== tool.mode ? "bg-card" : ""} py-6 font-bold`}
          onClick={() => {
            setMode(tool.mode)
            if (tool.mode === CanvasMode.CROP_MODE) {
              setIsZooming(false)
            } else {
              setIsCropping(false)
              setIsZooming(false)
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
