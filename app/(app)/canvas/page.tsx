"use client"

import React from "react"
import { RiAddLine, RiSubtractLine } from "react-icons/ri"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import ToolSelect from "@/components/canvas/ToolSelect"
import OptionSelect from "@/components/canvas/OptionSelect"
import Canvas from "@/components/canvas/Canvas"
import { CanvasContextProvider } from "@/store/canvasHooks"

const CanvasPage: React.FC = () => {
  return (
    <CanvasContextProvider>
      <Canvas></Canvas>
      <div className="flex w-full lg:p-2">
        <div className="ml-40 mr-16 w-10/12">
          <div className="flex h-[650px] w-[1000px] items-center justify-center"></div>
          <OptionSelect></OptionSelect>
        </div>

        <div className="z-10 flex h-[650px] w-1/12 items-center gap-4">
          <div className="mr-16 flex items-center justify-center rounded-lg bg-card px-4">
            <ToolSelect></ToolSelect>
          </div>
        </div>
      </div>
    </CanvasContextProvider>
  )
}

export default CanvasPage
