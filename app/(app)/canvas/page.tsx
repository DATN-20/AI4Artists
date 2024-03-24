"use client"

import React from "react"
import { RiAddLine, RiSubtractLine } from "react-icons/ri"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import ToolSelect from "@/components/canvas/ToolSelect"
import OptionSelect from "@/components/canvas/OptionSelect"
import ZoomTool from "@/components/canvas/tools/ZoomTool"
import Canvas from "@/components/canvas/Canvas"
import { CanvasContextProvider } from "@/store/canvasHooks"

const CanvasPage: React.FC = () => {
  return (
    <CanvasContextProvider>
      <div className="flex w-full lg:p-2">
        <div className="ml-40 mr-16 w-10/12">
          <div className="flex items-center justify-center">
            <div className="h-[650px] w-[1000px] overflow-hidden rounded-lg border">
              <div className="h-full w-full bg-gray-200">
                <Canvas></Canvas>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <ZoomTool></ZoomTool>
            <div>
              <Button className="rounded-xl bg-card font-bold">
                <RiAddLine />
              </Button>
              <Button className="mx-4 rounded-xl bg-card font-bold">
                100%
              </Button>
              <Button className="rounded-xl bg-card font-bold">
                <RiSubtractLine />
              </Button>
            </div>
            <div>
              <Button className="me-4 rounded-xl bg-card font-bold">
                <BsChevronLeft />
              </Button>
              <Button className="rounded-xl bg-card font-bold">
                <BsChevronRight />
              </Button>
            </div>
          </div>
          <OptionSelect></OptionSelect>
        </div>

        <div className="flex h-[650px] w-1/12 items-center gap-4">
          <div className="mr-16 flex items-center justify-center rounded-lg bg-card px-4">
            <ToolSelect></ToolSelect>
          </div>
        </div>
      </div>
    </CanvasContextProvider>
  )
}

export default CanvasPage
