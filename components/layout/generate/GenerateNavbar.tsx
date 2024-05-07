"use client"
import NextImage from "next/image"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AlignJustify, X } from "lucide-react"
import GenerateSideBar from "../../sidebar/GenerateSideBar"
import { useRouter } from "next/navigation"

const GenerateNavbar = () => {
  const router = useRouter()
  return (
    <nav className="block md:hidden">
      <div className="flex w-full items-center justify-between px-6 pt-4">
        <div className="flex-grow-0">
          <Drawer>
            <DrawerTrigger asChild>
              <AlignJustify className="h-8 w-8" />
            </DrawerTrigger>
            <DrawerContent className="w-full border-none bg-card">
              <div className="w-full">
                <DrawerClose>
                  <X className="absolute right-3 top-3" />
                </DrawerClose>
                <GenerateSideBar />
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

export default GenerateNavbar
