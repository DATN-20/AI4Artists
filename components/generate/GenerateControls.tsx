import React from "react"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import StyleDrawer from "./StyleDrawer"
import ImageToTag from "./input-component/ImageToTag"

interface GenerateControlsProps {
  handlePosPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleNegPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleGenerate: () => void
  setUseNegativePrompt: React.Dispatch<React.SetStateAction<boolean>>
  useNegativePrompt: boolean
  promptPos: string
}

const GenerateControls: React.FC<GenerateControlsProps> = ({
  handlePosPromptChange,
  handleNegPromptChange,
  handleGenerate,
  setUseNegativePrompt,
  useNegativePrompt,
  promptPos,
}) => {
  return (
    <>
      <div className="flex items-center">
        <textarea
          placeholder="Type prompt here..."
          value={promptPos}
          onChange={handlePosPromptChange}
          className="flex-grow resize-none rounded-2xl bg-[#2c2d31] p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
        />
        <button
          type="button"
          onClick={handleGenerate}
          className="ml-4 hidden items-center justify-center rounded-full bg-gradient-default px-4 py-3 font-bold text-white hover:bg-purple-700 lg:flex"
        >
          <span className="mr-2">✨</span>
          Generate
        </button>
      </div>
      <div className="mt-5 flex items-center space-x-2">
        <Switch
          id="negative-mode"
          className="bg-black"
          onClick={() => setUseNegativePrompt(!useNegativePrompt)}
        />
        <Label htmlFor="negative-mode">Use Negative Prompt</Label>
      </div>
      {useNegativePrompt && (
        <textarea
          placeholder="Type what you don't want to see in a image (a negative prompt)..."
          onChange={handleNegPromptChange}
          className="mt-5 w-full  flex-grow resize-none rounded-2xl bg-[#2c2d31] p-3 text-black placeholder-black outline-none dark:text-white dark:placeholder-white"
        />
      )}
      <button
        type="button"
        onClick={handleGenerate}
        className="mt-4 flex items-center justify-center rounded-full bg-purple-500 px-4 py-3 font-bold text-white hover:bg-purple-700 lg:hidden "
      >
        <span className="mr-2">✨</span>
        Generate
      </button>
      <ImageToTag />
    </>
  )
}

export default GenerateControls
