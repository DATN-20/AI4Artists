"use client"

import Loading from "@/components/Loading"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/provider/ThemeProvider"
import { WebSocketProvider } from "../../store/socketContext"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const router = useRouter()

  let token: unknown = null
  useEffect(() => {
    token = localStorage?.getItem("token")
  }, [token])

  useEffect(() => {
    if (!token) {
      router.push("/")
      return
    }
    setIsSuccess(true)
  }, [router])

  if (!isSuccess) {
    return <Loading />
  }

  const userId = "1" // Replace with dynamic user ID

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WebSocketProvider
          userId={userId}
          token={localStorage?.getItem("token")!}
        >
          {children}
        </WebSocketProvider>
      </ThemeProvider>
    </>
  )
}
