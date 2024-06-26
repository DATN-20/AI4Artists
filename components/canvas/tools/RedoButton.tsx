import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import { RiArrowGoForwardLine } from "react-icons/ri"
import { redo } from "../HistoryUtilities"

export const RedoButton: React.FC = memo(() => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    imageRef,
  } = canvasModeContext!

  return (
    <div
      className={`my-1 rounded-xl bg-card p-3 font-bold dark:bg-white dark:text-black hover:bg-gradient-to-br from-sky-300 to-primary-700 to-60% ${currentHistoryIndex >= _history.length - 1 ? "disabled pointer-events-none opacity-50" : ""}`}
      onClick={() => {
        redo(
          canvasRef.current!,
          canvasRef.current!.getContext("2d")!,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          setCurrentHistoryIndex,
          panOffset,
          imageRef.current!,
        )
      }}
    >
      <RiArrowGoForwardLine size={25} />
    </div>
  )
})
