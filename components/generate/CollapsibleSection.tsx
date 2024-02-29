import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="w-full p-4 pb-0">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
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
