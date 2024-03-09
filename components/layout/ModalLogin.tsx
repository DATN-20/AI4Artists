"use client"

import React, { useEffect, useState } from "react"

// import {
//   GoogleOutlined,
//   FacebookFilled,
//   CheckCircleOutlined,
// } from "@ant-design/icons"
import NextImage from "next/image"
import { useLoginUserMutation } from "@/services/auth/authApi"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/features/authSlice"
import { Dialog, DialogContent } from "../ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import { ErrorObject } from "@/types"
import BgImage from "../../public/bg-image.png"
import "react-toastify/dist/ReactToastify.css"
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
import { FaFacebook, FaGoogle } from "react-icons/fa"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface ModalLoginProps {
  onClose: () => void
}

const ModalLogin: React.FC<ModalLoginProps> = ({ onClose }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

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
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values

    if (email && password) {
      const response = await loginUser({ email, password })

      if ((response as ErrorObject).error) {
        toast.error((response as ErrorObject).error.data.message)
      }
    } else {
      toast.error("Please fill all Input field")
    }
  }

  useEffect(() => {
    if (isLoginSuccess) {
      toast.success("User login successfully")
      dispatch(setUser({ token: loginData.access_token, name: "Hao" }))
      router.push("/dashboard")
    }
  }, [isLoginSuccess])

  return (
    <DialogContent className="min-w-[950px] p-0" style={{ borderRadius: 50 }}>
      <div className="flex ">
        <div
          className=" mr-10 rounded-l-md bg-gradient-to-r from-purple-500 to-indigo-900"
          style={{
            padding: "30px",
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
          }}
        >
          <NextImage
            alt="background image"
            src={BgImage}
            className="absolute left-0 top-0 h-screen"
            width={523}
            style={{
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
            }}
          />
          <div className="relative z-10 flex flex-col items-center">
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

        <div className="w-80 pb-5 pt-5">
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
              <a href="#" className="text-primary-blue float-right">
                Forgot Password?
              </a>
              <Button type="submit" className="h-10 w-full bg-black text-white">
                Sign In
              </Button>
              {/* Divider and Social Media Buttons */}
              <div className="flex items-center justify-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <div className="px-3">Or</div>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>{" "}
              <Button
                // icon={<GoogleOutlined />}
                className="h-10 w-full bg-red-600 text-white "
              >
                <FaGoogle className="mr-3" />
                Sign in with Google
              </Button>
              <Button
                // icon={<FacebookFilled />}
                className="h-10 w-full bg-blue-800 text-white"
              >
                <FaFacebook className="mr-3" />
                Sign in with Facebook
              </Button>
              <div className="mb-10 text-center">
                Don't you have an account?{" "}
                <a href="#" className="text-primary-blue" onClick={onClose}>
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
