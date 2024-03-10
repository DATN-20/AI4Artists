import { AlignJustify } from "lucide-react"
import NextImage from "next/image"

const DashboardNavbar = () => {
  return (
    <nav className="block md:hidden">
      <div className="flex w-full items-center justify-between px-6 pt-4">
        <div className="flex-grow-0">
          <AlignJustify className="h-8 w-8" />
        </div>
        <div className="flex flex-grow justify-center">
          <NextImage src="/logo.png" alt="logo" width={50} height={50} />
        </div>
        <div className="flex-grow-0">
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
