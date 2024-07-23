"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"

import Link from "next/link"
import { useTheme } from "next-themes"

const Footer = () => {
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
  return (
    <footer className="bg-[#0e1217] text-white">
      <div className="flex flex-wrap justify-between px-6 py-12 sm:px-12">
        <div className="flex flex-col">
          <div className="mb-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image alt="logo" width={80} height={80} src={logoSrc} />
              <h2 className="text-2xl font-bold">AI4Artist</h2>
            </div>
            <p className="text-lg text-[#E0E0E1]">
              Making stunning AI generated art and manage your own gallery
            </p>
          </div>
          <div className="mt-4 flex ">
            <Link href="#" className="mr-6 text-white hover:text-gray-300">
              <Facebook color="white" size={36} />
            </Link>
            <Link href="#" className="mr-6 text-white hover:text-gray-300">
              <Instagram color="white" size={36} />
            </Link>
            <Link href="#" className="mr-6 text-white hover:text-gray-300">
              <Twitter color="white" size={36} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              <FaDiscord color="white" size={36} />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row lg:mt-0">
          <ul className="grid gap-3 px-0 md:px-4">
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Image
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Blogs
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Community
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Tools
              </a>
            </li>
          </ul>
          <ul className="flex flex-col gap-3 px-0 md:px-4">
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Docs
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Open Source
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Contact us
              </a>
            </li>
          </ul>
          <ul className="flex flex-col gap-3 px-0 md:px-4">
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Legal
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-300 ">
                Terms & Condition
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
