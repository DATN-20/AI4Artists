"use client"

import { Button, ConfigProvider, theme } from "antd"
import { useState } from "react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const { defaultAlgorithm, darkAlgorithm } = theme
  // const [isDarkMode, setIsDarkMode] = useState(false)
  // const handleClick = () => {
  //   setIsDarkMode((previousValue) => {
  //     if (!previousValue) {
  //       document.documentElement.classList.add("dark")
  //     } else {
  //       document.documentElement.classList.remove("dark")
  //     }

  //     return !previousValue
  //   })
  // }
  return (
    <>
      {/* <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <Button onClick={handleClick}>
          Change Theme to {isDarkMode ? "Light" : "Dark"}
        </Button>
        {children}
      </ConfigProvider> */}
      {children}
    </>
  )
}
