"use client"

import { useResetPasswordUserMutation } from "@/services/auth/authApi"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ErrorObject } from "@/types"
import { toast } from "react-toastify"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const passwordSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function ModalResetPassword() {
  const [
    resetPassword
  ] = useResetPasswordUserMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const form = useForm<z.infer<typeof passwordSchema>>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true)
    const { newPassword, confirmPassword } = data
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      const urlToken = window.location.search.split("=")[1]
      const response = await resetPassword({
        password: data.newPassword,
        token: urlToken,
      })
      if ((response as ErrorObject).error.data.message) {
        toast.error((response as ErrorObject).error.data.message)
      }
      else {
        toast.success("Password reset successfully")
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      }
    } else {
      if (newPassword !== confirmPassword) {
        toast.error("Confirm password don't match")
      } else {
        toast.error("Please fill in all fields")
      }
    }
    setIsSubmitting(false)
  }

  return (
    <div className="mx-auto w-full px-8 py-5 md:w-1/2">
      <Form {...form}>
        <h1 className="my-5 text-center text-3xl font-bold">Reset Password</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Password"
                    {...field}
                    type="password"
                    className="w-full border-slate-400 focus:border-transparent focus:ring-0"
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
                    type="password"
                    {...field}
                    className="w-full border-slate-400 focus:border-transparent focus:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-10 w-full bg-black text-white" disabled={isSubmitting}>
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  )
}
