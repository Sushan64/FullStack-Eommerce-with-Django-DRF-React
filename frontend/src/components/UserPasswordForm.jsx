import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {Form, Input, Button} from 'antd'
import useFetchWithAuth from '../hooks/useFetchWithAuth'

export default function UserPasswordForm({BASE_URL}){
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  // Handle Password Change
  const handleSubmit = async (value)=>{
    setLoading(true)
    const res = await useFetchWithAuth(`${BASE_URL}/api/change-password/`, {
      method: 'POST',
      body: JSON.stringify({
        old_password: value.old_password,
        new_password: value.new_password,
        confirm_password: value.confirm_password
      })
    })
    if (!res.ok) throw new Error('Something went wrong!')
    window.location.reload()
    setLoading(false)
  }
  
  return (
      <Form onFinish={handleSubmit}>
        {/* Old Password */}
        <Form.Item name="old_password" label="Old Password">
          <Input.Password placeholder="••••••"/>
        </Form.Item>
        {/* New Password */}
        <Form.Item name="new_password" label="New Password">
          <Input.Password placeholder="••••••"/>
        </Form.Item>
        {/* Confirmm Password */}
        <Form.Item name="confirm_password" label="Confirm Password">
          <Input.Password placeholder="••••••"/>
        </Form.Item>
        {/* Password Change Submit Button */}
        <Button type="primary" loading={loading} htmlType="submit">Change Password</Button>
      </Form>
  )
}