import CanvasMode, { CanvasState, EraseModeOptions, ShapeModeOptions } from "@/constants/canvas"
import {
  useState,
  useRef,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react"

export type CanvasModeContextType = {
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
  state: CanvasState
  setState: Dispatch<SetStateAction<CanvasState>>
  shapeModeRef: React.MutableRefObject<ShapeModeOptions>
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  _history: any[]
  setHistory: Dispatch<SetStateAction<any[]>>
  initialRectPosition: {
    x: number
    y: number
    w: number
    h: number
  }
  updateInitialRectPosition: (
    newCoordinates: Partial<{
      x: number
      y: number
      w: number
      h: number
    }>,
  ) => void
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
  panOffset: { x: number; y: number }
  setPanOffset: Dispatch<SetStateAction<{ x: number; y: number }>>
  startPanMousePosition: { x: number; y: number }
  setStartPanMousePosition: Dispatch<SetStateAction<{ x: number; y: number }>>
  currentHistoryIndex: number
  setCurrentHistoryIndex: Dispatch<SetStateAction<number>>
  shapeId: number
  setShapeId: Dispatch<SetStateAction<number>>
  currentShape: any
  setCurrentShape: Dispatch<SetStateAction<any>>
  scale: number
  setScale: Dispatch<SetStateAction<number>>
  scaleOffset: { x: number; y: number }
  setScaleOffset: Dispatch<SetStateAction<{ x: number; y: number }>>
  imageRef: React.MutableRefObject<HTMLImageElement | null>
  eraseSize: number
  setEraseSize: Dispatch<SetStateAction<number>>
  eraseMode: EraseModeOptions
  setEraseMode: Dispatch<SetStateAction<EraseModeOptions>>
  cursor: string
  setCursor: Dispatch<SetStateAction<string>>
}

export const CanvasModeContext = createContext<
  CanvasModeContextType | undefined
>(undefined)

export const CanvasContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState(CanvasMode.SELECT_MODE)
  const [color, setColor] = useState("black")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [brushSettings, setBrushSettings] = useState({
    size: 5,
    showSlider: false,
  })
  const [eraseSize, setEraseSize] = useState(1)
  const [shapeMode, setShapeMode] = useState<ShapeModeOptions>(
    ShapeModeOptions.RECTANGLE_SHAPE,
  )
  const [eraseMode, setEraseMode] = useState<EraseModeOptions>(
    EraseModeOptions.ERASE,
  )
  const [cursor, setCursor] = useState<string>('crosshair');
  const [state, setState] = useState<CanvasState>(CanvasState.IDLE)
  const shapeModeRef = useRef<ShapeModeOptions>(shapeMode)
  const [shapeId, setShapeId] = useState<number>(0)
  const [currentShape, setCurrentShape] = useState<any>(null)
  const imageRef = useRef(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [_history, setHistory] = useState<any[]>([])
  const [initialRectPosition, setInitialRect] = useState({
    x: 200,
    y: 50,
    w: 1000,
    h: 600,
  })
  const [shapeCoordinates, setShapeCoordinates] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  })
  const [scale, setScale] = useState(1)
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 })

  const updateShapeCoordinates = (
    newCoordinates: Partial<typeof shapeCoordinates>,
  ) => {
    setShapeCoordinates((prevCoordinates) => ({
      ...prevCoordinates,
      ...newCoordinates,
    }))
  }

  const updateInitialRectPosition = (
    newCoordinates: Partial<typeof initialRectPosition>,
  ) => {
    setInitialRect((prevCoordinates) => ({
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
    _history,
    setHistory,
    shapeCoordinates,
    updateShapeCoordinates,
    shapeId,
    setShapeId,
    currentShape,
    setCurrentShape,
    state,
    setState,
    initialRectPosition,
    panOffset,
    setPanOffset,
    startPanMousePosition,
    setStartPanMousePosition,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    scale,
    setScale,
    scaleOffset,
    setScaleOffset,
    imageRef,
    updateInitialRectPosition,
    eraseSize,
    setEraseSize,
    eraseMode,
    setEraseMode,
    cursor,
    setCursor,
  }

  return (
    <CanvasModeContext.Provider value={contextValue}>
      {children}
    </CanvasModeContext.Provider>
  )
}
