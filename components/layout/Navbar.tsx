"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { Store } from "antd/lib/form/interface";
import { useAuth } from "./AuthProvider";

const NavBar: React.FC = () => {
  const { user, showModal } = useAuth();

  return (
    <header className="w-full  absolute z-10">
      <nav className="mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-black">
        <Link href="/" className="flex justify-center items-center">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </Link>
        <Button
          type="primary" onClick={showModal}
          className="text-primary-blue rounded-full bg-black min-w-[130px] border border-white"
        >
          {user ? `Welcome, ${user}!` : "Sign in"}
        </Button>
      </nav>
    </header>
  );
};
export default NavBar;
