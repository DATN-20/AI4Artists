"use client"
import React, { useState, useEffect } from "react"
import { useRegisterUserMutation } from "@/services/auth/authApi"
import { toast } from "react-toastify"
// import { CheckCircleOutlined } from "@ant-design/icons"
import NextImage from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DialogContent, DialogContentLoginModal } from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import BgImage from "../../public/bg-left.png"
import { ErrorObject } from "@/types"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  firstName: z.string().min(1, {
    message: "First Name must be at least 1 characters.",
  }),
  lastName: z.string().min(1, {
    message: "Last Name must be at least 1 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface ModalRegisterProps {
  onClose: () => void
}

const ModalRegister: React.FC<ModalRegisterProps> = ({ onClose }) => {
  const [
    registerUser,
    {
      data: registerData,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterUserMutation()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  })

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    const { email, firstName, lastName, password } = values
    // Simulate registration API call (replace with your actual API)
    if (email && password && firstName && lastName) {
      const response = await registerUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      })
      if ((response as ErrorObject).error) {
        toast.error((response as ErrorObject).error.data.message)
      }
    } else {
      toast.error("Please fill all fields!")
    }
  }

  useEffect(() => {
    if (isRegisterSuccess) {
      toast.success(registerData)
      onClose()
    }
  }, [isRegisterSuccess])

  // useEffect(() => {
  //   if (isRegisterError) {
  //     toast.error((registerError as any).data.message)
  //   }
  // }, [isRegisterError])

  return (
    <DialogContentLoginModal
      className="border-none p-0 lg:min-w-[1020px] "
      style={{ borderRadius: 50 }}
    >
      <div className="flex h-full w-full">
        <div className=" hidden h-full w-1/2 rounded-l-md rounded-bl-[50px] rounded-tl-[50px] bg-gradient-to-r from-purple-500 to-indigo-900 lg:block">
          <div className="relative flex h-full w-full ">
            <NextImage
              alt="background image"
              src={BgImage}
              className="border-tl-[30px] border-bl-[30px] absolute z-10 h-full w-full"
            />
            <div className="z-20 mt-6 flex h-full w-full flex-col items-center">
              <div className="my-6 flex flex-col items-center gap-4">
                <NextImage
                  alt="logo"
                  width={120}
                  height={120}
                  src="/logo.png"
                />
                <span className="bg-gradient-default bg-clip-text text-5xl font-black text-transparent">
                  AI Artist
                </span>
              </div>

              <div className="ml-5 mr-5 mt-5 flex  h-full flex-col gap-8 text-2xl font-bold text-white">
                <p className="flex">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>20 Free Image Generation daily</p>
                </p>
                <p className="flex">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>Generate Image in your own Style</p>
                </p>
                <p className="flex">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>Generate Image with pose, depth, sketch,…</p>
                </p>
                <p className="mb-10 flex">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>Manage your own profile space</p>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full px-8 py-5 md:w-1/2">
          <Form {...form}>
            <h1 className="my-5 text-center text-3xl font-bold">Sign Up</h1>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        type="email"
                        className="w-full border-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
                        className="w-full border-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        {...field}
                        className="w-full border-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                        className="w-full border-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="h-10 w-full bg-black text-white">
                Sign Up
              </Button>

              <p className="mb-10 text-center">
                Already have an account?{" "}
                <a href="#" className="text-secondary" onClick={onClose}>
                  Sign in
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </DialogContentLoginModal>
  )
}

export default ModalRegister
