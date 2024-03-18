import CanvasMode from "@/constants/canvas"
import { useCanvasState } from "@/store/canvasHooks"
import ColorPicker from "./options/ColorPicker"
import BrushSizeInput from "./options/BrushSizeInput"
import ShapeButtons from "./tools/ShapeTool"

const OptionSelect = () => {
  const { mode } = useCanvasState()
  return (
    <div>
      {(mode === CanvasMode.DRAG_MODE || mode === CanvasMode.SHAPE_MODE) && (
        <div className="mt-4 flex items-center rounded-lg bg-card p-4">
          {mode === CanvasMode.DRAG_MODE && (
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
