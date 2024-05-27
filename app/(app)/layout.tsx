"use client"

import Loading from "@/components/Loading"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/provider/ThemeProvider"
import LogLayout from "../../components/layout/LogLayout"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const router = useRouter()

  // let token: unknown = null
  // useEffect(() => {
  //   token = localStorage?.getItem("user")
  // }, [token])

  // useEffect(() => {
  //   if (!token) {
  //     router.push("/")
  //     return
  //   }
  //   setIsSuccess(true)
  // }, [router])

  // if (!isSuccess) {
  //   return <Loading></Loading>
  // }

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LogLayout>{children}</LogLayout>
      </ThemeProvider>
    </>
  )
}
