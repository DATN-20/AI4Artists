"use client"

import React, { useEffect, useState } from "react"
import ToolSelect from "@/components/canvas/ToolSelect"
import OptionSelect from "@/components/canvas/OptionSelect"
import Canvas from "@/components/canvas/Canvas"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

const CanvasPage: React.FC = () => {
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
  return (
    <>
      <div className="absolute left-5 top-5 z-10 rounded-lg border-2 border-black bg-gradient-to-r from-sky-300 to-primary-700 to-60% p-2 dark:border-white">
        <Link
          href="/dashboard"
          className="flex cursor-pointer items-center justify-center gap-4"
        >
          <Image alt="logo" width={50} height={50} src={logoSrc} />
          <h1 className="text-lg font-bold text-black hover:text-white dark:text-white dark:hover:text-black">
            AI4Artist
          </h1>
        </Link>
      </div>
      <Canvas />
      <div className="flex w-screen">
        <OptionSelect />
        <ToolSelect />
      </div>
    </>
  )
}

export default CanvasPage
