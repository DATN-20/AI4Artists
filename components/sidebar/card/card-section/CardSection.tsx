import clsx from "clsx"
import React from "react"

const CardSection = ({
  title,
  href,
  icon,
  onClick,
  classNames,
}: {
  title: string
  href: string
  icon: React.ReactElement
  onClick: () => void
  classNames?: string
}) => {
  const iconWithProps = React.cloneElement(icon, {
    size: 20,
  })
  return (
    <div
      onClick={onClick}
      className={classNames}
    >
      <a href={href} className="flex items-center gap-4">
        {iconWithProps}
        <span>{title}</span>
      </a>
    </div>
  )
}

export default CardSection
