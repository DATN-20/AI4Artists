import clsx from "clsx"
import React from "react"

const CardSection = ({
  title,
  href,
  isOpen,
  icon,
}: {
  title: string
  href: string
  isOpen: boolean
  icon: React.ReactElement
}) => {
  const iconWithProps = React.cloneElement(icon, {
    size: 18,
  })
  return (
    <div
      className={clsx("rounded-lg p-2 pl-3 font-semibold ", {
        "bg-[#2C2D31]": isOpen,
        "bg-card": !isOpen,
      })}
    >
      <a href={href} className="flex items-center gap-4">
        {iconWithProps}
        <span>{title}</span>
      </a>
    </div>
  )
}

export default CardSection
