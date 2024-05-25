"use client"

import React from "react"
import ToolSelect from "@/components/canvas/ToolSelect"
import OptionSelect from "@/components/canvas/OptionSelect"
import Canvas from "@/components/canvas/Canvas"
import { Button } from "@/components/ui/button"

const CanvasPage: React.FC = () => {
  return (
    <>
      <Canvas />
      <div className="flex w-screen lg:p-2">
        <div className="ml-40 mr-16 w-9/12">
          <div className="flex h-[650px] w-[1000px] items-center justify-center"></div>
          <OptionSelect />
        </div>

        <div className="z-10 flex h-screen w-1/12 flex-col items-center justify-center">
          <div className="mr-16 flex items-center justify-center rounded-lg bg-card px-4 dark:bg-white">
            <ToolSelect />
          </div>
          <Button className="mr-16 mt-5">Generate image</Button>
        </div>
      </div>
    </>
  )
}

export default CanvasPage
