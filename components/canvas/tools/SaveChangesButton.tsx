import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import { adjustHistoryToIndex } from "../HistoryUtilities"
import { MdSaveAlt } from "react-icons/md"
import { Button } from "../../ui/button"

export const SaveChangesButton = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    imageRef,
    setImageFile,
    scale,
    currentShape,
    setCurrentShape
  } = canvasModeContext!

  return (
    <Button
      className="w-full py-4 text-lg font-semibold"
      onClick={() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        if (currentShape !== null) {   
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

        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = initialRectPosition.w
        tempCanvas.height = initialRectPosition.h

        const tempContext = tempCanvas.getContext("2d")
        if (!tempContext) return

        tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
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
        var blobBin = atob(dataUrl.split(",")[1])
        var array = []
        for (var i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i))
        }
        var blob = new Blob([new Uint8Array(array)], { type: "image/png" })
        setImageFile(new File([blob], "image.png", { type: "image/png" }))
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
        setOpen(!open)
      }}
    >
      Submit
    </Button>
  )
}
