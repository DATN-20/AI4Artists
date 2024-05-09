import { EraseModeOptions, HistoryAction } from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import {
  setNewHistory,
} from "../HistoryUtilities"
import ShapeButton from "./ShapeButton"
import { FcRemoveImage } from "react-icons/fc"
import { IoRemoveOutline } from "react-icons/io5"
import { MdOutlinePlaylistRemove } from "react-icons/md"

export const RemoveButton: React.FC = () => {
  const eraseContext = useContext(CanvasModeContext)
  const {
    eraseMode,
    setEraseMode,
    canvasRef,
    imageRef,
    initialRectPosition,
    panOffset,
    _history,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    setHistory,
  } = eraseContext!

  const handleEraseChange = (eraseType: number) => {
    setEraseMode(eraseType)
    if (eraseType === EraseModeOptions.ERASE) return
    if (eraseType === EraseModeOptions.ERASE_ALL_IMAGE) {
      imageRef.current = null
    }
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!context || !canvas) return
    setNewHistory(
      currentHistoryIndex,
      setCurrentHistoryIndex,
      _history,
      setHistory,
      "all",
      HistoryAction.DELETE,
    )
  }

  return (
    <div className="z-10 flex">
      <ShapeButton
        icon={<IoRemoveOutline className="text-black" size={25} />}
        onClick={() => handleEraseChange(EraseModeOptions.ERASE)}
        isActive={eraseMode === EraseModeOptions.ERASE}
      />

      <ShapeButton
        icon={<MdOutlinePlaylistRemove className="text-black" size={25} />}
        onClick={() => handleEraseChange(EraseModeOptions.ERASE_ALL)}
        isActive={eraseMode === EraseModeOptions.ERASE_ALL}
      />

      <ShapeButton
        icon={<FcRemoveImage className="text-black" size={25} />}
        onClick={() => handleEraseChange(EraseModeOptions.ERASE_ALL_IMAGE)}
        isActive={eraseMode === EraseModeOptions.ERASE_ALL_IMAGE}
      />
    </div>
  )
}
