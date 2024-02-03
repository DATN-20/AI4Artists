"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Button, Modal, Form, Input, Row, Col, Divider } from "antd";
import { Store } from "antd/lib/form/interface";
import { GoogleOutlined, FacebookFilled } from '@ant-design/icons';

interface AuthContextProps {
  user: string | null;
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  showModal: () => void;
  hideModal: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const signIn = (username: string, password: string) => {
   
    if (username === "example" && password === "password") {
      setUser(username);
      setModalVisible(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, showModal, hideModal }}>
      {children}
      <Modal
  title=""
  open={modalVisible}
  onOk={() => {}}
  onCancel={hideModal}
  width={1000}
  destroyOnClose
  footer={null}
  modalRender={(modal) => {
    return React.cloneElement(modal, {
      style: { ...modal.props.style, padding: 0 },
    });
  }}>
  <Row gutter={16}  >
    <Col span={12} className="bg-gradient-to-r from-fuchsia-900 to-fuchsia-400 rounded-l-md" >
      <div style={{ padding: '20px' }} >
        <h2>Welcome to our platform!</h2>
        <p>Some introduction text goes here...</p>
      </div>
    </Col>
    
    <Col span={8} push={2} className="pt-10">
      <Form onFinish={(values: Store) => signIn(values.email, values.password)}>
        <h1 className="text-3xl font-bold mb-5">Welcome Back</h1>
        <Form.Item
          label="Email"
          name="email"
          tooltip="Example@email.com"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          tooltip="At least 8 characters"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters!' },
          ]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <a href="#" className="text-primary-blue float-right">
            Forget Password?
          </a>
        </Form.Item>
        <Form.Item className="mt-5 ">
          <Button type="primary" htmlType="submit" className="w-full bg-black h-10">
            Sign In
          </Button>
        </Form.Item>

        {/* Divider and Social Media Buttons */}
        <Divider plain>Or</Divider>
            <Button block icon={<GoogleOutlined />} className="bg-white w-full mb-5 h-10" >
              Sign in with Google
            </Button>
            <Button block icon={<FacebookFilled />} className="bg-blue-800 text-white w-full mb-5 h-10">
              Sign in with Facebook
            </Button>
            <p className="text-center mb-10">Don't you have an account? <a href="#" className="text-primary-blue">Sign up</a></p>
      </Form>
    </Col>
  </Row>
</Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
