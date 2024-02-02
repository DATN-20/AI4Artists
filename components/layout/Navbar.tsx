"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { Store } from "antd/lib/form/interface";

interface SignInFormValues {
  username: string;
  password: string;
}
const NavBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const showPopup = () => {
    setVisible(true);
  };

  const handleOk = (values: Store) => {
    // Handle sign-in logic here
    console.log("Received values:", values);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <header className="w-full  absolute z-10">
      <nav className="mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent bg-black">
        <Link href="/" className="flex justify-center items-center">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </Link>

        <Button
          type="primary" onClick={showPopup}
          className="text-primary-blue rounded-full bg-black min-w-[130px] border border-white"
        >
          Sign in
        </Button>
        <Modal
        title="Sign In"
        open={visible}
        onOk={(e) => handleOk(e)}
        onCancel={handleCancel}
        width={1000} 
        destroyOnClose 
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ padding: '20px' }}>
              <h2>Welcome to our platform!</h2>
              <p>Some introduction text goes here...</p>
            </div>
          </Col>
          
          <Col span={12}>
            <Form onFinish={handleOk}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
      </nav>
    </header>
  );
};
export default NavBar;
