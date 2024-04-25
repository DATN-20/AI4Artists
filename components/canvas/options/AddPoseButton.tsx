import { Button } from "@/components/ui/button"
import React, { useContext } from "react"
import { CanvasModeContext } from "@/store/canvasHooks"
import { FaPersonCirclePlus } from "react-icons/fa6"
import OpenPose from "../shapeObjects/OpenPose"
import { adjustHistoryToIndex  } from "../HistoryUtilities"
import { HistoryAction } from "@/constants/canvas"

const AddPoseButton: React.FC = () => {
  const poseContext = useContext(CanvasModeContext)
  const {
    canvasRef,
    initialRectPosition,
    _history,
    currentHistoryIndex,
    panOffset,
    setHistory,
    shapeId,
    setShapeId,
    setCurrentHistoryIndex,
    imageFile
  } = poseContext!

  const addNewPose = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    setShapeId(shapeId + 1)
    let newShape = OpenPose(shapeId)
    adjustHistoryToIndex (
      canvas,
      context,
      initialRectPosition,
      _history,
      currentHistoryIndex,
      panOffset,
      true,
      imageFile
    )
    newShape.draw(context, panOffset)
    setCurrentHistoryIndex(currentHistoryIndex + 1)
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
