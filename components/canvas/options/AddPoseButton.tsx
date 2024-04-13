import { Button } from "@/components/ui/button"
import React, { useContext, useEffect } from "react"
import { SketchPicker } from "react-color"
import { CanvasModeContext } from "@/store/canvasHooks"
import { FaPersonCirclePlus } from "react-icons/fa6"
import OpenPose from "../shapeObjects/OpenPose"
import { setPreviousHistory } from "../Canvas"
import { HistoryAction } from "@/constants/canvas"

const AddPoseButton: React.FC = () => {
  const poseContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRect,
    _history,
    currentHistoryIndex,
    panOffset,
    setShapes,
    _shapes,
    setHistory,
  } = poseContext!

  const addNewPose = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let newShape = OpenPose()
    setPreviousHistory(
      canvas,
      context,
      initialRect,
      _history,
      currentHistoryIndex,
      panOffset,
    )
    newShape.draw(context)
    setShapes([..._shapes, newShape])
    setHistory([..._history, { action: HistoryAction.CREATE, value: newShape }])
  }

  return (
    <div className="relative z-10 inline-block">
      <Button className="rounded-xl bg-card" onClick={addNewPose}>
        <FaPersonCirclePlus className="z-10 h-[30px] w-[25px]" />
      </Button>
    </div>
  )
}

export default AddPoseButton
