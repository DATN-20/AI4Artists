import CanvasMode from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import ColorPicker from "./options/ColorPicker"
import BrushSizeInput from "./options/BrushSizeInput"
import ShapeButtons from "./options/ShapeButtons"
import { useContext } from "react"
import AddPoseButton from "./options/AddPoseButton"
import { RemoveButton } from "./options/RemoveButton"

const OptionSelect = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { mode } = canvasModeContext!
  return (
    <div className="mt-10">
      {mode === CanvasMode.BRUSH_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card dark:bg-white p-4">
          <div className="flex ">
            <ColorPicker />
            <BrushSizeInput />
          </div>
        </div>
      )}

      {mode === CanvasMode.SHAPE_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card dark:bg-white p-4">
          <ColorPicker />
          <BrushSizeInput />
          <ShapeButtons />
        </div>
      )}

      {mode === CanvasMode.ERASE_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card dark:bg-white p-4">
          <RemoveButton/>
        </div>
      
      )}

      {mode === CanvasMode.OPENPOSE_MODE && (
        <div className="z-10 mt-4 flex items-center rounded-lg bg-card dark:bg-white p-4">
          <AddPoseButton />
        </div>
      )}
    </div>
  )
}

export default OptionSelect
