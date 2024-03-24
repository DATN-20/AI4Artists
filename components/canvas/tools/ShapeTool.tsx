import { ShapeModeOptions } from "@/constants/canvas"
import { ShapeStateContext } from "@/store/canvasHooks"
import ShapeButton from "../options/ShapeButton"
import { RiRectangleLine } from "react-icons/ri"
import { FaRegCircle } from "react-icons/fa"
import { useContext, useEffect } from "react"
import ColorPicker from "../options/ColorPicker"

const ShapeButtons: React.FC = () => {
  const shapeContext = useContext(ShapeStateContext)
  const { shapeModeRef, shapeMode, setShapeMode } = shapeContext!
  useEffect(() => {
    shapeModeRef.current = shapeMode
  }, [shapeMode])

  const handleShapeChange = (shapeType: number) => {
    setShapeMode(shapeType)
  }

  return (
    <div className="flex">
      <ColorPicker></ColorPicker>
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
