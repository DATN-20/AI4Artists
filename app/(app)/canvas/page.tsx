"use client"

import React from "react"
import ToolSelect from "@/components/canvas/ToolSelect"
import OptionSelect from "@/components/canvas/OptionSelect"
import Canvas from "@/components/canvas/Canvas"
import Image from "next/image"
import Link from "next/link"

const CanvasPage: React.FC = () => {
  return (
    <>
      <div className="absolute left-5 top-5 z-10 rounded-lg border-2 border-black bg-gradient-to-r from-sky-300 to-primary-700 to-60% p-2 dark:border-white">
        <Link
          href="/dashboard"
          className="flex cursor-pointer items-center justify-center gap-4"
        >
          <Image src="/logo.png" alt="logo" width={30} height={30} />
          <h1 className="text-lg font-bold text-black hover:text-white dark:text-white dark:hover:text-black">
            AIArtist
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
