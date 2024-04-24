"use client"

import React, { use, useContext, useEffect } from "react"
import ToolSelect from "@/components/canvas/ToolSelect"
import OptionSelect from "@/components/canvas/OptionSelect"
import Canvas from "@/components/canvas/Canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import { adjustHistoryToIndex } from "@/components/canvas/HistoryUtilities"

async function getImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = (error) => {
      reject(error)
    }
    img.src = url
  })
}

async function urlToBlob(url: string) {
  const response = await fetch(url)
  const blob = await response.blob()
  const dimensions = await getImageDimensions(url)
  const file = new File([blob], "image.jpg", { type: "image/jpeg" })
  return { file, dimensions }
}

const CanvasPage: React.FC<{ params: { imageUrl: string } }> = ({ params }) => {
  const canvasModeContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    _history,
    panOffset,
    currentHistoryIndex,
    setImageFile,
    updateInitialRectPosition,
  } = canvasModeContext!

  useEffect(() => {
    const imageUrl = `https://res.cloudinary.com/dw8lzl4fm/image/upload/${params.imageUrl[0]}/${params.imageUrl[1]}.png`
    async function getImageFile() {
      const { file, dimensions } = await urlToBlob(imageUrl)
      let newWidth = (600 * dimensions.width) / dimensions.height
      let newHeight = 600
      updateInitialRectPosition({
        x: 200,
        y: 50,
        w: newWidth,
        h: newHeight,
      })
      setImageFile(file)
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext("2d")
      if (!context) return
      adjustHistoryToIndex(
        canvas,
        context,
        {
          x: 200,
          y: 50,
          w: newWidth,
          h: newHeight,
        },
        _history,
        currentHistoryIndex,
        panOffset,
        true,
        file,
      )
    }
    getImageFile()
  }, [])
  return (
    <>
      <Canvas />
      <div className="flex w-full lg:p-2">
        <div className="ml-40 mr-16 w-10/12">
          <div className="flex h-[650px] w-[1000px] items-center justify-center"></div>
          <OptionSelect />
        </div>

        <div className="z-10 flex h-[650px] w-1/12 items-center gap-4">
          <div className="mr-16 flex items-center justify-center rounded-lg bg-card px-4">
            <ToolSelect />
          </div>
        </div>
      </div>
    </>
  )
}

export default CanvasPage
