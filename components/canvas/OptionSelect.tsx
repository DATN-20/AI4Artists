import CanvasMode from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import ColorPicker from "./options/ColorPicker"
import BrushSizeInput from "./options/BrushSizeInput"
import ShapeButtons from "./tools/ShapeTool"
import { useContext } from "react"

const OptionSelect = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { mode } = canvasModeContext!
  return (
    <div>
      {(mode === CanvasMode.BRUSH_MODE || mode === CanvasMode.SHAPE_MODE) && (
        <div className="mt-4 flex items-center rounded-lg bg-card p-4">
          {mode === CanvasMode.BRUSH_MODE && (
            <div className="flex ">
              <ColorPicker></ColorPicker>
              <BrushSizeInput></BrushSizeInput>
            </div>
          )}
          {mode === CanvasMode.SHAPE_MODE && <ShapeButtons></ShapeButtons>}
        </div>
      )}
    </div>
  )
}

export default OptionSelect
