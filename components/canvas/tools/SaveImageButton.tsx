import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import { adjustHistoryToIndex } from "../HistoryUtilities"
import { MdSaveAlt } from "react-icons/md"

export const SaveImageButton: React.FC = memo(() => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    imageRef,
    scale
  } = canvasModeContext!

  return (
    <div
      className="my-1 rounded-xl bg-card p-3 font-bold dark:bg-white dark:text-black dark:hover:bg-primary"
      onClick={() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = initialRectPosition.w
        tempCanvas.height = initialRectPosition.h

        const tempContext = tempCanvas.getContext("2d")
        if (!tempContext) return
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          false,
          imageRef.current!,
        )
        tempContext.drawImage(
          canvas,
          (initialRectPosition.x + panOffset.x) * scale,
          (initialRectPosition.y + panOffset.y) * scale,
          initialRectPosition.w * scale,
          initialRectPosition.h * scale,
          0,
          0,
          initialRectPosition.w * scale,
          initialRectPosition.h * scale,
        )

        const dataUrl = tempCanvas.toDataURL("image/png")
        const fileName = "image.png"
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = fileName
        a.click()
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
      }}
    >
      <MdSaveAlt size={25} />
    </div>
  )
})
