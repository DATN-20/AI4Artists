import { ShapeModeOptions } from "@/constants/canvas"

interface ShapeInterface {
  isPointInside(pointX: number, pointY: number): boolean
  draw(context: CanvasRenderingContext2D): void
  move(dx: number, dy: number): void
  showBounding(isShow: boolean): void
  getStrokeCoordinates(): void
  shapeType: ShapeModeOptions
}

export interface Point {
  x: number
  y: number
}

export default ShapeInterface
