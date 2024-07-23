import CanvasMode, { CanvasState, HistoryAction } from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import ColorPicker from "./options/ColorPicker"
import BrushSizeInput from "./options/BrushSizeInput"
import ShapeButtons from "./options/ShapeButtons"
import { useContext } from "react"
import AddPoseButton from "./options/AddPoseButton"
import { RemoveButton } from "./options/RemoveButton"
import {
  adjustHistoryToIndex,
  handleMouseUpCanvas,
  setNewHistory,
} from "./HistoryUtilities"
import { useTheme } from "next-themes"

const OptionSelect = () => {
  const { theme } = useTheme()
  const canvasModeContext = useContext(CanvasModeContext)
  const {
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
    state,
    setState,
    setCursor,
    imageRef,
    canvasRef,
  } = canvasModeContext!
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
      theme
    )

  return (
    <div className="absolute bottom-5 left-1/4 z-10 w-1/2" onMouseUp={handleMouseUp}>
      {mode === CanvasMode.BRUSH_MODE && (
        <div className="z-10 mt-4 rounded-lg bg-gradient-to-r from-sky-300 to-primary-700 to-60% p-[0.15rem] ">
          <div className="flex items-center rounded-lg bg-card p-3 dark:bg-white">
            <div className="flex ">
              <ColorPicker />
              <BrushSizeInput />
            </div>
          </div>
        </div>
      )}

      {mode === CanvasMode.SHAPE_MODE && (
        <div className="z-10 mt-4 rounded-lg bg-gradient-to-r from-sky-300 to-primary-700 to-60% p-[0.15rem] ">
          <div className="flex items-center rounded-lg bg-card p-4 dark:bg-white">
            <ColorPicker />
            <BrushSizeInput />
            <ShapeButtons />
          </div>
        </div>
      )}

      {mode === CanvasMode.ERASE_MODE && (
        <div className="z-10 mt-4 rounded-lg bg-gradient-to-r from-sky-300 to-primary-700 to-60% p-[0.15rem] ">
          <div className="flex items-center rounded-lg bg-card p-4 dark:bg-white">
            <RemoveButton />
          </div>
        </div>
      )}

      {mode === CanvasMode.OPENPOSE_MODE && (
        <div className="z-10 mt-4 rounded-lg bg-gradient-to-r from-sky-300 to-primary-700 to-60% p-[0.15rem] ">
          <div className="flex items-center rounded-lg bg-card p-4 dark:bg-white">
            <AddPoseButton />
          </div>
        </div>
      )}
    </div>
  )
}

export default OptionSelect
