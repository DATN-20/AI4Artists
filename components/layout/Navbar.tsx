"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ModalLogin, ModalRegister } from "@/components/layout"
import { useAppSelector } from "@/store/hooks"
import { selectAuth } from "@/features/authSlice"
import { Dialog, DialogTrigger } from "../ui/dialog"
const NavBar: React.FC = () => {
  const [openLogin, setOpenLogin] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const { name } = useAppSelector(selectAuth)
  return (
    <header className="sticky z-10 w-full">
      <nav className=" mx-auto flex items-center justify-between bg-[#0e1217] px-6 py-6 sm:px-12">
        <Dialog>
          <Link href="/" className="flex items-center justify-center gap-4">
            <Image src="/logo.png" alt="logo" width={60} height={60} />
            <h1 className="text-3xl font-bold text-white">AI Artist</h1>
          </Link>
          <div className="flex">
            <DialogTrigger asChild>
              <button
                type="button"
                className="mr-10 flex min-w-[150px] items-center justify-center rounded-full border-[2px] border-white bg-white py-1"
              >
                <h1 className="text-xl font-semibold">Sign in </h1>
              </button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mr-10 flex min-w-[150px] items-center justify-center rounded-full border-[2px] border-white bg-white py-1"
              >
                <h1 className="text-xl font-semibold">Sign up </h1>
              </button>
            </DialogTrigger>
          </div>

          <ModalLogin
            open={openLogin}
            setOpenRegister={setOpenRegister}
            onClose={() => setOpenLogin(false)}
          />
          <ModalRegister
            open={openRegister}
            setOpenLogin={setOpenLogin}
            onClose={() => setOpenRegister(false)}
          />
        </Dialog>
      </nav>
    </header>
  )
}
export default NavBar
