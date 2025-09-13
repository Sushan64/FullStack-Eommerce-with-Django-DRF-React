import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {useLocation, useNavigate, Link} from 'react-router-dom'

const BASE_URL =`${import.meta.env.VITE_BASE_URL}`

export default function LoginForm() {
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false);

  const location = useLocation()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true);
    
    const response = await fetch( `${BASE_URL}/login/`,{
        method: 'POST',
        headers: {
        'Content-Type' : 'application/json',
      },
        body: JSON.stringify(
          {username: values.username,
           password: values.password})
      });
    
    // Login Success
    if (response.ok){
      const data = await response.json()
      const accessToken = data.access
      const refreshToken = data.refresh
      const user = data.user

      const searchParams = new URLSearchParams(location.search)
      const nextPath = searchParams.get('next') || '/'
      
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      
      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
      
      messageApi.open({
        type:'success',
        content: `Login successful! welcome ${user.username}`
      })
      navigate(nextPath)
      
    } else {
      // Login Failed
      const errorData = await response.json()
      messageApi.open({
        type:'error',
        content: errorData.detail || "Login failed"
        });
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
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
      <p>Don't have a account? <Link to="/register">Create an Account</Link></p>
    </Form>
    </>
  );
}
