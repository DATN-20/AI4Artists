import { ShapeModeOptions } from "@/constants/canvas"

export default interface ShapeInterface {
  isPointInside(pointX: number, pointY: number): boolean
  draw(context: CanvasRenderingContext2D, panOffset: { x: number; y: number }): void
  move(dx: number, dy: number): void
  showBounding(isShow: boolean): void
  getStrokeCoordinates(): void
  shapeType: ShapeModeOptions
  id : number
}

export interface Point {
  x: number
  y: number
}

export let idCounter = 0;
