import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { FaInfoCircle } from "react-icons/fa"
import { IoIosInformationCircleOutline } from "react-icons/io";

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
        <div className="flex gap-3">
          <h2 className=" text-lg font-semibold ">
            {!isHidden ? title : isOpen ? "" : title}
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="">
                <FaInfoCircle fontSize={20} />
              </TooltipTrigger>
              {desc && <TooltipContent>{desc}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>

        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
      {isOpen && <div className={`mt-2 ${childrenStyle}`}>{children}</div>}
    </div>
  )
}

export default CollapsibleSection
