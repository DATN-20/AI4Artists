import { AlignJustify } from "lucide-react"
import NextImage from "next/image"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Card } from "@/components/ui/card"
import { Facebook, Instagram, Twitter, X } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { IoPersonCircleSharp } from "react-icons/io5"
import { ThemeToggle } from "@/components/ThemeToggle"
import MainInputCard from "@/components/sidebar/card/MainInputCard"
import OtherInputCard from "@/components/sidebar/card/OtherInputCard"
import CardSection from "@/components/sidebar/card/card-section/CardSection"

const DashboardNavbar = () => {
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
                <MainInputCard />
                <OtherInputCard />
                <Card>
                  <div className="flex flex-col gap-3 px-4 py-3">
                    <CardSection
                      title="Log out"
                      href="#"
                      isOpen={true}
                      icon={<MdLogout />}
                    />
                    <CardSection
                      title="username"
                      href="#"
                      isOpen={false}
                      icon={<IoPersonCircleSharp />}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 ">
                        <Facebook size={24} />
                        <Instagram size={24} />
                        <Twitter size={24} />
                        <FaDiscord size={24} />
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </Card>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex flex-grow justify-center">
          <NextImage src="/logo.png" alt="logo" width={50} height={50} />
        </div>
        <div className="flex-grow-0"></div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
