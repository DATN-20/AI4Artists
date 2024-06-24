"use client"

import Loading from "@/components/Loading"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/provider/ThemeProvider"
import { WebSocketProvider } from "../../store/socketContext"
import LogLayout from "../../components/layout/LogLayout"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const router = useRouter()
  function getCookie(name: string) {
    var nameEQ = name + "="
    var ca = document.cookie.split(";")
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }
  let token: unknown = null
  useEffect(() => {
    token = getCookie("token")
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

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WebSocketProvider
          userId={getCookie("userID")!}
          token={getCookie("token")!}
        >
          <LogLayout>{children}</LogLayout>
        </WebSocketProvider>
      </ThemeProvider>
    </>
  )
}
