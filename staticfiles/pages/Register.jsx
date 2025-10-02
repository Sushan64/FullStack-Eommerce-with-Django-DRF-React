import {Form, Input, Button, message, Select} from 'antd'
import {useState} from 'react'
export default function Register(){
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const onFinish = async (values) =>{
    setLoading(true)
    const response = await fetch(`${BASE_URL}/register/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        username: values.username,
        email: values.email,
        role: values.role,
        password1: values.password1,
        password2: values.password2
      })
    })
    console.log(values.role)
    console.log(response)
    if (response.ok){
      const data = await response.json()
      messageApi.open({
        type: 'success',
        content: 'Registeration Successful!'
      })
    } else {
      const errorData = await response.json()
      console.log(errorData)
      messageApi.open({
        type: 'error',
        content: errorData.detail || 'Registeration Faild!'
      })
    }
    setLoading(false)
  }
  
  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish}>
        {/* Username */}
        <Form.Item label={<span className="dark:text-gray-200">Username</span>} name="username" rules={[{required: true, message:'Please enter your Username.'}]}>
        <Input placeholder="Sushan64" />
        </Form.Item>

        {/* Email */}
        <Form.Item label={<span className="dark:text-gray-200">Email</span>} name="email" rules={[{required: true, message:'Please enter your Email'}]}>
        <Input type="email" placeholder="username@sushan.com"/>
        </Form.Item>

        {/* Role */}
        <Form.Item label={<span className="dark:text-gray-200">Role</span>} name="role" rules={[{required: true, message:"This can't be empty"}]}>
        <Select defaultValue="customer" options={[
      {value:'customer', label:'Customer'},
      {value:'seller', label:'Seller'}
        ]}/>
        </Form.Item>

        {/* Password */}
        <Form.Item label={<span className="dark:text-gray-200">Password</span>} name="password1" rules={[{required: true, message:'Enter your password'}]}>
        <Input.Password  placeholder="••••••••"/>
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item label={<span className="dark:text-gray-200">Confirm Password</span>} name="password2" rules={[{required: true, message:'Confirm your password'}]}>
        <Input.Password placeholder="••••••••"/>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item label={null}>
          <Button type="primary" loading={loading} htmlType="submit">Create Account</Button>
        </Form.Item>
      </Form>
    </>
  )
}