import CanvasMode, {
  CanvasState,
  HistoryAction,
  ShapeModeOptions,
} from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import Rectangle from "./shapeObjects/Rectangle"
import Ellipse from "./shapeObjects/Ellipse"
import ShapeInterface, { Point } from "./shapeObjects/Interface"
import BrushStroke from "./shapeObjects/BrushStroke"

export const initialRectangle = (
  context: CanvasRenderingContext2D,
  initialRect: {
    x: number
    y: number
    w: number
    h: number
  },
  panOffset: { x: number; y: number },
) => {
  context.beginPath()
  context.fillStyle = "white"
  context.fillRect(
    initialRect.x + panOffset.x,
    initialRect.y + panOffset.y,
    initialRect.w,
    initialRect.h,
  )
  context.stroke()
}

export const setPreviousHistory = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  initialRect: {
    x: number
    y: number
    w: number
    h: number
  },
  _history: any[],
  index: number,
  panOffSet: { x: number; y: number },
) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  initialRectangle(context, initialRect, panOffSet)

  for (var i = 0; i <= index; i++) {
    var actionType = _history[i].action
    if (_history[i].value == null) continue

    switch (actionType) {
      case HistoryAction.CREATE:
      case HistoryAction.MOVE:
        _history[i].value.draw(context)
        break
      default:
        break
    }
  }
}

const Canvas: React.FC = () => {
  const canvasContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    state,
    setState,
    magnifierZoom,
    updateShapeCoordinates,
    shapeCoordinates,
    brushSettings,
    color,
    mode,
    _shapes,
    setShapes,
    currentShape,
    setCurrentShape,
    shapeMode,
    _history,
    setHistory,
    initialRect,
    setPrevMode,
    panOffset,
    setPanOffset,
    startPanMousePosition,
    setStartPanMousePosition,
    currentHistoryIndex,
    setCurrentHistoryIndex,
  } = canvasContext!

  const [prevMouseX, setPrevMouseX] = useState(0)
  const [prevMouseY, setPrevMouseY] = useState(0)
  const [brushCoordinates, setBrushCoordinates] = useState<Point[]>([])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const context = canvas.getContext("2d")
    context?.clearRect(0, 0, canvas.width, canvas.height)
    if (!context) return
    initialRectangle(context, initialRect, panOffset)
    context.save()
    context.translate(panOffset.x, panOffset.y)
    setPreviousHistory(
      canvas,
      context,
      initialRect,
      _history,
      currentHistoryIndex,
      panOffset,
    )
    context.restore()
  }, [panOffset])

  const isMouseInsideCanvas = (x: number, y: number) => {
    return (
      x >= initialRect.x &&
      x <= initialRect.x + initialRect.w &&
      y >= initialRect.y &&
      y <= initialRect.y + initialRect.h
    )
  }

  const getMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX - panOffset.x
    const y = e.clientY - panOffset.y
    return { x, y }
  }

  // const cropImage = () => {
  //   const canvas = canvasRef.current
  //   if (!canvas) return

  //   const context = canvas.getContext("2d")
  //   if (!context) return

  //   const cropWidth = shapeCoordinates.endX - shapeCoordinates.startX
  //   const cropHeight = shapeCoordinates.endY - shapeCoordinates.startY

  //   const croppedImageData = context.getImageData(
  //     shapeCoordinates.startX,
  //     shapeCoordinates.startY,
  //     cropWidth,
  //     cropHeight,
  //   )
  //   context.clearRect(0, 0, canvas.width, canvas.height)
  //   canvas.width = cropWidth
  //   canvas.height = cropHeight
  //   context.putImageData(croppedImageData, 0, 0)
  // }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { x, y } = getMouseCoordinates(e)
    if (!isMouseInsideCanvas(x, y) && mode !== CanvasMode.DRAG_MODE) return

    const context = canvas.getContext("2d")
    if (!context) return

    switch (mode) {
      case CanvasMode.BRUSH_MODE:
        setState(CanvasState.DRAWING)
        setBrushCoordinates([{ x: x, y: y }])
        break

      case CanvasMode.SELECT_MODE:
        const shapeContainingPoint = _shapes.find((shape) =>
          shape.isPointInside(x, y),
        )
        if (shapeContainingPoint) {
          if (currentShape == null) {
            setPreviousHistory(
              canvas,
              context,
              initialRect,
              _history,
              currentHistoryIndex,
              panOffset,
            )
            shapeContainingPoint.showBounding(true)
            setCurrentShape(shapeContainingPoint)
            setState(CanvasState.IDLE)
            shapeContainingPoint.draw(context)
          } else if (
            shapeContainingPoint == currentShape ||
            currentShape.isPointInside(x, y)
          ) {
            setState(CanvasState.SELECTING)
            setPrevMouseX(x)
            setPrevMouseY(y)
          }
        }

        if (currentShape && !currentShape.isPointInside(x, y)) {
          currentShape.showBounding(false)
          setPreviousHistory(
            canvas,
            context,
            initialRect,
            _history,
            currentHistoryIndex,
            panOffset,
          )
          currentShape.draw(context)
          setCurrentShape(null)
          setState(CanvasState.IDLE)
        }
        break

      case CanvasMode.SHAPE_MODE:
      case CanvasMode.CROP_MODE:
        setState(
          mode === CanvasMode.SHAPE_MODE
            ? CanvasState.DRAWING
            : CanvasState.CROPPING,
        )
        updateShapeCoordinates({ startX: x, startY: y })
        break

      case CanvasMode.OPENPOSE_MODE:
        _shapes.forEach((shape) => {
          if (
            shape.shapeType === ShapeModeOptions.OPENPOSE_SHAPE &&
            shape.isPointNearby(x, y)
          ) {
            setCurrentShape(shape)
            setPreviousHistory(
              canvas,
              context,
              initialRect,
              _history,
              currentHistoryIndex + 1,
              panOffset,
            )
            setState(CanvasState.SELECTING)
          }
        }, [])
        break

      case CanvasMode.DRAG_MODE:
        setStartPanMousePosition({ x: x, y: y })
        setState(CanvasState.DRAGGING)
        break

      default:
        return
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || state === CanvasState.IDLE) return
    const { x, y } = getMouseCoordinates(e)
    if (!isMouseInsideCanvas(x, y) && mode !== CanvasMode.DRAG_MODE) return

    const context = canvas.getContext("2d")
    if (!context) return

    let newShape: ShapeInterface | null = null

    switch (mode) {
      case CanvasMode.BRUSH_MODE:
        setBrushCoordinates((prevCoordinates) => [...prevCoordinates, { x, y }])
        newShape = BrushStroke(brushCoordinates, color, brushSettings.size)
        if (!newShape) return
        setCurrentShape(newShape)
        setPreviousHistory(
          canvas,
          context,
          initialRect,
          _history,
          currentHistoryIndex,
          panOffset,
        )
        newShape.draw(context)
        break

      case CanvasMode.SHAPE_MODE:
        let width = x - shapeCoordinates.startX!
        let height = y - shapeCoordinates.startY!
        setPreviousHistory(
          canvas,
          context,
          initialRect,
          _history,
          currentHistoryIndex,
          panOffset,
        )

        if (shapeMode === ShapeModeOptions.RECTANGLE_SHAPE) {
          let newStartX = Math.min(shapeCoordinates.startX!, x)
          let newStartY = Math.min(shapeCoordinates.startY!, y)
          let newWidth = Math.abs(width)
          let newHeight = Math.abs(height)

          newShape = Rectangle(
            newStartX,
            newStartY,
            newWidth,
            newHeight,
            color,
            brushSettings.size,
          )
        } else if (shapeMode === ShapeModeOptions.CIRCLE_SHAPE) {
          const centerX = (x + shapeCoordinates.startX!) / 2
          const centerY = (y + shapeCoordinates.startY!) / 2
          const radiusX = Math.abs(x - shapeCoordinates.startX!) / 2
          const radiusY = Math.abs(y - shapeCoordinates.startY!) / 2

          newShape = Ellipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            0,
            0,
            2 * Math.PI,
            color,
            brushSettings.size,
          )
        }

        if (!newShape) return
        setCurrentShape(newShape)
        newShape.draw(context)
        context.stroke()
        break

      case CanvasMode.CROP_MODE:
        if (state !== CanvasState.CROPPING) return

        break

      case CanvasMode.SELECT_MODE:
        if (!currentShape || state !== CanvasState.SELECTING) return
        let dx = x - prevMouseX
        let dy = y - prevMouseY

        var coordinates = currentShape.getStrokeCoordinates()
        if (
          coordinates.x + dx < initialRect.x ||
          coordinates.y + dy < initialRect.y ||
          coordinates.x + coordinates.w + dx > initialRect.x + initialRect.w ||
          coordinates.y + coordinates.h + dy > initialRect.y + initialRect.h
        ) {
          dx = 0
          dy = 0
        }
        currentShape.move(dx, dy)
        setPrevMouseX(x)
        setPrevMouseY(y)
        setPreviousHistory(
          canvas,
          context,
          initialRect,
          _history,
          currentHistoryIndex,
          panOffset,
        )
        currentShape.draw(context)
        break
      case CanvasMode.DRAG_MODE:
        if (state !== CanvasState.DRAGGING) return
        const dX = x - startPanMousePosition.x
        const dY = y - startPanMousePosition.y
        setPanOffset((prevOffset) => ({
          x: prevOffset.x + dX,
          y: prevOffset.y + dY,
        }))

        break

      case CanvasMode.OPENPOSE_MODE:
        if (state !== CanvasState.SELECTING) return
        currentShape.moveOnePoint(x, y)
        setPreviousHistory(
          canvas,
          context,
          initialRect,
          _history,
          currentHistoryIndex + 1,
          panOffset,
        )
        break
      default:
        return
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || state === CanvasState.IDLE) return
    const { x, y } = getMouseCoordinates(e)
    if (!isMouseInsideCanvas(x, y) && state !== CanvasState.DRAGGING) return

    const context = canvas.getContext("2d")
    if (!context) return
    setPrevMode(mode)
    switch (mode) {
      case CanvasMode.BRUSH_MODE:
      case CanvasMode.SHAPE_MODE:
        setBrushCoordinates([])
        setShapes([..._shapes, currentShape])
        setHistory([
          ..._history,
          { action: HistoryAction.CREATE, value: currentShape },
        ])
        setCurrentHistoryIndex(currentHistoryIndex + 1)
        setCurrentShape(null)
        setState(CanvasState.IDLE)
        break

      // case CanvasMode.CROP_MODE:
      //   if (state === CanvasState.CROPPING) {
      //     cropImage()
      //   }
      //   setState(CanvasState.IDLE)
      //   break

      case CanvasMode.SELECT_MODE:
        if (state !== CanvasState.SELECTING) return

        setPreviousHistory(
          canvas,
          context,
          initialRect,
          _history,
          currentHistoryIndex,
          panOffset,
        )
        currentShape.draw(context)
        setState(CanvasState.IDLE)
        setCurrentHistoryIndex(currentHistoryIndex + 1)
        setHistory([
          ..._history,
          { action: HistoryAction.MOVE, value: currentShape },
        ])
        break
      case CanvasMode.DRAG_MODE:
        setState(CanvasState.IDLE)
        break

      case CanvasMode.OPENPOSE_MODE:
        if (state !== CanvasState.SELECTING) return
        setState(CanvasState.IDLE)
        setCurrentHistoryIndex(currentHistoryIndex + 1)
        setHistory([
          ..._history,
          { action: HistoryAction.MOVE, value: currentShape },
        ])
        break
      default:
        return
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute z-0"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    ></canvas>
  )
}

export default Canvas
