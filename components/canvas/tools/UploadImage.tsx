import { Button } from "@/components/ui/button"
import { CanvasModeContext } from "@/store/canvasHooks"
import React, { ChangeEvent, useContext, useRef } from "react"
import { RiImageAddFill } from "react-icons/ri"
import { adjustHistoryToIndex } from "../HistoryUtilities"

export const UploadButton: React.FC = () => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    setImageFile
  } = canvasModeContext!
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        setImageFile(file)
        context.clearRect(0, 0, canvas.width, canvas.height)
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          file,
        )
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="z-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button
        className="rounded-xl bg-card py-6 font-bold"
        onClick={() => fileInputRef.current?.click()}
      >
        <RiImageAddFill size={25} />
      </Button>
    </div>
  )
}
