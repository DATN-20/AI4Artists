import Image from "next/image"
import React from "react"
import {
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
  DiscordFilled,
} from "@ant-design/icons"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-[#0e1217] text-white">
      <div className="flex flex-wrap justify-between px-6 py-12 sm:px-12">
        <div className="flex flex-col">
          <div className="mb-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="logo" width={60} height={60} />
              <h2 className="text-2xl font-bold">AI Artist</h2>
            </div>
            <p className="text-lg text-[#E0E0E1]">
              Making stunning AI generated art and manage your own gallery
            </p>
          </div>
          <div className="mt-4 flex ">
            <Link href="#" className="mr-6 text-white hover:text-gray-300">
              <FacebookFilled style={{ fontSize: "36px" }} />
            </Link>
            <Link href="#" className="mr-6 text-white hover:text-gray-300">
              <InstagramFilled style={{ fontSize: "36px" }} />
            </Link>
            <Link href="#" className="mr-6 text-white hover:text-gray-300">
              <TwitterSquareFilled style={{ fontSize: "36px" }} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              <DiscordFilled style={{ fontSize: "36px" }} />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap lg:mt-0">
          <div className="px-4">
            <ul className="grid gap-3">
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
          </div>
          <div className="px-4">
            <ul className="grid gap-3">
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
          </div>
          <div className="px-4">
            <ul className="grid gap-3">
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
      </div>
    </footer>
  )
}

export default Footer
