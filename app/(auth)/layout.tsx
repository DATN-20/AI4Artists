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
