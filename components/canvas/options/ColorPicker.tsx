import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { SketchPicker } from "react-color"
import { useColorState } from "@/store/canvasHooks"

const ColorPicker = () => {
  const { color, setColor, showColorPicker, setShowColorPicker } =
    useColorState()
  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  const handlePickerClose = () => {
    setShowColorPicker(false)
  }

  return (
    <div className="relative inline-block">
      <div className="flex flex-col-reverse">
        <Button className="rounded-xl bg-card">
          <div
            className="h-[25px]  w-[25px] rounded-lg"
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></div>
        </Button>

        <div className="absolute left-0 top-0 z-10 mt-[-310px] rounded">
          {showColorPicker && (
            <div onBlur={handlePickerClose} tabIndex={0}>
              <SketchPicker
                color={color}
                onChange={(color) => handleColorChange(color.hex)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ColorPicker
