"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import {
  RiAddLine,
  RiSubtractLine,
  RiRectangleLine,
  RiZoomInLine,
  RiZoomOutLine,
} from "react-icons/ri"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import { IoIosBrush } from "react-icons/io"
import { LuMousePointer2, LuEraser } from "react-icons/lu"
import { FaRegHandPaper, FaShapes, FaRegCircle } from "react-icons/fa"
import { IoTriangleOutline } from "react-icons/io5"
import { FaCropSimple } from "react-icons/fa6"

const Canvas: React.FC = () => {
  const RECTANGLE_SHAPE = 1
  const CIRCLE_SHAPE = 2

  const BRUSH_MODE = 0
  const DRAG_MODE = 1
  const SELECT_MODE = 2
  const SHAPE_MODE = 3
  const ERASE_MODE = 4
  const CROP_MODE = 10

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const savedCanvasImageDataRef = useRef<ImageData | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [mode, setMode] = useState<number>(DRAG_MODE)

  const [brushColor, setBrushColor] = useState<string>("black")
  const [lastX, setLastX] = useState<number | null>(null)
  const [lastY, setLastY] = useState<number | null>(null)
  const [brushSize, setBrushSize] = useState<number>(5)

  const [shapeMode, setShapeMode] = useState<number>(RECTANGLE_SHAPE)
  const shapeModeRef = useRef<number>(shapeMode)
  const [startX, setStartX] = useState<number>(0)
  const [startY, setStartY] = useState<number>(0)
  const [endX, setEndX] = useState<number>(0)
  const [endY, setEndY] = useState<number>(0)
  const [cropMode, setCropMode] = useState<number>(CROP_MODE)
  const [cropStartX, setCropStartX] = useState<number>(0)
  const [cropStartY, setCropStartY] = useState<number>(0)
  const [cropEndX, setCropEndX] = useState<number>(0)
  const [cropEndY, setCropEndY] = useState<number>(0)
  const [isCropping, setIsCropping] = useState<boolean>(false)
  const [magnifierZoom, setMagnifierZoom] = useState<number>(1)
  const [isZooming, setIsZooming] = useState<boolean>(false)

  useEffect(() => {
    shapeModeRef.current = shapeMode
  }, [shapeMode])

  const handleBrushSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSize = parseInt(event.target.value, 10)
      setBrushSize(newSize)
    },
    [],
  )

  const tools = [
    { icon: <IoIosBrush size={25} />, mode: BRUSH_MODE },
    { icon: <LuMousePointer2 size={25} />, mode: DRAG_MODE },
    { icon: <FaRegHandPaper size={25} />, mode: SELECT_MODE },
    { icon: <FaShapes size={25} />, mode: SHAPE_MODE },
    { icon: <LuEraser size={25} />, mode: ERASE_MODE },
    { icon: <FaCropSimple size={25} />, mode: CROP_MODE },
  ]

  // Handle magnifier tool click
  const handleMagnifierClick = (action: string) => {
    setIsZooming(true)
    if (action === "zoomIn") {
      setMagnifierZoom(magnifierZoom + 0.1)
    } else if (action === "zoomOut") {
      setMagnifierZoom(Math.max(magnifierZoom - 0.1, 0.1))
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

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the magnified area
    context.drawImage(
      canvas,
      mouseX - 50 * magnifierZoom, // Adjust according to your magnifier size
      mouseY - 50 * magnifierZoom,
      100 * magnifierZoom,
      100 * magnifierZoom,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }

  const handleToolClick = (toolMode: number) => {
    setMode(toolMode)
  }

  const handleColorChange = (color: string) => {
    setBrushColor(color)
  }

  const handleShapeChange = (shapeType: number) => {
    setShapeMode(shapeType)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (mode === BRUSH_MODE) {
      setIsDrawing(true)

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const context = canvas.getContext("2d")
      if (!context || mode !== 0) return

      setLastX(x)
      setLastY(y)

      context.beginPath()
      context.moveTo(x, y)
    } else if (mode === DRAG_MODE) {
      // Handle DragMode logic
      console.log("Mouse down in DragMode")
    } else if (mode === SELECT_MODE) {
      // Handle SelectMode logic
      console.log("Mouse down in SelectMode")
    } else if (mode === SHAPE_MODE) {
      setIsDrawing(true)
      setStartX(e.clientX - canvas.getBoundingClientRect().left)
      setStartY(e.clientY - canvas.getBoundingClientRect().top)
      const context = canvas.getContext("2d")
      if (context) {
        savedCanvasImageDataRef.current = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        )
      }
    } else if (mode === CROP_MODE) {
      setIsCropping(true)
      setCropStartX(e.clientX - canvas.getBoundingClientRect().left)
      setCropStartY(e.clientY - canvas.getBoundingClientRect().top)
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
    if (mode === BRUSH_MODE) {
      setIsDrawing(false)
    } else if (mode === SHAPE_MODE) {
      setIsDrawing(false)
      setStartX(null)
      setStartY(null)
      setEndX(null)
      setEndY(null)
    } else if (mode === CROP_MODE && isCropping) {
      setIsCropping(false)
      // Crop operation
      cropImage()
    }
  }

  const cropImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context || !savedCanvasImageDataRef.current) return

    const cropWidth = cropEndX - cropStartX
    const cropHeight = cropEndY - cropStartY

    const croppedImageData = context.getImageData(
      cropStartX,
      cropStartY,
      cropWidth,
      cropHeight,
    )

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Resize canvas
    canvas.width = cropWidth
    canvas.height = cropHeight

    // Put cropped image data onto canvas
    context.putImageData(croppedImageData, 0, 0)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (mode === BRUSH_MODE) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const context = canvas.getContext("2d")
      if (!context || !isDrawing || mode !== BRUSH_MODE) return

      context.lineWidth = brushSize
      context.lineCap = "round"
      context.strokeStyle = brushColor

      if (lastX !== null && lastY !== null) {
        context.beginPath()
        context.moveTo(lastX, lastY) // Move this line here
        context.lineTo(x, y)
        context.stroke()

        setLastX(x)
        setLastY(y)
      }
    } else if (mode === SHAPE_MODE) {
      if (!isDrawing) return
      drawShape(e)
    } else if (mode === CROP_MODE && isCropping) {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setCropEndX(mouseX)
      setCropEndY(mouseY)
      drawCropRect()
    }
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

    const width = cropEndX - cropStartX
    const height = cropEndY - cropStartY
    context.setLineDash([5, 5])
    context.strokeStyle = "blue"
    context.lineWidth = 2
    context.beginPath()
    context.rect(cropStartX, cropStartY, width, height)
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

    const width = mouseX - startX!
    const height = mouseY - startY!

    context.strokeStyle = brushColor
    context.lineWidth = brushSize
    context.beginPath()

    if (savedCanvasImageDataRef.current) {
      context.putImageData(savedCanvasImageDataRef.current, 0, 0)
    }

    if (shapeModeRef.current === RECTANGLE_SHAPE) {
      context.rect(startX!, startY!, width, height)
    } else if (shapeModeRef.current === CIRCLE_SHAPE) {
      const centerX = (mouseX + startX!) / 2
      const centerY = (mouseY + startY!) / 2
      context.ellipse(
        centerX,
        centerY,
        Math.abs(mouseX - startX!) / 2,
        Math.abs(mouseY - startY!) / 2,
        0,
        0,
        2 * Math.PI,
      )
    }
    context.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isDrawing, mode, brushColor, lastX, lastY])

  return (
    <div className="flex w-full lg:p-2">
      <div className="ml-40 mr-16 w-10/12">
        <div className="flex items-center justify-center">
          <div className=" h-[700px] w-[1000px] overflow-hidden rounded-lg border">
            <div className="h-full w-full bg-gray-200">
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
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <Button
              className="rounded-xl bg-card font-bold"
              onClick={() => handleMagnifierClick("zoomIn")}
            >
              <RiZoomInLine />
            </Button>
            <Button
              className="mx-4 rounded-xl bg-card font-bold"
              onClick={() => handleMagnifierClick("zoomOut")}
            >
              <RiZoomOutLine />
            </Button>
          </div>
          <div>
            <Button className="rounded-xl bg-card font-bold">
              <RiAddLine />
            </Button>
            <Button className="mx-4 rounded-xl bg-card font-bold">100%</Button>
            <Button className="rounded-xl bg-card font-bold">
              <RiSubtractLine />
            </Button>
          </div>
          <div>
            <Button className="me-4 rounded-xl bg-card font-bold">
              <BsChevronLeft />
            </Button>
            <Button className="rounded-xl bg-card font-bold">
              <BsChevronRight />
            </Button>
          </div>
        </div>
        <div className="flex items-center mt-4 rounded-lg bg-card p-4">
          {mode === BRUSH_MODE && (
            <div className="flex items-center gap-2">
              <ColorButton
                color="black"
                onClick={() => handleColorChange("black")}
              />
              <ColorButton
                color="red"
                onClick={() => handleColorChange("red")}
              />
              <ColorButton
                color="green"
                onClick={() => handleColorChange("green")}
              />
              <div className="flex items-center gap-2">
                <label htmlFor="brushSize" className="text-sm text-gray-600">
                  Brush Size: {brushSize}
                </label>
                <input
                  type="range"
                  id="brushSize"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={handleBrushSizeChange}
                />
              </div>
            </div>
          )}
          {mode === SHAPE_MODE && (
            <div className="flex">
              <div>
                <ShapeButton
                  icon={<RiRectangleLine />}
                  onClick={() => handleShapeChange(RECTANGLE_SHAPE)}
                  isActive={shapeMode === RECTANGLE_SHAPE}
                />
              </div>
              <div>
                <ShapeButton
                  icon={<FaRegCircle />}
                  onClick={() => handleShapeChange(CIRCLE_SHAPE)}
                  isActive={shapeMode === CIRCLE_SHAPE}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-1/12 items-center gap-4">
        <div className="mr-16 flex items-center justify-center rounded-lg bg-card px-4">
          <div className="my-4 flex flex-col items-center gap-4">
            {tools.map((tool) => (
              <Button
                key={tool.mode}
                className={`rounded-xl ${mode !== tool.mode ? "bg-card" : ""} py-6 font-bold`}
                onClick={() => {
                  if (tool.mode === CROP_MODE) {
                    setMode(tool.mode)
                    setIsZooming(false)
                  } else {
                    setMode(tool.mode)
                    setIsCropping(false)
                    setIsZooming(false)
                  }
                }}
              >
                {tool.icon}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const ShapeButton: React.FC<{
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean
}> = ({ icon, onClick, isActive }) => (
  <Button
    className={`rounded-xl ${isActive ? "" : "bg-card"}`}
    onClick={onClick}
  >
    {icon}
  </Button>
)

const ColorButton: React.FC<{ color: string; onClick: () => void }> = ({
  color,
  onClick,
}) => (
  <button
    className={`mx-1 h-5 w-5 rounded-full border border-gray-500`}
    style={{ backgroundColor: color }}
    onClick={onClick}
  />
)

export default Canvas
