"use client"

import NavigationSideBar from "@/components/sidebar/NavigationSideBar"
import DashboardContent from "@/components/dashboard/DashboardContent"
import { selectAuth, logout } from "@/features/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function Dashboard() {
  const router = useRouter()

  // const { name } = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()
  const handleLogout = () => {
    dispatch(logout())
    toast.success("User logout successfully")
    router.push("/")
  }
  return (
    <div className="flex gap-4 py-4">
      <div className="hidden lg:block lg:min-w-[300px]">
        <NavigationSideBar />
      </div>
      <div className="mr-4 h-full flex-1">
        <DashboardContent />
      </div>
    </div>
  )
}
