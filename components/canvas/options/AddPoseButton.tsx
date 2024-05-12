import { Button } from "@/components/ui/button"
import React, { useContext } from "react"
import { CanvasModeContext } from "@/store/canvasHooks"
import { FaPersonCirclePlus } from "react-icons/fa6"
import OpenPose from "../shapeObjects/OpenPose"
import { adjustHistoryToIndex } from "../HistoryUtilities"
import { HistoryAction } from "@/constants/canvas"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    imageRef,
  } = poseContext!

  const addNewPose = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    setShapeId(shapeId + 1)
    let newShape = OpenPose(shapeId)
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
    newShape.draw(context, panOffset)
    setCurrentHistoryIndex(currentHistoryIndex + 1)
    setHistory([..._history, { action: HistoryAction.CREATE, value: newShape }])
  }

  return (
    <div className="relative z-10 inline-block">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex w-full min-w-0 justify-start">
            <Button
              className="rounded-xl bg-card dark:bg-white dark:hover:bg-primary"
              onClick={addNewPose}
            >
              <FaPersonCirclePlus className="z-10 h-[30px] w-[25px] text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px] md:max-w-[400px]">
            Add pose
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default AddPoseButton
