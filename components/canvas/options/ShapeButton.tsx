import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ShapeButton: React.FC<{
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean
  tooltip: string
}> = ({ icon, onClick, isActive, tooltip }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="flex w-full min-w-0 justify-start">
        <div
          className={`mx-1 h-10 rounded-xl px-4 py-2 ${isActive ? "bg-primary" : "bg-card dark:bg-white"} hover:bg-primary`}
          onClick={onClick}
        >
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px] md:max-w-[400px]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default ShapeButton
