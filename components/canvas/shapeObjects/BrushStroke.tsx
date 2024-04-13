import { ShapeModeOptions } from "@/constants/canvas"
import { Point } from "./Interface"
import ShapeInterface from "./Interface"

function BrushStroke(
  points: Point[],
  color: string,
  lineWidth: number,
): ShapeInterface {
  const shapeType = ShapeModeOptions.BRUSH_SHAPE
  let pts = points
  let c = color
  let lw = lineWidth
  let showBoundingRect = false

  const draw = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = c
    context.lineWidth = lw
    context.lineCap = "round"
    context.beginPath()
    context.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      context.lineTo(pts[i].x, pts[i].y)
    }
    context.stroke()

    if (showBoundingRect) {
      let strokeCoordianates = getStrokeCoordinates()
      context.setLineDash([5, 5])
      const gradient = context.createLinearGradient(
        strokeCoordianates.x,
        strokeCoordianates.y,
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

  return { draw, isPointInside, showBounding, move, getStrokeCoordinates, shapeType }
}

export default BrushStroke
