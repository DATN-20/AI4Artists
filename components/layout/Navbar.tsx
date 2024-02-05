"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button, Modal, Form, Input, Row, Col } from "antd"
import { Store } from "antd/lib/form/interface"
import { useAuth } from "./AuthProvider"

const NavBar: React.FC = () => {
  const { user, showModal } = useAuth()

  return (
    <header className="sticky z-10 w-full">
      <nav className=" mx-auto flex items-center justify-between bg-[#0e1217] px-6 py-6 sm:px-12">
        <Link href="/" className="flex items-center justify-center gap-4">
          <Image src="/logo.png" alt="logo" width={60} height={60} />
          <h1 className="text-3xl font-bold text-white">AI Artist</h1>
        </Link>
        <button
          type="button"
          onClick={showModal}
          className="flex min-w-[150px] items-center justify-center rounded-full border-[2px] border-white bg-[#0e1217] py-1"
        >
          <h1 className="text-xl font-semibold">
            {user ? `Welcome, ${user}!` : "Sign in"}
          </h1>
        </button>
      </nav>
    </header>
  )
}
export default NavBar
