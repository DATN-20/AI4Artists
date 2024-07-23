"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ModalLogin, ModalRegister } from "@/components/layout"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { LoginModalPage } from "@/constants/loginModal"
import ModalForgotPassword from "./ModalForgotPassword"
import { useTheme } from "next-themes"
const NavBar: React.FC = () => {
  const [modalPage, setModalPage] = useState<LoginModalPage>(
    LoginModalPage.LOGIN_PAGE,
  )

  const toggleModal = (page: LoginModalPage) => {
    setModalPage(page)
  }
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
  return (
    <header className="sticky z-10 w-full">
      <nav className=" mx-auto flex items-center justify-between bg-[#0e1217] px-4 py-4 md:px-6 md:py-6">
        <Dialog>
          <Link
            href="/"
            className="flex cursor-pointer items-center justify-center gap-4"
          >
            <Image alt="logo" width={80} height={80} src={logoSrc} />
            <h1 className="text-3xl font-bold text-white">AI4Artist</h1>
          </Link>
          <div className="flex">
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex min-w-[150px] items-center justify-center rounded-full border-[2px] border-white py-1 text-xl font-semibold text-white hover:border-primary-700 hover:text-primary-700"
              >
                Sign in
              </button>
            </DialogTrigger>
          </div>

          {modalPage === LoginModalPage.LOGIN_PAGE && (
            <ModalLogin onClose={toggleModal} />
          )}
          {modalPage === LoginModalPage.REGISTER_PAGE && (
            <ModalRegister onClose={toggleModal} />
          )}
          {modalPage === LoginModalPage.FORGOT_PASSWORD_PAGE && (
            <ModalForgotPassword onClose={toggleModal} />
          )}
        </Dialog>
      </nav>
    </header>
  )
}
export default NavBar
