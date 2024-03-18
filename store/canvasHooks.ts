import CanvasMode, { ShapeModeOptions } from '@/constants/canvas';
import { useState, useRef } from 'react';

export const useCanvasState = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const savedCanvasImageDataRef = useRef<ImageData | null>(null);
    const [mode, setMode] = useState<CanvasMode>(CanvasMode.DRAG_MODE);
    const [shapeCoordinates, setShapeCoordinates] = useState({
      startX: 0,
      startY: 0,
      endX: 0,  
      endY: 0,
    });

    const [magnifierZoom, setMagnifierZoom] = useState<number>(1);
    const [isZooming, setIsZooming] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [isCropping, setIsCropping] = useState<boolean>(false);

    const updateShapeCoordinates = (
        newCoordinates: Partial<typeof shapeCoordinates>,
      ) => {
        setShapeCoordinates((prevCoordinates) => ({
          ...prevCoordinates,
          ...newCoordinates,
        }))
      }
  
    return {
        canvasRef,
        savedCanvasImageDataRef,
        isDrawing,
        setIsDrawing,
        mode,
        setMode,
        shapeCoordinates,
        updateShapeCoordinates,
        isCropping,
        setIsCropping,
        magnifierZoom,
        setMagnifierZoom,
        isZooming,
        setIsZooming
    };
};

export const useColorState = () => {
    const [color, setColor] = useState("black");
    const [showColorPicker, setShowColorPicker] = useState(false);

    return {
        color,
        setColor,
        showColorPicker,
        setShowColorPicker,
        };
};

export const useBrushSizeState = () => {
    const [brushSettings, setBrushSettings] = useState({
        size: 5,
        showSlider: false
      })

    return {
        brushSettings,
        setBrushSettings,
    };
};

export const useShapeState = () => {
    const [shapeMode, setShapeMode] = useState<ShapeModeOptions>(
        ShapeModeOptions.RECTANGLE_SHAPE,
      );
      const shapeModeRef = useRef<number>(shapeMode);

        return {
            shapeMode,
            setShapeMode,
            shapeModeRef
        };
};