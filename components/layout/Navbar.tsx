"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ModalLogin, ModalRegister } from "@/components/layout"
import { Dialog, DialogTrigger } from "../ui/dialog"
const NavBar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(true)

  const toggleModal = () => {
    setShowLoginModal(!showLoginModal)
  }
  return (
    <header className="sticky z-10 w-full">
      <nav className=" mx-auto flex items-center justify-between bg-[#0e1217] px-4 py-4 md:px-6 md:py-6">
        <Dialog>
          <Link href="/" className="flex items-center justify-center gap-4">
            <Image src="/logo.png" alt="logo" width={60} height={60} />
            <h1 className="text-3xl font-bold text-white">AI Artist</h1>
          </Link>
          <div className="flex">
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex min-w-[150px] items-center justify-center rounded-full border-[2px] border-white py-1"
              >
                <h1 className="text-xl font-semibold text-white">Sign in </h1>
              </button>
            </DialogTrigger>
          </div>

          {showLoginModal ? (
            <ModalLogin onClose={toggleModal} />
          ) : (
            <ModalRegister onClose={toggleModal} />
          )}
        </Dialog>
      </nav>
    </header>
  )
}
export default NavBar
