"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RiAddLine, RiSubtractLine, RiRectangleLine } from 'react-icons/ri';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { IoIosBrush } from "react-icons/io";
import { LuMousePointer2, LuEraser } from "react-icons/lu";
import { FaRegHandPaper, FaShapes, FaRegCircle } from "react-icons/fa";
import { IoTriangleOutline } from "react-icons/io5";

const Canvas: React.FC = () => {

  const RECTANGLE_SHAPE = 1;
  const CIRCLE_SHAPE = 2;

  const BRUSH_MODE = 0;
  const DRAG_MODE = 1;
  const SELECT_MODE = 2;
  const SHAPE_MODE = 3;
  const ERASE_MODE = 4;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const savedCanvasImageDataRef = useRef<ImageData | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mode, setMode] = useState<number>(DRAG_MODE);

  const [brushColor, setBrushColor] = useState<string>('black');
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [brushSize, setBrushSize] = useState<number>(5);

  const [shapeMode, setShapeMode] = useState<number>(RECTANGLE_SHAPE);
  const shapeModeRef = useRef<number>(shapeMode);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [endY, setEndY] = useState<number>(0);
  useEffect(() => {
    shapeModeRef.current = shapeMode;
  }, [shapeMode]);

  const handleBrushSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setBrushSize(newSize);
  }, []);

  const tools = [
    { icon: <IoIosBrush />, mode: BRUSH_MODE },
    { icon: <LuMousePointer2 />, mode: DRAG_MODE },
    { icon: <FaRegHandPaper />, mode: SELECT_MODE },
    { icon: <FaShapes />, mode: SHAPE_MODE },
    { icon: <LuEraser />, mode: ERASE_MODE },
  ];

  const handleToolClick = (toolMode: number) => {
    setMode(toolMode);
  };

  const handleColorChange = (color: string) => {
    setBrushColor(color);
  };

  const handleShapeChange = (shapeType: number) => {
    setShapeMode(shapeType);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (mode === BRUSH_MODE) {
      setIsDrawing(true);

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const context = canvas.getContext('2d');
      if (!context || mode !== 0) return;

      setLastX(x);
      setLastY(y);

      context.beginPath();
      context.moveTo(x, y);
    }
    else if (mode === DRAG_MODE) {
      // Handle DragMode logic
      console.log("Mouse down in DragMode");

    } else if (mode === SELECT_MODE) {
      // Handle SelectMode logic
      console.log("Mouse down in SelectMode");

    }
    else if (mode === SHAPE_MODE) {
      setIsDrawing(true);
      setStartX(e.clientX - canvas.getBoundingClientRect().left);
      setStartY(e.clientY - canvas.getBoundingClientRect().top);
      const context = canvas.getContext('2d');
      if (context) {
        savedCanvasImageDataRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
      }
    }

  };

  const handleMouseUp = () => {
    if (mode === BRUSH_MODE) {
      setIsDrawing(false);
    }
    else if (mode === SHAPE_MODE) {
      setIsDrawing(false);
      setStartX(null);
      setStartY(null);
      setEndX(null);
      setEndY(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (mode === BRUSH_MODE) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const context = canvas.getContext('2d');
      if (!context || !isDrawing || mode !== BRUSH_MODE) return;

      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.strokeStyle = brushColor;

      if (lastX !== null && lastY !== null) {
        context.beginPath();
        context.moveTo(lastX, lastY); // Move this line here
        context.lineTo(x, y);
        context.stroke();

        setLastX(x);
        setLastY(y);
      }
    }
    else if (mode === SHAPE_MODE) {
      if (!isDrawing) return;
      drawShape(e);
    }
  };

  const drawShape = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const width = mouseX - startX!;
    const height = mouseY - startY!;

    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.beginPath();

    if (savedCanvasImageDataRef.current) {
      context.putImageData(savedCanvasImageDataRef.current, 0, 0);
    }

    if (shapeModeRef.current === RECTANGLE_SHAPE) {
      context.rect(startX!, startY!, width, height);
    } else if (shapeModeRef.current === CIRCLE_SHAPE) {
      const centerX = (mouseX + startX!) / 2;
      const centerY = (mouseY + startY!) / 2;
      context.ellipse(centerX, centerY, Math.abs(mouseX - startX!) / 2, Math.abs(mouseY - startY!) / 2, 0, 0, 2 * Math.PI);
    }
    context.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDrawing, mode, brushColor, lastX, lastY]);


  return (
    <div className="flex w-full lg:p-2">
      <div className="w-8/12" style={{ marginRight: '16px', marginLeft: '40px' }}>
        <div className="flex-none border rounded-lg overflow-hidden" style={{ height: '700px', width: '1000px' }}>
          <div className="w-full h-full bg-gray-200">
            <canvas ref={canvasRef} width={1000} height={700}></canvas>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <Button className="rounded-xl bg-card font-bold">
              <RiAddLine />
            </Button>
            <Button className="rounded-xl bg-card font-bold mx-4">
              100%
            </Button>
            <Button className="rounded-xl bg-card font-bold">
              <RiSubtractLine />
            </Button>
          </div>
          <div>
            <Button className="rounded-xl bg-card font-bold me-4">
              <BsChevronLeft />
            </Button>
            <Button className="rounded-xl bg-card font-bold">
              <BsChevronRight />
            </Button>
          </div>

        </div>
        <div className="flex items-center mt-4 bg-card p-4 rounded-lg">
          {mode === BRUSH_MODE && (
            <div className='flex '>
              <ColorButton color="black" onClick={() => handleColorChange('black')} />
              <ColorButton color="red" onClick={() => handleColorChange('red')} />
              <ColorButton color="green" onClick={() => handleColorChange('green')} />
              <div>
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
            <div className='flex'>
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

      <div className="flex-none w-1/12"></div>

      <div className="flex-none w-2/12 flex flex-col gap-4">
        <div className="flex items-center justify-center rounded-lg bg-card px-4 " style={{ height: '700px', marginRight: '16px' }}>
          <div className="flex flex-col items-center">
            {tools.map((tool) => (
              <Button
                key={tool.mode}
                className={`rounded-xl ${mode !== tool.mode ? 'bg-card' : ''} font-bold mb-4`}
                onClick={() => handleToolClick(tool.mode)}
              >
                {tool.icon}
              </Button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const ShapeButton: React.FC<{ icon: React.ReactNode; onClick: () => void; isActive: boolean }> = ({ icon, onClick, isActive }) => (
  <Button className={`rounded-xl ${isActive ? '' : 'bg-card'}`} onClick={onClick}>
    {icon}
  </Button>
);

const ColorButton: React.FC<{ color: string; onClick: () => void }> = ({ color, onClick }) => (
  <button
    className={`rounded-full w-5 h-5 border border-gray-500 mx-1`}
    style={{ backgroundColor: color }}
    onClick={onClick}
  />
);

export default Canvas;