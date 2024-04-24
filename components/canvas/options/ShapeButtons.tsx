import { ShapeModeOptions } from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import ShapeButton from "./ShapeButton"
import { RiRectangleLine } from "react-icons/ri"
import { FaRegCircle } from "react-icons/fa"
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
        icon={<RiRectangleLine />}
        onClick={() => handleShapeChange(ShapeModeOptions.RECTANGLE_SHAPE)}
        isActive={shapeMode === ShapeModeOptions.RECTANGLE_SHAPE}
      />

      <ShapeButton
        icon={<FaRegCircle />}
        onClick={() => handleShapeChange(ShapeModeOptions.CIRCLE_SHAPE)}
        isActive={shapeMode === ShapeModeOptions.CIRCLE_SHAPE}
      />
    </div>
  )
}

export default ShapeButtons
