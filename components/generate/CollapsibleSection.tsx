import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

const CollapsibleSection = ({
  title,
  children,
  isHidden = false,
  desc,
}: {
  title: string
  children: React.ReactNode
  isHidden?: boolean
  desc?: string
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="w-full p-4 pb-0">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex w-full min-w-0 justify-start">
              <h2 className="text-lg font-semibold">
                {!isHidden ? title : isOpen ? "" : title}
              </h2>
            </TooltipTrigger>
            {desc && (
              <TooltipContent className="max-w-[200px] md:max-w-[400px]">
                {desc}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  )
}

export default CollapsibleSection
