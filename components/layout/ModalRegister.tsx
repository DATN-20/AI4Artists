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

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
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
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Simulate registration API call (replace with your actual API)
      if (values.email && values.password && values.username) {
        await registerUser({
          email: values.email,
          username: values.username,
          password: values.password,
        })
        onClose()
      } else {
        toast.error("Password do not match")
      }
    } catch (error) {
      console.error("Registration error:", error)
      // Handle errors gracefully, e.g., display appropriate error message
    } finally {
      setIsSubmitting(false)
    }
  }

  // useEffect(() => {
  //   if (isRegisterError) {
  //     toast.error((registerError as any).data.message)
  //   }
  // }, [isRegisterError])

  return (
    <DialogContent className="min-w-[950px] p-0">
      <div className="flex ">
        <div className=" mr-10 rounded-l-md bg-gradient-to-r from-fuchsia-900 to-fuchsia-400">
          <div
            className="flex flex-col items-center"
            style={{ padding: "30px" }}
          >
            <NextImage
              alt="logo"
              width={200}
              height={200}
              src="/logo-login.png"
            ></NextImage>
            <div className="mt-5 text-2xl font-bold text-white ">
              <div className="mt-5 flex ">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>

              <br />
              <div className="mt-5 flex ">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
              <br />
              <div className="mt-5 flex ">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
              <br />
              <div className="mt-5 flex ">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 pt-10">
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
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full"
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
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
                        {...field}
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="h-10 w-full bg-black">
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
