import { UploadButton } from "./tools/UploadImage"
import { UndoButton } from "./tools/UndoButton"
import { RedoButton } from "./tools/RedoButton"
import { SaveImageButton } from "./tools/SaveImageButton"
import { ZoomButton } from "./tools/ZoomButton"
import { ToolButtons } from "./tools/ToolButtons"

const ToolSelect = () => {
  return (
    <div className="py-4 flex flex-col items-center dark:bg-white">
      <ToolButtons/>
      <UndoButton/>
      <RedoButton/>
      <ZoomButton/>
      <UploadButton/>
      <SaveImageButton/>
    </div>
  )
}

export default ToolSelect
