import CanvasMode, {
  CanvasState,
  HistoryAction,
  ShapeModeOptions,
} from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import React, { useContext, useEffect, useLayoutEffect } from "react"
import Rectangle from "./shapeObjects/Rectangle"
import Ellipse from "./shapeObjects/Ellipse"
import ShapeInterface from "./shapeObjects/ShapeInterface"
import BrushStroke from "./shapeObjects/BrushStroke"
import {
  adjustHistoryToIndex,
  redo,
  undo,
  setNewHistory,
  getShapesFromHistory,
  handleMouseUpCanvas,
} from "./HistoryUtilities"

const Canvas: React.FC = () => {
  const canvasContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    state,
    setState,
    updateShapeCoordinates,
    shapeCoordinates,
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
    currentHistoryIndex,
    setCurrentHistoryIndex,
    shapeId,
    setShapeId,
    scale,
    setScale,
    imageRef,
    eraseMode,
    cursor,
    setCursor,
    updateInitialRectPosition,
    brushSize,
    brushCoordinates,
    setBrushCoordinates,
  } = canvasContext!

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const context = canvas.getContext("2d")
    if (!context) return

    const scaledWidth = canvas.width * scale
    const scaledHeight = canvas.height * scale
    const scaleOffsetX = (scaledWidth - canvas.width) / 2
    const scaleOffsetY = (scaledHeight - canvas.height) / 2
    context.save()
    context.translate(
      panOffset.x * scale - scaleOffsetX,
      panOffset.y * scale - scaleOffsetY,
    )
    context.restore()
    context.scale(scale, scale)
    adjustHistoryToIndex(
      canvas,
      context,
      initialRectPosition,
      _history,
      currentHistoryIndex,
      panOffset,
      true,
      imageRef.current!,
    )
  }, [panOffset, initialRectPosition, scale, currentHistoryIndex])

  useEffect(() => {
    if (localStorage.getItem("imageUrl")) {
      const imageUrl = localStorage.getItem("imageUrl")
      const image = new Image()
      image.src = imageUrl!
      imageRef.current = image
      updateInitialRectPosition({
        w: (600 * image.width) / image.height,
        h: 600,
      })
      localStorage.removeItem("imageUrl")
    }

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
        let newScale =
          Math.round((prevState - event.deltaY / 1000) / 0.25) * 0.25
        if (newScale < 0.25) newScale = 0.25
        if (newScale > 3) newScale = 3
        return newScale
      })
    }

    document.addEventListener("wheel", panFunction, { passive: false })
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
            imageRef.current!,
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
            imageRef.current!,
          )
        }
      }
    }

    document.addEventListener("keydown", undoRedoFunction)
    return () => {
      document.removeEventListener("keydown", undoRedoFunction)
    }
  }, [])

  const getMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = (e.clientX - panOffset.x * scale) / scale
    const y = (e.clientY - panOffset.y * scale) / scale
    return { x, y }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { x, y } = getMouseCoordinates(e)
    const context = canvas.getContext("2d")
    if (!context) return

    switch (mode) {
      case CanvasMode.BRUSH_MODE:
        setState(CanvasState.DRAWING)
        setBrushCoordinates([{ x: x, y: y }])
        break

      case CanvasMode.SELECT_MODE:
        const shapeContainingPoint = getShapesFromHistory(
          _history,
          currentHistoryIndex,
        ).find((shape) => shape.isPointInside(x, y))
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
              imageRef.current!,
            )
            shapeContainingPoint.showBounding(true)
            setCurrentShape(shapeContainingPoint)
            setState(CanvasState.READY)
            shapeContainingPoint.draw(context, panOffset)
          } else if (
            shapeContainingPoint == currentShape ||
            currentShape.isPointInside(x, y)
          ) {
            setState(CanvasState.SELECTING)
            updateShapeCoordinates({ startX: x, startY: y })
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
            imageRef.current!,
          )
          setCursor("pointer.cur")
          currentShape.draw(context, panOffset)
          setCurrentShape(null)
          setState(CanvasState.IDLE)
        }
        break

      case CanvasMode.SHAPE_MODE:
        setState(CanvasState.DRAWING)
        updateShapeCoordinates({ startX: x, startY: y })
        break

      case CanvasMode.OPENPOSE_MODE:
        getShapesFromHistory(_history, currentHistoryIndex).forEach((shape) => {
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
              imageRef.current!,
            )
            setState(CanvasState.SELECTING)
          }
        }, [])
        break

      case CanvasMode.DRAG_MODE:
        setCursor("grab_hold.png")
        updateShapeCoordinates({ startX: x, startY: y })
        setState(CanvasState.DRAGGING)
        break

      case CanvasMode.ERASE_MODE:
        if (eraseMode !== 0) return
        const shapeContainingPoints = getShapesFromHistory(
          _history,
          currentHistoryIndex,
        ).find((shape) => shape.isPointInside(x, y))
        if (shapeContainingPoints) {
          if (eraseMode === 0) {
            setNewHistory(
              currentHistoryIndex,
              setCurrentHistoryIndex,
              _history,
              setHistory,
              shapeContainingPoints,
              HistoryAction.DELETE,
            )
          }
        }

      default:
        return
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || state === CanvasState.IDLE) return
    const { x, y } = getMouseCoordinates(e)
    const context = canvas.getContext("2d")
    if (!context) return

    let newShape: ShapeInterface | null = null

    switch (mode) {
      case CanvasMode.BRUSH_MODE:
        setBrushCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          { x: x, y: y },
        ])
        setShapeId(shapeId + 1)
        newShape = BrushStroke(shapeId, brushCoordinates, color, brushSize)
        setCurrentShape(() => newShape)
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageRef.current!,
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
          imageRef.current!,
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
            brushSize,
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
            brushSize,
          )
        }

        if (!newShape) return
        setCurrentShape(newShape)
        newShape.draw(context, panOffset)
        context.stroke()
        break

      case CanvasMode.SELECT_MODE:
        if (!currentShape || state.valueOf() === CanvasState.IDLE.valueOf())
          return
        if (currentShape.isPointInside(x, y)) {
          setCursor("move.cur")
        } else {
          setCursor("pointer.cur")
        }

        if (state.valueOf() === CanvasState.READY.valueOf()) return
        let dx = x - shapeCoordinates.startX
        let dy = y - shapeCoordinates.startY

        currentShape.move(dx, dy)
        updateShapeCoordinates({ startX: x, startY: y })
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageRef.current!,
        )
        currentShape.showBounding(false)
        currentShape.draw(context, panOffset)
        break
      case CanvasMode.DRAG_MODE:
        if (state !== CanvasState.DRAGGING) return
        const dX = x - shapeCoordinates.startX
        const dY = y - shapeCoordinates.startY
        setPanOffset((prevOffset) => ({
          x: prevOffset.x + dX,
          y: prevOffset.y + dY,
        }))

        break

      case CanvasMode.OPENPOSE_MODE:
        if (state !== CanvasState.SELECTING) return
        currentShape.moveOnePoint(x, y)
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          imageRef.current!,
        )
        break
      default:
        return
    }
  }

  const handleMouseUp = () =>
    handleMouseUpCanvas(
      canvasRef,
      state,
      setState,
      mode,
      currentShape,
      setCurrentShape,
      currentHistoryIndex,
      setCurrentHistoryIndex,
      _history,
      setHistory,
      panOffset,
      initialRectPosition,
      setBrushCoordinates,
      setCursor,
      imageRef,
    )

  return (
    <>
      <img ref={imageRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        className="absolute z-0"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        style={{ cursor: `url(/cursors/${cursor}), auto` }}
      ></canvas>
    </>
  )
}

export default Canvas
