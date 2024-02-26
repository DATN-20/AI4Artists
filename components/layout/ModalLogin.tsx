"use client"

import React, { useEffect, useState } from "react"

// import {
//   GoogleOutlined,
//   FacebookFilled,
//   CheckCircleOutlined,
// } from "@ant-design/icons"
import NextImage from "next/image"
import { useLoginUserMutation } from "@/services/authApi"
import { toast } from "react-toastify"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/features/authSlice"
import { Dialog, DialogContent } from "../ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface ModalLoginProps {
  open: boolean
  onClose: () => void
  setOpenRegister: (open: boolean) => void
}

const ModalLogin: React.FC<ModalLoginProps> = ({
  onClose,
  setOpenRegister,
}) => {
  const dispatch = useAppDispatch()
  const [
    loginUser,
    {
      data: loginData,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginUserMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignUpClick = () => {
    onClose()
    setOpenRegister(true)
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (formData.email && formData.password) {
      await loginUser({ email: formData.email, password: formData.password })
    } else {
      toast.error("Please fill all Input field")
    }
  }

  // useEffect(() => {
  //   if (isLoginSuccess) {
  //     toast.success("User login successfully")
  //     dispatch(setUser({ token: loginData.token, name: loginData.name }))
  //   }
  // }, [isLoginSuccess])

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
              <div className="mt-5 flex">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>

              <br />
              <div className="mt-5 flex">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
              <br />
              <div className="mt-5 flex">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
              <br />
              <div className="mt-5 flex">
                {/* <CheckCircleOutlined />{" "} */}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 pt-5">
          <Form {...form}>
            <h1 className="mb-5 text-center text-3xl font-bold">
              Welcome Back
            </h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <a href="#" className="text-primary-blue float-right">
                Forget Password?
              </a>
              <Button type="submit" className="h-10 w-full bg-black">
                Sign In
              </Button>

              {/* Divider and Social Media Buttons */}
              <Separator style={{ borderTopColor: "#cfccd2" }}></Separator>
              <Button
                // icon={<GoogleOutlined />}
                className="h-10 w-full bg-red-600 text-white"
              >
                Sign in with Google
              </Button>
              <Button
                // icon={<FacebookFilled />}
                className="h-10 w-full bg-blue-800 text-white"
              >
                Sign in with Facebook
              </Button>
              <div className="mb-10 text-center">
                Don't you have an account?{" "}
                <a
                  href="#"
                  className="text-primary-blue"
                  onClick={handleSignUpClick}
                >
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DialogContent>
  )
}

export default ModalLogin
