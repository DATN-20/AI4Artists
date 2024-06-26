import { Button } from "@/components/ui/button"
import { CanvasModeContext } from "@/store/canvasHooks"
import React, { ChangeEvent, useContext, useRef, memo } from "react"
import { RiImageAddFill } from "react-icons/ri"
import { adjustHistoryToIndex } from "../HistoryUtilities"


export const UploadButton: React.FC = memo(() => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    panOffset,
    currentHistoryIndex,
    imageRef,
    updateInitialRectPosition
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

      const image = new Image()
      image.src = reader.result as string
      imageRef.current = image
      image.onload = () => {
        updateInitialRectPosition({
          w: (600 * image.width) / image.height,
          h: 600,
        })
        adjustHistoryToIndex(
          canvas,
          context,
          initialRectPosition,
          _history,
          currentHistoryIndex,
          panOffset,
          true,
          image
        )
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="z-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className="my-1 p-3 rounded-xl bg-card font-bold dark:bg-white dark:text-black hover:bg-gradient-to-br from-sky-300 to-primary-700 to-60%"
        onClick={() => fileInputRef.current?.click()}
      >
        <RiImageAddFill size={25} />
      </div>
    </div>
  )
})
