"use client"

import Loading from "@/components/Loading"
import { selectAuth } from "@/features/authSlice"
import { StoreProvider } from "@/store/StoreProvider"
import { useAppSelector } from "@/store/hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { token } = useAppSelector(selectAuth)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    if (!token) {
      router.push("/")
      return
    }
    setIsSuccess(true)
  }, [router])

  if (!isSuccess) {
    return <Loading></Loading>
  }

  return <div className="flex min-h-screen flex-col">{children}</div>
}
