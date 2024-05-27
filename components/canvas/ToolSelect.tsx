import { UploadButton } from "./tools/UploadImage"
import { UndoButton } from "./tools/UndoButton"
import { RedoButton } from "./tools/RedoButton"
import { SaveImageButton } from "./tools/SaveImageButton"
import { ZoomButton } from "./tools/ZoomButton"
import { ToolButtons } from "./tools/ToolButtons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { adjustHistoryToIndex, handleMouseUpCanvas } from "./HistoryUtilities"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"

const ToolSelect = () => {
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

  const tools = [
    {
      key: "undo",
      button: <UndoButton />,
      tooltip: "Undo",
    },
    {
      key: "redo",
      button: <RedoButton />,
      tooltip: "Redo",
    },
    {
      key: "zoom",
      button: <ZoomButton />,
      tooltip: "Zoom",
    },
    {
      key: "upload",
      button: <UploadButton />,
      tooltip: "Upload",
    },
    {
      key: "save",
      button: <SaveImageButton />,
      tooltip: "Save",
    },
  ]

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
  
  const handleClick = () => {
    if (currentShape !== null) {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext("2d")
      if (!context) return

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
      currentShape.draw(context, panOffset)
      setCurrentShape(null)
    }
  }

  return (
    <div
      className="flex flex-col items-center py-4 dark:bg-white"
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      <ToolButtons />
      {tools.map((tool) => (
        <TooltipProvider key={tool.key}>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              {tool.button}
            </TooltipTrigger>
            <TooltipContent
              className="max-w-[200px] md:max-w-[400px]"
              side="left"
            >
              {tool.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

export default ToolSelect
