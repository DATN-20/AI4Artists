import clsx from "clsx"

const CardSection = ({
  title,
  href,
  isOpen,
}: {
  title: string
  href: string
  isOpen: boolean
}) => {
  return (
    <div
      className={clsx("rounded-lg p-1 pl-2 font-semibold text-white", {
        "bg-card-foreground": isOpen,
        "bg-black": !isOpen,
      })}
    >
      <a href={href}>{title}</a>
    </div>
  )
}

export default CardSection
