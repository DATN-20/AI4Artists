"use client"

import Loading from "@/components/Loading"
import { Footer, Navbar } from "@/components/layout"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
export default function RootLayout({
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
    if (token) {
      router.push("/dashboard")
      return
    }
    setIsSuccess(true)
  }, [router])

  if (!isSuccess) {
    return <Loading />
  }
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </div>
      <Footer />
    </>
  )
}
