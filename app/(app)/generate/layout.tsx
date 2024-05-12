"use client"
import GenerateNavbar from "@/components/layout/generate/GenerateNavbar"
import { CanvasContextProvider } from "@/store/canvasHooks"

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CanvasContextProvider>
      <GenerateNavbar />
      {children}
    </CanvasContextProvider>
  )
}
