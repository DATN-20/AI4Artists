import { ShapeModeOptions } from "@/constants/canvas"
import ShapeInterface from "./ShapeInterface"

interface OpenPoseInterface extends ShapeInterface {
  isPointNearby(pointX: number, pointY: number): boolean
  moveOnePoint(x: number, y: number): void
}

export default function OpenPose(id: number): OpenPoseInterface {
  const shapeType = ShapeModeOptions.OPENPOSE_SHAPE
  let showBoundingRect = false
  let isChoosingPoint = -1
  const points: { x: number; y: number; color: string }[] = [
    { x: 341, y: 77, color: "#FF0000" },
    { x: 341, y: 120, color: "#FF5500" },
    { x: 291, y: 118, color: "#FFAA00" },
    { x: 277, y: 183, color: "#FFFF00" },
    { x: 263, y: 252, color: "#AAFF00" },
    { x: 398, y: 118, color: "#55FF00" },
    { x: 417, y: 182, color: "#00FF00" },
    { x: 432, y: 245, color: "#00FF55" },
    { x: 325, y: 241, color: "#00FFAA" },
    { x: 313, y: 359, color: "#00FFFF" },
    { x: 315, y: 454, color: "#00AAFF" },
    { x: 370, y: 240, color: "#0055FF" },
    { x: 382, y: 360, color: "#0000FF" },
    { x: 386, y: 456, color: "#5500FF" },
    { x: 332, y: 59, color: "#AA00FF" },
    { x: 353, y: 60, color: "#FF00FF" },
    { x: 325, y: 70, color: "#FF00AA" },
    { x: 360, y: 72, color: "#FF0055" },
  ]

  const connections: [number, number, string][] = [
    [1, 2, "#990000"],
    [1, 5, "#993300"],
    [2, 3, "#996600"],
    [3, 4, "#999900"],
    [5, 6, "#669900"],
    [6, 7, "#339900"],
    [1, 8, "#009900"],
    [8, 9, "#009933"],
    [9, 10, "#009966"],
    [1, 11, "#009999"],
    [11, 12, "#006699"],
    [12, 13, "#003399"],
    [1, 0, "#000099"],
    [0, 14, "#330099"],
    [14, 16, "#660099"],
    [0, 15, "#990099"],
    [15, 17, "#990066"],
  ]

  const draw = (
    context: CanvasRenderingContext2D,
    panOffset: { x: number; y: number },
  ) => {
    connections.forEach(([startIndex, endIndex, color]) => {
      context.beginPath()
      context.strokeStyle = color
      context.lineWidth = 8
      context.moveTo(
        points[startIndex].x + panOffset.x,
        points[startIndex].y + panOffset.y,
      )
      context.lineTo(
        points[endIndex].x + panOffset.x,
        points[endIndex].y + panOffset.y,
      )
      context.stroke()
    })

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      context.beginPath()
      context.fillStyle = point.color
      context.arc(
        point.x + panOffset.x,
        point.y + panOffset.y,
        5,
        0,
        Math.PI * 2,
      )
      if (isChoosingPoint === i) {
        context.strokeStyle = "yellow"
        context.lineWidth = 3
        context.arc(
          point.x + panOffset.x,
          point.y + panOffset.y,
          7,
          0,
          Math.PI * 2,
        )
        context.stroke()
      }
      context.fill()
    }

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
    const minX = Math.min(...points.map((point) => point.x)) - 6
    const minY = Math.min(...points.map((point) => point.y)) - 6
    const maxX = Math.max(...points.map((point) => point.x)) + 6
    const maxY = Math.max(...points.map((point) => point.y)) + 6
    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
    }
  }

  const move = (dx: number, dy: number) => {
    points.forEach((point) => {
      point.x += dx
      point.y += dy
    })
  }

  const showBounding = (isShow: boolean) => {
    showBoundingRect = isShow
  }

  const isPointInside = (pointX: number, pointY: number): boolean => {
    const minX = Math.min(...points.map((point) => point.x))
    const minY = Math.min(...points.map((point) => point.y))
    const maxX = Math.max(...points.map((point) => point.x))
    const maxY = Math.max(...points.map((point) => point.y))

    return pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY
  }

  const isPointNearby = (pointX: number, pointY: number): boolean => {
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const distance = Math.sqrt(
        (pointX - point.x) ** 2 + (pointY - point.y) ** 2,
      )
      if (distance <= 5) {
        isChoosingPoint = i
        return true
      }
    }
    return false
  }

  const moveOnePoint = (x: number, y: number) => {
    if (isChoosingPoint === -1) return
    points[isChoosingPoint].x = x
    points[isChoosingPoint].y = y
  }

  return {
    draw,
    move,
    showBounding,
    isPointInside,
    getStrokeCoordinates,
    shapeType,
    isPointNearby,
    moveOnePoint,
    id
  }
}
