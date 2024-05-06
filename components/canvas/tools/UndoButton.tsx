import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import { RiArrowGoBackLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { undo } from "../HistoryUtilities"
import { useTheme } from "next-themes"

export const UndoButton: React.FC = memo(() => {
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
  const { resolvedTheme } = useTheme()

  return (
    <Button
      className={`my-1 rounded-xl bg-card font-bold dark:bg-white dark:text-black dark:hover:bg-primary ${currentHistoryIndex < 0 ? "disabled pointer-events-none opacity-50" : ""}`}
      onClick={() => {
        undo(
          canvasRef.current!,
          canvasRef.current!.getContext("2d")!,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          setCurrentHistoryIndex,
          panOffset,
          imageRef.current!,
          resolvedTheme,
        )
      }}
    >
      <RiArrowGoBackLine size={25} />
    </Button>
  )
})
