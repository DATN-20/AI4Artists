import { ShapeModeOptions } from "@/constants/canvas"
import ShapeInterface, { Point } from "./ShapeInterface"

function BrushStroke(
  id: number,
  points: Point[],
  color: string,
  lineWidth: number,
): ShapeInterface {
  const shapeType = ShapeModeOptions.BRUSH_SHAPE
  let pts = points
  let c = color
  let lw = lineWidth
  let showBoundingRect = false

  const draw = (
    context: CanvasRenderingContext2D,
    panOffset: { x: number; y: number },
  ) => {
    context.strokeStyle = c
    context.lineWidth = lw
    context.lineCap = "round"
    context.beginPath()
    context.moveTo(pts[0].x + panOffset.x, pts[0].y + panOffset.y)
    for (let i = 1; i < pts.length; i++) {
      context.lineTo(pts[i].x + panOffset.x, pts[i].y + panOffset.y)
    }
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
        strokeCoordianates.x,
        strokeCoordianates.y,
        strokeCoordianates.w,
        strokeCoordianates.h,
      )
      context.setLineDash([])
    }
  }

  const getStrokeCoordinates = () => {
    const minX = Math.min(...pts.map((p) => p.x))
    const minY = Math.min(...pts.map((p) => p.y))
    const maxX = Math.max(...pts.map((p) => p.x))
    const maxY = Math.max(...pts.map((p) => p.y))

    return {
      x: minX - lw - 3,
      y: minY - lw - 3,
      w: maxX - minX + 2 * lw + 6,
      h: maxY - minY + 2 * lw + 6,
    }
  }

  const isPointInside = (pointX: number, pointY: number) => {
    const minX = Math.min(...pts.map((p) => p.x))
    const minY = Math.min(...pts.map((p) => p.y))
    const maxX = Math.max(...pts.map((p) => p.x))
    const maxY = Math.max(...pts.map((p) => p.y))

    return pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY
  }

  const showBounding = (isShow: boolean) => {
    showBoundingRect = isShow
  }

  const move = (dx: number, dy: number) => {
    pts = pts.map((p) => ({ x: p.x + dx, y: p.y + dy }))
  }

  return {
    draw,
    isPointInside,
    showBounding,
    move,
    getStrokeCoordinates,
    shapeType,
    id,
  }
}

export default BrushStroke
