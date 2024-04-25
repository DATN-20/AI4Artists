import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import { RiArrowGoForwardLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { redo } from "../HistoryUtilities"

export const RedoButton: React.FC = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    imageFile,
  } = canvasModeContext!

  return (
    <Button
      className={`rounded-xl bg-card py-6 font-bold ${currentHistoryIndex >= _history.length - 1 ? "disabled pointer-events-none opacity-50" : ""}`}
      onClick={() => {
        redo(
          canvasRef.current!,
          canvasRef.current!.getContext("2d")!,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          setCurrentHistoryIndex,
          panOffset,
          imageFile,
        )
      }}
    >
      <RiArrowGoForwardLine size={25} />
    </Button>
  )
}
