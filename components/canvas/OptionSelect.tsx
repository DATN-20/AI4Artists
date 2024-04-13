import CanvasMode from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import ColorPicker from "./options/ColorPicker"
import BrushSizeInput from "./options/BrushSizeInput"
import ShapeButtons from "./tools/ShapeTool"
import { useContext } from "react"
import AddPoseButton from "./options/AddPoseButton"

const OptionSelect = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { mode } = canvasModeContext!
  return (
    <div className="mt-10">
      {mode === CanvasMode.BRUSH_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card p-4">
          <div className="flex ">
            <ColorPicker />
            <BrushSizeInput />
          </div>
        </div>
      )}

      {mode === CanvasMode.SHAPE_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card p-4">
          <ShapeButtons />
        </div>
      )}

      {mode === CanvasMode.OPENPOSE_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card p-4">
          <AddPoseButton/>
        </div>
      )}
    </div>
  )
}

export default OptionSelect
