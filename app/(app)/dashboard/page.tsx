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
    <div className="flex gap-4 p-4 lg:grid lg:grid-cols-10">
      <div className="hidden lg:col-span-2 lg:block">
        <NavigationSideBar />
      </div>
      <div className="h-full w-full lg:col-span-8 lg:ml-4">
        <DashboardContent />
      </div>
    </div>
  )
}
