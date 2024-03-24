import CanvasMode, { ShapeModeOptions } from "@/constants/canvas"
import { useCanvasState } from "@/store/canvasHooks"
import { BrushSizeStateContext } from "@/store/canvasHooks"
import { ColorStateContext } from "@/store/canvasHooks"
import { CanvasModeContext, ShapeStateContext } from "@/store/canvasHooks"
import { useContext } from "react"

const Canvas: React.FC = () => {
  const {
    canvasRef,
    isZooming,
    isDrawing,
    magnifierZoom,
    isCropping,
    updateShapeCoordinates,
    setIsDrawing,
    setIsCropping,
    savedCanvasImageDataRef,
    shapeCoordinates,
  } = useCanvasState()
  const brushContext = useContext(BrushSizeStateContext)
  const { brushSettings } = brushContext!
  const shapeContext = useContext(ShapeStateContext)
  const { shapeModeRef } = shapeContext!
  const colorContext = useContext(ColorStateContext)
  const { color } = colorContext!
  const canvasModeContext = useContext(CanvasModeContext)
  const { mode } = canvasModeContext!

  const cropImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context || !savedCanvasImageDataRef.current) return

    const cropWidth = shapeCoordinates.endX - shapeCoordinates.startX
    const cropHeight = shapeCoordinates.endY - shapeCoordinates.startY

    const croppedImageData = context.getImageData(
      shapeCoordinates.startX,
      shapeCoordinates.startY,
      cropWidth,
      cropHeight,
    )
    context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.width = cropWidth
    canvas.height = cropHeight
    context.putImageData(croppedImageData, 0, 0)
  }

  const drawCropRect = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)

    if (savedCanvasImageDataRef.current) {
      context.putImageData(savedCanvasImageDataRef.current, 0, 0)
    }

    const width = shapeCoordinates.endX - shapeCoordinates.startX
    const height = shapeCoordinates.endY - shapeCoordinates.startY
    context.setLineDash([5, 5])
    context.strokeStyle = "blue"
    context.lineWidth = 2
    context.beginPath()
    context.rect(
      shapeCoordinates.startX,
      shapeCoordinates.startY,
      width,
      height,
    )
    context.stroke()
    context.setLineDash([])
  }

  const drawShape = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const context = canvas.getContext("2d")
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    const width = mouseX - shapeCoordinates.startX!
    const height = mouseY - shapeCoordinates.startY!
    context.strokeStyle = color
    context.lineWidth = brushSettings.size
    context.beginPath()

    if (savedCanvasImageDataRef.current) {
      context.putImageData(savedCanvasImageDataRef.current, 0, 0)
    }

    if (shapeModeRef.current === ShapeModeOptions.RECTANGLE_SHAPE) {
      context.rect(
        shapeCoordinates.startX!,
        shapeCoordinates.startY!,
        width,
        height,
      )
    } else if (shapeModeRef.current === ShapeModeOptions.CIRCLE_SHAPE) {
      const centerX = (mouseX + shapeCoordinates.startX!) / 2
      const centerY = (mouseY + shapeCoordinates.startY!) / 2
      context.ellipse(
        centerX,
        centerY,
        Math.abs(mouseX - shapeCoordinates.startX!) / 2,
        Math.abs(mouseY - shapeCoordinates.startY!) / 2,
        0,
        0,
        2 * Math.PI,
      )
    }
    context.stroke()
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (mode === CanvasMode.BRUSH_MODE) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const context = canvas.getContext("2d")
      if (!context || !isDrawing || mode !== CanvasMode.BRUSH_MODE) return

      context.lineWidth = brushSettings.size
      context.lineCap = "round"
      context.strokeStyle = color

      if (shapeCoordinates.endX !== 0 && shapeCoordinates.endY !== 0) {
        context.beginPath()
        context.moveTo(shapeCoordinates.endX, shapeCoordinates.endY) // Move this line here
        context.lineTo(x, y)
        context.stroke()
        updateShapeCoordinates({ endX: x, endY: y })
      }
    } else if (mode === CanvasMode.SHAPE_MODE) {
      if (!isDrawing) return
      drawShape(e)
    } else if (mode === CanvasMode.CROP_MODE && isCropping) {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      updateShapeCoordinates({ endX: mouseX, endY: mouseY })
      drawCropRect()
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (mode === CanvasMode.BRUSH_MODE) {
      setIsDrawing(true)

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const context = canvas.getContext("2d")
      if (!context || mode !== 0) return
      updateShapeCoordinates({ endX: x, endY: y })
      context.beginPath()
      context.moveTo(x, y)
    } else if (mode === CanvasMode.DRAG_MODE) {
      // Handle DragMode logic
      console.log("Mouse down in DragMode")
    } else if (mode === CanvasMode.SELECT_MODE) {
      // Handle SelectMode logic
      console.log("Mouse down in SelectMode")
    } else if (mode === CanvasMode.SHAPE_MODE) {
      setIsDrawing(true)
      updateShapeCoordinates({
        startX: e.clientX - canvas.getBoundingClientRect().left,
        startY: e.clientY - canvas.getBoundingClientRect().top,
      })
      const context = canvas.getContext("2d")
      if (context) {
        savedCanvasImageDataRef.current = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        )
      }
    } else if (mode === CanvasMode.CROP_MODE) {
      setIsCropping(true)
      updateShapeCoordinates({
        startX: e.clientX - canvas.getBoundingClientRect().left,
        startY: e.clientY - canvas.getBoundingClientRect().top,
      })
      const context = canvas.getContext("2d")
      if (context) {
        savedCanvasImageDataRef.current = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        )
      }
    }
  }

  const handleMouseUp = () => {
    if (mode === CanvasMode.BRUSH_MODE) {
      setIsDrawing(false)
    } else if (mode === CanvasMode.SHAPE_MODE) {
      setIsDrawing(false)
      updateShapeCoordinates({ startX: 0, startY: 0, endX: 0, endY: 0 })
    } else if (mode === CanvasMode.CROP_MODE && isCropping) {
      setIsCropping(false)
      cropImage()
    }
  }

  const updateMagnifiedCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const context = canvas.getContext("2d")
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      canvas,
      mouseX - 50 * magnifierZoom,
      mouseY - 50 * magnifierZoom,
      100 * magnifierZoom,
      100 * magnifierZoom,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }

  return (
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={(e) => {
          handleMouseDown(e)
          if (isZooming) {
            updateMagnifiedCanvas(e)
          }
          // updateMagnifiedCanvas(e) // Gọi hàm để cập nhật hình ảnh phóng to
        }}
      ></canvas>
  )
}

export default Canvas
