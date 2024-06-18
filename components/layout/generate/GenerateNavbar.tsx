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
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
const GenerateNavbar = () => {
  const router = useRouter()
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
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
          <NextImage alt="logo" width={70} height={70} src={logoSrc} />
        </div>
        <div className="flex-grow-0"></div>
      </div>
    </nav>
  )
}

export default GenerateNavbar
