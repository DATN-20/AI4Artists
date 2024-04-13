import CanvasMode, { CanvasState, ShapeModeOptions } from "@/constants/canvas"
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
  prevMode: CanvasMode
  setPrevMode: Dispatch<SetStateAction<CanvasMode>>
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
  initialRect: {
    x: number
    y: number
    w: number
    h: number
  }
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
  magnifierZoom: number
  setMagnifierZoom: Dispatch<SetStateAction<number>>
  _shapes: any[]
  setShapes: Dispatch<SetStateAction<any[]>>
  currentShape: any
  setCurrentShape: Dispatch<SetStateAction<any>>
}

export const CanvasModeContext = createContext<
  CanvasModeContextType | undefined
>(undefined)

export const CanvasContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState(CanvasMode.SELECT_MODE)
  const [prevMode, setPrevMode] = useState(CanvasMode.SELECT_MODE)
  const [color, setColor] = useState("black")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [brushSettings, setBrushSettings] = useState({
    size: 5,
    showSlider: false,
  })
  const [shapeMode, setShapeMode] = useState<ShapeModeOptions>(
    ShapeModeOptions.RECTANGLE_SHAPE,
  )
  const [state, setState] = useState<CanvasState>(CanvasState.IDLE)
  const shapeModeRef = useRef<ShapeModeOptions>(shapeMode)
  const [_shapes, setShapes] = useState<any[]>([])
  const [currentShape, setCurrentShape] = useState<any>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [_history, setHistory] = useState<any[]>([])
  const [initialRect, setInitialRect] = useState({
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
  const [magnifierZoom, setMagnifierZoom] = useState(1)

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
    _history,
    setHistory,
    shapeCoordinates,
    updateShapeCoordinates,
    magnifierZoom,
    setMagnifierZoom,
    _shapes,
    setShapes,
    currentShape,
    setCurrentShape,
    state,
    setState,
    initialRect,
    prevMode,
    setPrevMode,
    panOffset,
    setPanOffset,
    startPanMousePosition,
    setStartPanMousePosition,
    currentHistoryIndex,
    setCurrentHistoryIndex,
  }

  return (
    <CanvasModeContext.Provider value={contextValue}>
      {children}
    </CanvasModeContext.Provider>
  )
}
