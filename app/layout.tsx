import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import { StoreProvider } from "@/store/StoreProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "AI4Artist",
  description: "An AI-powered platform for artists to generate art",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={poppins.className}>
          <Suspense fallback={<Loading />}>
            <ToastContainer position="bottom-right" />
            {children}
          </Suspense>
        </body>
      </html>
    </StoreProvider>
  )
}
