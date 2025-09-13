import {Form, Input, Button} from 'antd'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import useFetchWithAuth from '../hooks/useFetchWithAuth'

export default function UserDetailForm({data, BASE_URL}){
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleFinish = async (value) =>{
    setLoading(true)
    const res = await useFetchWithAuth(`${BASE_URL}/api/profile/`, {
      method: 'POST',
      body: JSON.stringify({
        
        first_name: value.first_name,
        last_name: value.last_name,
        email: value.email,
        
      })
    })
    if (!res.ok) console.log(res)
    window.location.reload()
    setLoading(false)
    
  }
  return(
  <Form onFinish={handleFinish}>
        {/* First Name */}
        <Form.Item name="first_name" label="First Name">
          <Input type='text' defaultValue={data.first_name}/>
        </Form.Item>
        {/* Last Name */}
        <Form.Item name="last_name" label="Last Name">
          <Input type="text" defaultValue={data.last_name}/>
        </Form.Item>
        {/* Email */}
        <Form.Item name="email" label="Email">
          <Input type="email" defaultValue={data.email} />
        </Form.Item>
        {/* Submit Button */}
        <Button type="primary" htmlType="submit" loading={loading}>Save</Button>
      </Form>
    )
}