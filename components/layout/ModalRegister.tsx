"use client"
import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Button, Divider, Row, Col } from "antd"
import { Store } from "antd/lib/form/interface"
import { CheckCircleOutlined } from "@ant-design/icons"
import NextImage from "next/image"
import { useRegisterUserMutation } from "@/services/authApi"
import { toast } from "react-toastify"

interface ModalRegisterProps {
  open: boolean
  onClose: () => void
  setOpenLogin: (open: boolean) => void
}

const ModalRegister: React.FC<ModalRegisterProps> = ({
  open,
  onClose,
  setOpenLogin,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [
    registerUser,
    {
      data: registerData,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterUserMutation()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSignInClick = () => {
    onClose()
    setOpenLogin(true)
  }
  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (values: Store) => {
    setIsSubmitting(true)

    try {
      // Simulate registration API call (replace with your actual API)
      if (values.password === values.confirmPassword) {
        if (values.email && values.password && values.username) {
          await registerUser({
            email: values.email,
            username: values.username,
            password: values.password,
          })
          onClose()
        }
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
    <Modal
      title=""
      open={open}
      onOk={() => {}}
      onCancel={onClose}
      width={1000}
      destroyOnClose
      footer={null}
      className="modal-login"
      centered={true}
    >
      <Row gutter={16}>
        <Col
          span={12}
          className="rounded-l-md bg-gradient-to-r from-fuchsia-900 to-fuchsia-400"
        >
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
              <div className="flex">
                <CheckCircleOutlined />{" "}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>

              <br />
              <div className="flex">
                <CheckCircleOutlined />{" "}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
              <br />
              <div className="flex">
                <CheckCircleOutlined />{" "}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
              <br />
              <div className="flex">
                <CheckCircleOutlined />{" "}
                <p className="ml-5">Over 50 Free Image Generations Daily</p>
              </div>
            </div>
          </div>
        </Col>

        <Col span={8} push={2} className="pt-10">
          <Form onFinish={(values: Store) => handleSubmit(values)} size="large">
            <h1 className="mb-5 text-3xl font-bold">Sign Up</h1>
            <Form.Item
              label="Email"
              name="email"
              tooltip="Example@email.com"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input value={formData.email} onChange={handleChange} />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input value={formData.username} onChange={handleChange} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              tooltip="At least 8 characters"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters!",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error("Passwords do not match!"))
                  },
                }),
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item className="mt-5 ">
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-black"
                loading={isSubmitting}
              >
                Sign Up
              </Button>
            </Form.Item>

            <p className="mb-10 text-center">
              Already have an account?{" "}
              <a
                href="#"
                className="text-primary-blue"
                onClick={handleSignInClick}
              >
                Sign in
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalRegister
