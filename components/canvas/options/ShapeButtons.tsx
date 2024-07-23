import { ShapeModeOptions } from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import ShapeButton from "./ShapeButton"
import { RiRectangleLine, RiCheckboxBlankCircleLine } from "react-icons/ri"
import { useContext } from "react"

const ShapeButtons: React.FC = () => {
  const shapeContext = useContext(CanvasModeContext)
  const { shapeMode, setShapeMode } = shapeContext!

  const handleShapeChange = (shapeType: number) => {
    setShapeMode(shapeType)
  }

  return (
    <div className="z-10 flex">
      <ShapeButton
        icon={<RiRectangleLine className="text-black" size={25} />}
        onClick={() => handleShapeChange(ShapeModeOptions.RECTANGLE_SHAPE)}
        isActive={shapeMode === ShapeModeOptions.RECTANGLE_SHAPE}
        tooltip=" Draw rectangle"
      />

      <ShapeButton
        icon={<RiCheckboxBlankCircleLine className="text-black" size={25} />}
        onClick={() => handleShapeChange(ShapeModeOptions.CIRCLE_SHAPE)}
        isActive={shapeMode === ShapeModeOptions.CIRCLE_SHAPE}
        tooltip="Draw ellipse"
      />
    </div>
  )
}

export default ShapeButtons
