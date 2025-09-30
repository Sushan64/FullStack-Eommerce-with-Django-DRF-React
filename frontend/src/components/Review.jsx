import {Button, Form, Input, Rate, message} from "antd"
import useFetchWithAuth from '../hooks/useFetchWithAuth'
import {navigate} from '../services/navigationService'

const BASE_URL = import.meta.env.VITE_BASE_URL

export default function Review({ product_id, path }){
  const isAuthenticated = localStorage.getItem('access_token')
  const {TextArea} = Input
  const [messageApi, contextHolder] = message.useMessage()
  const handleNavigate = () =>{
    navigate(`/login?next=/${path}`, {replace: true})
  }
  if (!isAuthenticated) return (<Button onClick={handleNavigate} type="primary">Login</Button>)

  const handleFinish = async (value) => {
    try{
      const res = await useFetchWithAuth(`${BASE_URL}/api/review/add/`, {
        method: 'POST',
        body: JSON.stringify({
          'product_id': product_id,
          'comment': value.comment,
          'rating': value.rating,
      })
    })
      console.log(res)
      if (!res.ok) throw new Error('Failed to submit your review.')
      messageApi.open({
        type:'success',
        content: 'Successfully Submitted your review!'
      })
      
    } catch (err){
      messageApi.open({
        type:'error',
        content: 'Failed to submit.'
      })
    }
  }
  return(
    <>
      {contextHolder}
      <Form onFinish={handleFinish}>
        {/* Comment */}
        <Form.Item name="comment" rules={[{required: true, message: 'This cannot be empty!'}]}>
          <TextArea showCount maxLength={100} placeholder="Write your Review" />
        </Form.Item>
        {/* Ratings */}

        <Form.Item name="rating" rules={[{required: true, message: 'This cannot be empty!'}]}>
          <Rate />
        </Form.Item>
        
        {/* Submit Button */}
        <Form.Item>
          <Button type='primary' htmlType='submit'>Submit</Button>
        </Form.Item>
      </Form>
    </>
  )
}