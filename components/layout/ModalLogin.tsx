"use client"

import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Button, Divider, Row, Col } from "antd"
import { Store } from "antd/lib/form/interface"
import {
  GoogleOutlined,
  FacebookFilled,
  CheckCircleOutlined,
} from "@ant-design/icons"
import NextImage from "next/image"
import { useLoginUserMutation } from "@/services/authApi"
import { toast } from "react-toastify"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/features/authSlice"
import { useNavigate } from "react-router-dom"
import { useRouter } from "next/navigation"

interface ModalLoginProps {
  open: boolean
  onClose: () => void
  setOpenRegister: (open: boolean) => void
}

const ModalLogin: React.FC<ModalLoginProps> = ({
  open,
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
  const handleSignUpClick = () => {
    onClose()
    setOpenRegister(true)
  }
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  const handleSubmit = async (values: Store) => {
    console.log(values)
    const { email, password } = values
    if (email && password) {
      // dispatch(setUser({ token: "loginData.token", name: "loginData.name" }))
      // localStorage.setItem("test", "true")
      // router.push("/dashboard")
      // console.log(localStorage.getItem("test"))
      await loginUser({ email, password })
    } else {
      toast.error("Please fill all Input field")
    }
  }

  useEffect(() => {
    if (isLoginSuccess) {
      toast.success("User login successfully")
      dispatch(
        setUser({ token: loginData.access_token, name: "loginData.name" }),
      )
      router.push("/dashboard")
    }
  }, [isLoginSuccess])

  // useEffect(()=>{
  //   if(isLoginError){
  //     toast.error((loginError as any).data.message);
  //   }
  // }, [isLoginError])

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
          className=" rounded-l-md bg-gradient-to-r from-fuchsia-900 to-fuchsia-400"
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
            <h1 className="mb-5 text-3xl font-bold">Welcome Back</h1>
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
            <Form.Item style={{ marginBottom: 0 }}>
              <a href="#" className="text-primary-blue float-right">
                Forget Password?
              </a>
            </Form.Item>
            <Form.Item className="mt-5 ">
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-black"
              >
                Sign In
              </Button>
            </Form.Item>

            {/* Divider and Social Media Buttons */}
            <Divider plain style={{ borderTopColor: "#cfccd2" }}>
              Or
            </Divider>
            <Button
              block
              icon={<GoogleOutlined />}
              className="mb-5 h-10 w-full bg-red-600 text-white"
            >
              Sign in with Google
            </Button>
            <Button
              block
              icon={<FacebookFilled />}
              className="mb-5 h-10 w-full bg-blue-800 text-white"
            >
              Sign in with Facebook
            </Button>
            <p className="mb-10 text-center">
              Don't you have an account?{" "}
              <a
                href="#"
                className="text-primary-blue"
                onClick={handleSignUpClick}
              >
                Sign up
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalLogin
