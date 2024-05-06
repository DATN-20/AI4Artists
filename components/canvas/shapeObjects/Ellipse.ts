import { ShapeModeOptions } from "@/constants/canvas"
import ShapeInterface from "./ShapeInterface"

function Ellipse(
  id: number,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation = 0,
  startAngle = 0,
  endAngle = 2 * Math.PI,
  color: string,
  lineWidth: number,
): ShapeInterface {
  const shapeType = ShapeModeOptions.CIRCLE_SHAPE
  let centerX = x
  let centerY = y
  let rX = radiusX
  let rY = radiusY
  let rot = rotation
  let c = color
  let lw = lineWidth
  let showBoundingRect = false

  const isPointInside = (pointX: number, pointY: number) => {
    const dx = (pointX - centerX) / rX
    const dy = (pointY - centerY) / rY
    return dx * dx + dy * dy < 1
  }

  const draw = (
    context: CanvasRenderingContext2D,
    panOffset: { x: number; y: number },
  ) => {
    context.strokeStyle = c
    context.lineWidth = lw
    context.beginPath()
    context.ellipse(
      centerX + panOffset.x,
      centerY + panOffset.y,
      rX,
      rY,
      rot,
      startAngle,
      endAngle,
    )
    context.stroke()

    if (showBoundingRect) {
      let strokeCoordianates = getStrokeCoordinates()
      context.setLineDash([5, 5])
      const gradient = context.createLinearGradient(
        strokeCoordianates.x + panOffset.x,
        strokeCoordianates.y + panOffset.y,
        strokeCoordianates.w,
        strokeCoordianates.h,
      )
      gradient.addColorStop(0, "#9cc8fb")
      gradient.addColorStop(0.6, "#d35bff")

      context.strokeStyle = gradient
      context.lineWidth = 1
      context.strokeRect(
        strokeCoordianates.x + panOffset.x,
        strokeCoordianates.y + panOffset.y,
        strokeCoordianates.w,
        strokeCoordianates.h,
      )
      context.setLineDash([])
    }
  }

  const getStrokeCoordinates = () => {
    return {
      x: centerX - rX - lw - 3,
      y: centerY - rY - lw - 3,
      w: 2 * rX + 2 * lw + 6,
      h: 2 * rY + 2 * lw + 6,
    }
  }

  const move = (dx: number, dy: number) => {
    centerX += dx
    centerY += dy
  }

  const showBounding = (isShow: boolean) => {
    showBoundingRect = isShow
  }

  return {
    isPointInside,
    draw,
    move,
    showBounding,
    getStrokeCoordinates,
    shapeType,
    id
  }
}

export default Ellipse
