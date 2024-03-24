import CanvasMode, { ShapeModeOptions } from "@/constants/canvas"
import {
  useState,
  useRef,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react"

type CanvasModeContextType = {
  mode: CanvasMode
  setMode: Dispatch<SetStateAction<CanvasMode>>
  color: string
  setColor: Dispatch<SetStateAction<string>>
  showColorPicker: boolean
  setShowColorPicker: Dispatch<SetStateAction<boolean>>
  brushSettings: {
    size: number
    showSlider: boolean
  }
  setBrushSettings: Dispatch<
    SetStateAction<{ size: number; showSlider: boolean }>
  >
  shapeMode: ShapeModeOptions
  setShapeMode: Dispatch<SetStateAction<ShapeModeOptions>>
  shapeModeRef: React.MutableRefObject<ShapeModeOptions>
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  savedCanvasImageDataRef: React.MutableRefObject<ImageData | null>
  isDrawing: boolean
  setIsDrawing: Dispatch<SetStateAction<boolean>>
  shapeCoordinates: {
    startX: number
    startY: number
    endX: number
    endY: number
  }
  updateShapeCoordinates: (
    newCoordinates: Partial<{
      startX: number
      startY: number
      endX: number
      endY: number
    }>,
  ) => void
  isCropping: boolean
  setIsCropping: Dispatch<SetStateAction<boolean>>
  magnifierZoom: number
  setMagnifierZoom: Dispatch<SetStateAction<number>>
  isZooming: boolean
  setIsZooming: Dispatch<SetStateAction<boolean>>
}

export const CanvasModeContext = createContext<
  CanvasModeContextType | undefined
>(undefined)

export const CanvasContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState(CanvasMode.DRAG_MODE)
  const [color, setColor] = useState("black")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [brushSettings, setBrushSettings] = useState({
    size: 5,
    showSlider: false,
  })
  const [shapeMode, setShapeMode] = useState<ShapeModeOptions>(
    ShapeModeOptions.RECTANGLE_SHAPE,
  )
  const shapeModeRef = useRef<ShapeModeOptions>(shapeMode)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const savedCanvasImageDataRef = useRef<ImageData | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [shapeCoordinates, setShapeCoordinates] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  })
  const [isCropping, setIsCropping] = useState(false)
  const [magnifierZoom, setMagnifierZoom] = useState(1)
  const [isZooming, setIsZooming] = useState(false)

  const updateShapeCoordinates = (
    newCoordinates: Partial<typeof shapeCoordinates>,
  ) => {
    setShapeCoordinates((prevCoordinates) => ({
      ...prevCoordinates,
      ...newCoordinates,
    }))
  }

  const contextValue: CanvasModeContextType = {
    mode,
    setMode,
    color,
    setColor,
    showColorPicker,
    setShowColorPicker,
    brushSettings,
    setBrushSettings,
    shapeMode,
    setShapeMode,
    shapeModeRef,
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
    setIsZooming,
  }

  return (
    <CanvasModeContext.Provider value={contextValue}>
      {children}
    </CanvasModeContext.Provider>
  )
}
