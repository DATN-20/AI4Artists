"use client"

import { selectAuth, logout } from "@/features/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

// async function fetchData() {
//   // Simulate a delay
//   await new Promise((resolve) => setTimeout(resolve, 3000))

//   const response = await fetch("https://jsonplaceholder.typicode.com/users")
//   const data = await response.json()
//   return data
// }

export default function Dashboard() {
  // const users = await fetchData()
  const router = useRouter()

  // const { name } = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()
  const handleLogout = () => {
    dispatch(logout())
    toast.success("User logout successfully")
    router.push("/")
  }
  return (
    <div>Welcome, Hao</div>
    // <ul>
    //   {users.map((user: any) => (
    //     <li key={user.id}>{user.name}</li>
    //   ))}
    // </ul>
  )
}
