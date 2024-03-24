"use client"
import React, { useState, useEffect } from "react"
import { useRegisterUserMutation } from "@/services/auth/authApi"
import { toast } from "react-toastify"
// import { CheckCircleOutlined } from "@ant-design/icons"
import NextImage from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DialogContent } from "../ui/dialog"
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
    <DialogContent
      className="border-none p-0 lg:min-w-[950px]"
      style={{
        borderRadius: 50,
      }}
    >
      <div className="flex h-full w-full">
        <div
          className=" hidden h-full w-1/2 rounded-l-md bg-gradient-to-r from-purple-500 to-indigo-900 lg:block"
          style={{
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
          }}
        >
          <div className="relative flex h-full w-full ">
            <NextImage
              alt="background image"
              src={BgImage}
              className="absolute z-10 h-full w-full"
              style={{
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
              }}
            />
            <div className="relative z-20 flex flex-col items-center justify-center p-[16px] ">
              <NextImage
                alt="logo"
                width={200}
                height={200}
                src="/logo-login.png"
              ></NextImage>
              <div className="mt-5 text-2xl font-bold text-white ">
                <div className="mt-5 flex text-center ">
                  {/* <CheckCircleOutlined />{" "} */}
                  <p className="">Over 50 Free Image Generations Daily</p>
                </div>

                <br />
                <div className="mt-5 flex text-center ">
                  {/* <CheckCircleOutlined />{" "} */}
                  <p className="">Over 50 Free Image Generations Daily</p>
                </div>
                <br />
                <div className="mt-5 flex text-center ">
                  {/* <CheckCircleOutlined />{" "} */}
                  <p className="">Over 50 Free Image Generations Daily</p>
                </div>
                <br />
                <div className="mt-5 flex  text-center">
                  {/* <CheckCircleOutlined />{" "} */}
                  <p className="">Over 50 Free Image Generations Daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-80 pb-5 pt-10">
          <Form {...form}>
            <h1 className="mb-5 text-center text-3xl font-bold">Sign Up</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <a href="#" className="text-primary-blue" onClick={onClose}>
                  Sign in
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </DialogContent>
  )
}

export default ModalRegister
