import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { FaInfoCircle } from "react-icons/fa"
import { IoIosInformationCircleOutline } from "react-icons/io"

const CollapsibleSection = ({
  title,
  children,
  isHidden = false,
  desc,
  containerStyle,
  childrenStyle,
}: {
  title: string
  children: React.ReactNode
  isHidden?: boolean
  desc?: string
  containerStyle?: string
  childrenStyle?: string
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={`mt-4 px-4 ${containerStyle}`}>
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className=" text-lg font-semibold ">
          {!isHidden ? title : isOpen ? "" : title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className=""
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <FaInfoCircle
                  fontSize={15}
                  className="ml-2 hover:text-primary-700"
                />
              </TooltipTrigger>
              {desc && (
                <TooltipContent className="max-w-[200px]" align="end">
                  {desc}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </h2>
        <div className="flex gap-1">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 hover:text-primary" />
          ) : (
            <ChevronDown className="h-5 w-5 hover:text-primary" />
          )}
        </div>
      </div>
      {isOpen && <div className={`mt-2 ${childrenStyle}`}>{children}</div>}
    </div>
  )
}

export default CollapsibleSection
