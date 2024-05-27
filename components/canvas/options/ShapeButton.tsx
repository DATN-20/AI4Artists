import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ShapeButton : React.FC<{
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean,
  tooltip: string
}> = ({ icon, onClick, isActive, tooltip }) => (
  
  <TooltipProvider>
  <Tooltip>
    <TooltipTrigger className="flex w-full min-w-0 justify-start">
    <Button
    className={`mx-1 rounded-xl ${isActive ? "dark:bg-primary" : "bg-card dark:bg-white"} dark:hover:bg-primary`}
    onClick={onClick}
  >
    {icon}
  </Button>
    </TooltipTrigger>
    <TooltipContent className="max-w-[200px] md:max-w-[400px]">
      {tooltip}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
)

export default ShapeButton
