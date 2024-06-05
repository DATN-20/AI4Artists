"use client"
import GenerateNavbar from "@/components/layout/generate/GenerateNavbar"
import { CanvasContextProvider } from "@/store/canvasHooks"
import { TagsContextProvider } from "@/store/tagsHooks"

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CanvasContextProvider>
        <TagsContextProvider>
          <GenerateNavbar />
          {children}
        </TagsContextProvider>
      </CanvasContextProvider>
    </>
  )
}
