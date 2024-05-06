"use client"

import { CanvasContextProvider } from "@/store/canvasHooks"

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CanvasContextProvider>{children}</CanvasContextProvider>
}
