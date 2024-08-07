import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, memo } from "react"
import CanvasMode, { CanvasState } from "@/constants/canvas"
import { FaRegHandPaper } from "react-icons/fa"
import { LuMousePointer2, LuEraser } from "react-icons/lu"
import { MdEmojiPeople } from "react-icons/md"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LuShapes, LuBrush } from "react-icons/lu"
import { useTheme } from "next-themes"

export const ToolButtons: React.FC = memo(() => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { mode, setState, setMode, setCursor } = canvasModeContext!
  const { theme } = useTheme()

  const tools = [
    {
      icon: <LuBrush className="dark:text-black" size={25} />,
      mode: CanvasMode.BRUSH_MODE,
      cursor: "handwriting.cur",
      tooltip: "Draw brush",
    },
    {
      icon: <LuMousePointer2 className="dark:text-black" size={25} />,
      mode: CanvasMode.SELECT_MODE,
      cursor: "pointer.cur",
      tooltip: "Select and drag object",
    },
    {
      icon: <FaRegHandPaper className="dark:text-black" size={25} />,
      mode: CanvasMode.DRAG_MODE,
      cursor: theme === "dark" ? "grab_release_white.png" : "grab_release.png",
      tooltip: "Drag canvas",
    },
    {
      icon: <LuShapes className="dark:text-black" size={25} />,
      mode: CanvasMode.SHAPE_MODE,
      cursor: "precision.cur",
      tooltip: "Draw shape",
    },
    {
      icon: <LuEraser className="dark:text-black" size={25} />,
      mode: CanvasMode.ERASE_MODE,
      cursor: theme === "dark" ? "erase_white.cur" : "erase.cur",
      tooltip: "Erase object/image",
    },
    {
      icon: <MdEmojiPeople className="dark:text-black" size={25} />,
      mode: CanvasMode.OPENPOSE_MODE,
      cursor: "precision.cur",
      tooltip: "Add pose",
    },
  ]

  return (
    <div>
      {tools.map((tool) => (
        <TooltipProvider key={tool.mode}>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              <div
                className={`mt-2 rounded-xl from-sky-300 to-primary-700 to-60% hover:bg-gradient-to-br dark:bg-current dark:bg-white ${mode !== tool.mode ? "bg-card dark:bg-white" : "bg-gradient-to-br from-sky-300 to-primary-700 to-60%"} p-3 `}
                onClick={() => {
                  setState(CanvasState.IDLE)
                  setMode(tool.mode)
                  setCursor(tool.cursor)
                }}
              >
                {tool.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-[200px] md:max-w-[400px]"
              side="left"
            >
              {tool.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
})
