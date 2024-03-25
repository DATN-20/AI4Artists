import clsx from "clsx"
import React from "react"

const CardSection = ({
  title,
  href,
  isOpen,
  icon,
  onClick,
}: {
  title: string
  href: string
  isOpen: boolean
  icon: React.ReactElement
  onClick: () => void
}) => {
  const iconWithProps = React.cloneElement(icon, {
    size: 20,
  })
  return (
    <div
      onClick={onClick}
      className={clsx("rounded-lg p-2 pl-3 font-semibold ", {
        "bg-card-highlight": isOpen,
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
