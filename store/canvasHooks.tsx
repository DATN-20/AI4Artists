import CanvasMode, { ShapeModeOptions } from '@/constants/canvas';
import { useState, useRef, createContext, useContext, ReactNode } from 'react';

export const useCanvasState = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const savedCanvasImageDataRef = useRef<ImageData | null>(null);
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

type CanvasModeContextType = {
  mode: CanvasMode;
  setMode: React.Dispatch<React.SetStateAction<CanvasMode>>;
};

export const CanvasModeContext = createContext<CanvasModeContextType | undefined>(undefined);

export const CanvasModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState(CanvasMode.DRAG_MODE);

  return (
    <CanvasModeContext.Provider value={{ mode, setMode }}>
      {children}
    </CanvasModeContext.Provider>
  );
};

type ColorStateContextType = {
  color: string;
  setColor: (color: string) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
};

export const ColorStateContext = createContext<ColorStateContextType | undefined>(undefined);

export const ColorStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [color, setColor] = useState("black");
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <ColorStateContext.Provider value={{ color, setColor, showColorPicker, setShowColorPicker }}>
      {children}
    </ColorStateContext.Provider>
  );
};

type BrushSizeStateContextType = {
  brushSettings: {
    size: number;
    showSlider: boolean;
  };
  setBrushSettings: React.Dispatch<React.SetStateAction<{
    size: number;
    showSlider: boolean;
  }>>;
};

export const BrushSizeStateContext = createContext<BrushSizeStateContextType | undefined>(undefined);

export const BrushSizeStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brushSettings, setBrushSettings] = useState({
    size: 5,
    showSlider: false
  });

  return (
    <BrushSizeStateContext.Provider value={{ brushSettings, setBrushSettings }}>
      {children}
    </BrushSizeStateContext.Provider>
  );
};

type ShapeStateContextType = {
  shapeMode: ShapeModeOptions;
  setShapeMode: React.Dispatch<React.SetStateAction<ShapeModeOptions>>;
  shapeModeRef: React.MutableRefObject<ShapeModeOptions>;
};

export const ShapeStateContext = createContext<ShapeStateContextType | undefined>(undefined);

export const ShapeStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shapeMode, setShapeMode] = useState<ShapeModeOptions>(ShapeModeOptions.RECTANGLE_SHAPE);
  const shapeModeRef = useRef<ShapeModeOptions>(shapeMode);

  return (
    <ShapeStateContext.Provider value={{ shapeMode, setShapeMode, shapeModeRef }}>
      {children}
    </ShapeStateContext.Provider>
  );
};