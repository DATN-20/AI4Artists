import CanvasMode, {
  CanvasState,
  HistoryAction,
  ShapeModeOptions,
} from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import Rectangle from "./shapeObjects/Rectangle"
import Ellipse from "./shapeObjects/Ellipse"
import ShapeInterface, { Point } from "./shapeObjects/ShapeInterface"
import BrushStroke from "./shapeObjects/BrushStroke"
import {
  adjustHistoryToIndex,
  redo,
  undo,
  setNewHistory,
  getShapesFromHistory,
} from "./HistoryUtilities"

const Canvas: React.FC = () => {
  const canvasContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    state,
    setState,
    updateShapeCoordinates,
    shapeCoordinates,
    brushSettings,
    color,
    mode,
    currentShape,
    setCurrentShape,
    shapeMode,
    _history,
    setHistory,
    initialRectPosition,
    panOffset,
    setPanOffset,
    startPanMousePosition,
    setStartPanMousePosition,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    shapeId,
    setShapeId,
    scale,
    scaleOffset,
    setScaleOffset,
    setScale,
    imageFile,
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
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)

    const scaledWidth = canvas.width * scale
    const scaledHeight = canvas.height * scale
    const scaleOffsetX = (scaledWidth - canvas.width) / 2
    const scaleOffsetY = (scaledHeight - canvas.height) / 2
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY })

    context.save()
    context.translate(
      panOffset.x * scale - scaleOffsetX,
      panOffset.y * scale - scaleOffsetY,
    )
    context.scale(scale, scale)
    adjustHistoryToIndex(
      canvas,
      context,
      initialRectPosition,
      _history,
      currentHistoryIndex,
      panOffset,
      true,
      imageFile,
    )
    context.restore()
  }, [panOffset, _history, currentHistoryIndex, scale, initialRectPosition])

  useEffect(() => {
    const panFunction = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        handleCtrlWheelFunction(event)
      } else {
        setPanOffset((prevState) => ({
          x: prevState.x - event.deltaX / 10,
          y: prevState.y - event.deltaY / 10,
        }))
      }
    }

    const handleCtrlWheelFunction = (event: WheelEvent) => {
      setScale((prevState) => {
        let newScale = prevState - event.deltaY / 1000
        if (newScale < 0.1) newScale = 0.1
        if (newScale > 3) newScale = 3
        return newScale
      })
    }

    document.addEventListener("wheel", panFunction)
    return () => {
      document.removeEventListener("wheel", panFunction)
    }
  }, [])

  useEffect(() => {
    const undoRedoFunction = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo(
            canvasRef.current!,
            canvasRef.current!.getContext("2d")!,
            initialRectPosition,
            _history,
            currentHistoryIndex,
            setCurrentHistoryIndex,
            panOffset,
            imageFile
          )
        } else {
          undo(
            canvasRef.current!,
            canvasRef.current!.getContext("2d")!,
            initialRectPosition,
            _history,
            currentHistoryIndex,
            setCurrentHistoryIndex,
            panOffset,
            imageFile
          )
        }
      }
    }

    document.addEventListener("keydown", undoRedoFunction)
    return () => {
      document.removeEventListener("keydown", undoRedoFunction)
    }
  }, [
    undo,
    redo,
    currentHistoryIndex,
    _history,
    panOffset,
    initialRectPosition,
  ])

  const isMouseInsideCanvas = (x: number, y: number) => {
    return (
      x >= initialRectPosition.x &&
      x <= initialRectPosition.x + initialRectPosition.w &&
      y >= initialRectPosition.y &&
      y <= initialRectPosition.y + initialRectPosition.h
    )
  }

  const getMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = (e.clientX - panOffset.x * scale + scaleOffset.x) / scale
    const y = (e.clientY - panOffset.y * scale + scaleOffset.y) / scale
    return { x, y }
  }

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
        const shapeContainingPoint = getShapesFromHistory(_history).find(
          (shape) => shape.isPointInside(x, y),
        )
        if (shapeContainingPoint) {
          if (currentShape == null) {
            adjustHistoryToIndex(
              canvas,
              context,
              initialRectPosition,
              _history,
              currentHistoryIndex,
              panOffset,
              true,
              imageFile,
            )
            shapeContainingPoint.showBounding(true)
            setCurrentShape(shapeContainingPoint)
            setState(CanvasState.IDLE)
            shapeContainingPoint.draw(context, panOffset)
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
          adjustHistoryToIndex(
            canvas,
            context,
            initialRectPosition,
            _history,
            currentHistoryIndex,
            panOffset,
            true,
            imageFile,
          )
          currentShape.draw(context, panOffset)
          setCurrentShape(null)
          setState(CanvasState.IDLE)
        }
        break

      case CanvasMode.SHAPE_MODE:
        setState(CanvasState.DRAWING)
        updateShapeCoordinates({ startX: x, startY: y })
        console.log(initialRectPosition, panOffset.x, panOffset.y)
        break

      case CanvasMode.OPENPOSE_MODE:
        getShapesFromHistory(_history).forEach((shape) => {
          if (
            shape.shapeType === ShapeModeOptions.OPENPOSE_SHAPE &&
            shape.isPointNearby(x, y)
          ) {
            setCurrentShape(shape)
            adjustHistoryToIndex(
              canvas,
              context,
              initialRectPosition,
              _history,
              currentHistoryIndex,
              panOffset,
              true,
              imageFile,
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
        setShapeId(shapeId + 1)
        newShape = BrushStroke(
          shapeId,
          brushCoordinates,
          color,
          brushSettings.size,
        )
        if (!newShape) return
        setCurrentShape(newShape)
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageFile,
        )
        newShape.draw(context, panOffset)
        break

      case CanvasMode.SHAPE_MODE:
        let width = x - shapeCoordinates.startX!
        let height = y - shapeCoordinates.startY!
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageFile,
        )

        if (shapeMode === ShapeModeOptions.RECTANGLE_SHAPE) {
          let newStartX = Math.min(shapeCoordinates.startX!, x)
          let newStartY = Math.min(shapeCoordinates.startY!, y)
          let newWidth = Math.abs(width)
          let newHeight = Math.abs(height)
          setShapeId(shapeId + 1)
          newShape = Rectangle(
            shapeId,
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
          setShapeId(shapeId + 1)
          newShape = Ellipse(
            shapeId,
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
        newShape.draw(context, panOffset)
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
          coordinates.x + dx < initialRectPosition.x ||
          coordinates.y + dy < initialRectPosition.y ||
          coordinates.x + coordinates.w + dx >
            initialRectPosition.x + initialRectPosition.w ||
          coordinates.y + coordinates.h + dy >
            initialRectPosition.y + initialRectPosition.h
        ) {
          dx = 0
          dy = 0
        }
        currentShape.move(dx, dy)
        setPrevMouseX(x)
        setPrevMouseY(y)
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageFile,
        )
        currentShape.draw(context, panOffset)
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
        console.log(_history, currentHistoryIndex)
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageFile,
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
    switch (mode) {
      case CanvasMode.BRUSH_MODE:
      case CanvasMode.SHAPE_MODE:
        setBrushCoordinates([])
        setNewHistory(
          currentHistoryIndex,
          setCurrentHistoryIndex,
          _history,
          setHistory,
          currentShape,
          HistoryAction.CREATE,
        )
        setCurrentShape(null)
        setState(CanvasState.IDLE)
        break

      case CanvasMode.SELECT_MODE:
        if (state !== CanvasState.SELECTING) return

        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageFile,
        )
        currentShape.draw(context, panOffset)
        setState(CanvasState.IDLE)
        setNewHistory(
          currentHistoryIndex,
          setCurrentHistoryIndex,
          _history,
          setHistory,
          currentShape,
          HistoryAction.MOVE,
        )
        break
      case CanvasMode.DRAG_MODE:
        setState(CanvasState.IDLE)
        break

      case CanvasMode.OPENPOSE_MODE:
        if (state !== CanvasState.SELECTING) return
        setState(CanvasState.IDLE)
        setNewHistory(
          currentHistoryIndex,
          setCurrentHistoryIndex,
          _history,
          setHistory,
          currentShape,
          HistoryAction.MOVE,
        )
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
