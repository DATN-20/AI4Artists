import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import { RiArrowGoBackLine, RiRectangleLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { undo } from "../HistoryUtilities"

export const UndoButton: React.FC = () => {
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
      className={`rounded-xl bg-card py-6 font-bold ${currentHistoryIndex < 0 ? "disabled pointer-events-none opacity-50" : ""}`}
      onClick={() => {
        undo(
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
      <RiArrowGoBackLine size={25} />
    </Button>
  )
}
