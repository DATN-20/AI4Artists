"use client"

import LeftSideBar from "@/components/sidebar/NavigationSideBar"
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
    <div className="grid grid-cols-8 gap-4 p-4">
      <div className="col-span-2">
        <LeftSideBar />
      </div>
      <div className="col-span-6 ml-4 h-full w-full">
        <DashboardContent />
      </div>
    </div>
  )
}
