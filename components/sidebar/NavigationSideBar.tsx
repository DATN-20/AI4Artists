"use client"
import NavigationCard from "./card/MainInputCard"
import OtherInputCard from "./card/OtherInputCard"
import { Card } from "../ui/card"
import CardSection from "./card/card-section/CardSection"
import { Facebook, Home, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { ThemeToggle } from "../ThemeToggle"
import { IoPersonCircleSharp } from "react-icons/io5"
import { MdLogout } from "react-icons/md"
import { useLogoutUserMutation } from "@/services/auth/authApi"
import { ErrorObject } from "@/types"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { useRouter } from "next/navigation"
import { logout } from "@/features/authSlice"

export default function NavigationSideBar() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    dispatch(logout())
    router.push("/")
    toast.success("Logged out successfully")
  }

  return (
    <div className="no-scrollbar fixed left-0 top-0 flex h-screen min-h-screen w-[300px] flex-col gap-4 overflow-y-scroll p-4 ">
      <NavigationCard />
      <OtherInputCard />
      <Card>
        <div className="flex flex-col gap-3 px-4 py-3">
          <CardSection
            onClick={handleLogout}
            title="Log out"
            href="#"
            isOpen={true}
            icon={<MdLogout />}
          />
          <CardSection
            onClick={() => {}}
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
  )
}
