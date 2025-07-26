import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const BASE_URL =`${import.meta.env.VITE_BASE_URL}/api`

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post( `${BASE_URL}/token/`, {
        username: values.username,
        password: values.password,
      });
      localStorage.setItem("token", response.data.token);
      message.success("Login successful!");
    } catch (error) {
      message.error(
        error.response?.data?.non_field_errors?.[0] || "Login failed"
      );
    }
    setLoading(false);
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      style={{ maxWidth: 300, margin: "auto", marginTop: 50 }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}
