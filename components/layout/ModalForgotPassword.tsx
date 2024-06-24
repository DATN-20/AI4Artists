"use client"
import React, { useState, useEffect } from "react"
import {
  useForgetPasswordUserMutation,
  useRegisterUserMutation,
} from "@/services/auth/authApi"
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
import { LoginModalPage, ModalProps } from "@/constants/loginModal"
import { useTheme } from "next-themes"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
})

const ModalForgotPassword: React.FC<ModalProps> = ({ onClose }) => {
  const [
    forgetPassword,
    {
      data: forgetPassData,
      isSuccess: isForgetPassSuccess,
      isError: isForgetPassError,
      error: forgetPassError,
    },
  ] = useForgetPasswordUserMutation()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
  })

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values
    if (email) {
      setIsSubmitting(true)
      const response = await forgetPassword({
        email: email,
      })
      if ((response as ErrorObject).error.data.message) {
        toast.error((response as ErrorObject).error.data.message)
      } else {
        toast.success((response as ErrorObject).error.data.toString())
      }
      setIsSubmitting(false)
    } else {
      toast.error("Please fill in your email!")
    }
  }

  useEffect(() => {
    if (isForgetPassSuccess) {
      toast.success(forgetPassData?.toString())
      onClose(LoginModalPage.LOGIN_PAGE)
    }
  }, [isForgetPassSuccess])

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

                <span className="select-none bg-gradient-default bg-clip-text text-5xl font-black text-transparent">
                  AI4Artist
                </span>
              </div>

              <div className="ml-5 mr-5 mt-5 flex  h-full flex-col gap-8 text-2xl font-bold text-white">
                <p className="flex select-none">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>20 Free Image Generation daily</p>
                </p>
                <p className="flex select-none">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>Generate Image in your own Style</p>
                </p>
                <p className="flex select-none">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>Generate Image with pose, depth, sketch,…</p>
                </p>
                <p className="mb-10 flex select-none">
                  <p className="mr-5 flex	items-center">✨</p>{" "}
                  <p>Manage your own profile space</p>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full px-8 py-5 md:w-1/2">
          <Form {...form}>
            <h1 className="my-5 text-center text-3xl font-bold">
              Forgot Your Password
            </h1>
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
                        className="w-full border-slate-400 focus:border-transparent focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-10 w-full bg-black text-white dark:bg-white dark:text-black dark:hover:text-primary-700 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Reset Password"}
              </Button>

              <p className="mb-10 text-center">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-secondary hover:text-primary-700"
                  onClick={() => onClose(LoginModalPage.LOGIN_PAGE)}
                >
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

export default ModalForgotPassword
