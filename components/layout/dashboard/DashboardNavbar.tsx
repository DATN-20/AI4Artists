"use client"
import { AlignJustify } from "lucide-react"
import NextImage from "next/image"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { X } from "lucide-react"
import NavigationSideBarCard from "@/components/sidebar/card/NavigationSideBarCard"
import { useRouter } from "next/navigation"

const DashboardNavbar = () => {
  const router = useRouter()
  return (
    <nav className="block md:hidden">
      <div className="flex w-full items-center justify-between px-6 pt-4">
        <div className="flex-grow-0">
          <Drawer>
            <DrawerTrigger asChild>
              <AlignJustify className="h-8 w-8" />
            </DrawerTrigger>
            <DrawerContent className="w-full">
              <DrawerClose>
                <X className="absolute right-3 top-3" />
              </DrawerClose>
              <div className="w-full bg-card">
                <NavigationSideBarCard />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div
          className="flex flex-grow cursor-pointer justify-center"
          onClick={() => router.push("/dashboard")}
        >
          <NextImage src="/logo.png" alt="logo" width={50} height={50} />
        </div>
        <div className="flex-grow-0"></div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
