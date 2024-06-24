"use client"

import React, { useEffect, useState } from "react"
import NextImage from "next/image"
import { useLoginUserMutation } from "@/services/auth/authApi"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/features/authSlice"
import { DialogContentLoginModal } from "../ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { ErrorObject } from "@/types"
import BgImage from "../../public/bg-left.png"
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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import { X } from "lucide-react"
import { useGetProfileQuery } from "@/services/profile/profileApi"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { LoginModalPage, ModalProps } from "@/constants/loginModal"
import { useTheme } from "next-themes"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const ModalLogin: React.FC<ModalProps> = ({ onClose }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )

  const [
    loginUser,
    {
      data: loginData,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
      isLoading,
    },
  ] = useLoginUserMutation()

  const { data: userData, refetch } = useGetProfileQuery(
    isLoginSuccess ? undefined : skipToken,
  )

  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values
    setIsButtonDisabled(true)

    if (email && password) {
      const response = await loginUser({ email, password })

      if ((response as ErrorObject).error) {
        toast.error((response as ErrorObject).error.data.message)
      }
    } else {
      toast.error("Please fill all Input field")
    }
    setTimeout(() => {
      setIsButtonDisabled(false)
    }, 1500)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      await refetch()
    }
    const handleLoginSuccess = () => {
      toast.success("User login successfully")
      dispatch(setUser({ token: loginData.access_token, name: "Hao" }))
      fetchUserData()
      const promptValue = localStorage.getItem("prompt")
      setTimeout(() => {
        if (promptValue) {
          router.push("/generate")
        } else {
          router.push("/dashboard")
        }
      }, 1000)
    }

    if (isLoginSuccess) {
      handleLoginSuccess()
    }
  }, [isLoginSuccess])

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userID", (userData?.id).toString())
      localStorage.setItem("userData", JSON.stringify(userData))
    }
  }, [userData])

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
                <NextImage alt="logo" width={180} height={180} src={logoSrc} />
                <span className="bg-gradient-default bg-clip-text text-5xl font-black text-transparent">
                  AI4Artist
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

        <div className="dark:background-white mx-auto flex w-full flex-col justify-center px-8 py-5 lg:w-1/2">
          <Form {...form}>
            <h1 className="my-5 text-center text-3xl font-bold">Login</h1>
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
                        type="email"
                        placeholder="Email"
                        {...field}
                        className="w-full border-slate-400 focus:border-transparent focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
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
                          className="w-full border-slate-400 focus:border-transparent focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <a
                  href="#"
                  className="float-right hover:text-primary-700"
                  onClick={() => onClose(LoginModalPage.FORGOT_PASSWORD_PAGE)}
                >
                  Forgot Password?
                </a>
              </div>
              <Button
                type="submit"
                className="h-10 w-full bg-black text-white"
                disabled={isLoading || isButtonDisabled}
              >
                Sign In
              </Button>

              <div className="mb-10 text-center">
                Don't you have an account?{" "}
                <a
                  href="#"
                  className="text-secondary hover:text-primary-700"
                  onClick={() => onClose(LoginModalPage.REGISTER_PAGE)}
                >
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DialogContentLoginModal>
  )
}

export default ModalLogin
