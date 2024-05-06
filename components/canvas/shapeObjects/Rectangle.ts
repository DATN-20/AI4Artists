import { ShapeModeOptions } from "@/constants/canvas"
import ShapeInterface from "./ShapeInterface"

export default function Rectangle(
  id: number,
  startX: number,
  startY: number,
  width: number,
  height: number,
  color: string,
  lineWidth: number,
): ShapeInterface {
  const shapeType = ShapeModeOptions.RECTANGLE_SHAPE
  let x = startX
  let y = startY
  let w = width
  let h = height
  let c = color
  let lw = lineWidth
  let showBoundingRect = false

  const isPointInside = (pointX: number, pointY: number) => {
    return pointX >= x && pointX <= x + w && pointY >= y && pointY <= y + h
  }

  const draw = (
    context: CanvasRenderingContext2D,
    panOffset: { x: number; y: number },
  ) => {
    context.strokeStyle = c
    context.lineWidth = lw
    context.beginPath()
    context.rect(x + panOffset.x, y + panOffset.y, w, h)
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
      context.lineWidth = 2
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
      x: x - lw - 3,
      y: y - lw - 3,
      w: w + 2 * lw + 6,
      h: h + 2 * lw + 6,
    }
  }

  const move = (dx: number, dy: number) => {
    x += dx
    y += dy
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
