import { ShapeModeOptions } from "@/constants/canvas"
import { useShapeState } from "@/store/canvasHooks"
import ShapeButton from "../options/ShapeButton"
import { RiRectangleLine } from "react-icons/ri"
import { FaRegCircle } from "react-icons/fa"
import { useEffect } from "react"

const ShapeButtons: React.FC = () => {
  const { shapeModeRef, shapeMode, setShapeMode } = useShapeState()
  useEffect(() => {
    shapeModeRef.current = shapeMode
  }, [shapeMode])

  const handleShapeChange = (shapeType: number) => {
    setShapeMode(shapeType)
  }

  return (
    <div className="flex">
      <ShapeButton
        icon={<RiRectangleLine />}
        onClick={() => handleShapeChange(ShapeModeOptions.RECTANGLE_SHAPE)}
        isActive={shapeMode === ShapeModeOptions.RECTANGLE_SHAPE}
      />

      <div>
        <ShapeButton
          icon={<FaRegCircle />}
          onClick={() => handleShapeChange(ShapeModeOptions.CIRCLE_SHAPE)}
          isActive={shapeMode === ShapeModeOptions.CIRCLE_SHAPE}
        />
      </div>
    </div>
  )
}

export default ShapeButtons
