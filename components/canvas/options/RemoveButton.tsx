import { EraseModeOptions, HistoryAction } from "@/constants/canvas"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext } from "react"
import { adjustHistoryToIndex, setNewHistory } from "../HistoryUtilities"
import ShapeButton from "./ShapeButton"
import { FcRemoveImage } from "react-icons/fc"
import { IoRemoveOutline } from "react-icons/io5"
import { MdOutlinePlaylistRemove } from "react-icons/md"
import { init } from "next/dist/compiled/webpack/webpack"

export const RemoveButton: React.FC = () => {
  const eraseContext = useContext(CanvasModeContext)
  const {
    eraseMode,
    setEraseMode,
    initialRectPosition,
    canvasRef,
    imageRef,
    _history,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    setHistory,
    panOffset
  } = eraseContext!

  const handleEraseChange = (eraseType: number) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!context || !canvas) return
    setEraseMode(eraseType)
    if (eraseType === EraseModeOptions.ERASE) return
    else if (eraseType === EraseModeOptions.ERASE_IMAGE) {
      imageRef.current = null
      adjustHistoryToIndex(
        canvas,
        context,
        initialRectPosition,
        _history,
        currentHistoryIndex,
        panOffset,
        true,
        null,
      )
    } else {
      setNewHistory(
        currentHistoryIndex,
        setCurrentHistoryIndex,
        _history,
        setHistory,
        "all",
        HistoryAction.DELETE,
      )
    }
  }

  return (
    <div className="z-10 flex">
      <ShapeButton
        icon={<IoRemoveOutline className="text-black" size={25} />}
        onClick={() => handleEraseChange(EraseModeOptions.ERASE)}
        isActive={eraseMode === EraseModeOptions.ERASE}
        tooltip="Remove 1 object"
      />

      <ShapeButton
        icon={<MdOutlinePlaylistRemove className="text-black" size={25} />}
        onClick={() => handleEraseChange(EraseModeOptions.ERASE_ALL)}
        isActive={eraseMode === EraseModeOptions.ERASE_ALL}
        tooltip="Remove all objects"
      />

      <ShapeButton
        icon={<FcRemoveImage className="text-black" size={25} />}
        onClick={() => handleEraseChange(EraseModeOptions.ERASE_IMAGE)}
        isActive={eraseMode === EraseModeOptions.ERASE_IMAGE}
        tooltip="Remove image"
      />
    </div>
  )
}
