import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { adjustHistoryToIndex} from "../HistoryUtilities"
import { MdSaveAlt } from "react-icons/md"

export const SaveImageButton: React.FC = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    imageFile,
  } = canvasModeContext!

  return (
    <Button
        className="rounded-xl bg-card py-6 font-bold"
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
          context.clearRect(0, 0, canvas.width, canvas.height)
          adjustHistoryToIndex(
            canvas,
            context,
            initialRectPosition,
            _history,
            currentHistoryIndex,
            panOffset,
            false,
          )
          tempContext.drawImage(
            canvas,
            initialRectPosition.x + panOffset.x,
            initialRectPosition.y + panOffset.y,
            initialRectPosition.w,
            initialRectPosition.h,
            0,
            0,
            initialRectPosition.w,
            initialRectPosition.h,
          )

          const dataUrl = tempCanvas.toDataURL("image/png")
          const fileName = "image.png"
          const a = document.createElement("a")
          a.href = dataUrl
          a.download = fileName
          a.click()
          context.clearRect(0, 0, canvas.width, canvas.height)
          adjustHistoryToIndex(
            canvas,
            context,
            initialRectPosition,
            _history,
            currentHistoryIndex,
            panOffset,
            true,
            imageFile,
          )
        }}
      >
        <MdSaveAlt size={25} />
      </Button>
  )
}
