import {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {Button, message } from 'antd'
import useFetchWithAuth from '../hooks/useFetchWithAuth'
import UserDetailForm from '../components/UserDetailForm'
import UserPasswordForm from '../components/UserPasswordForm'
import MyProduct from '../components/MyProducts'

const BASE_URL = import.meta.env.VITE_BASE_URL

export default function Profile(){
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()


  // When Logout
  const logout = async () =>{
    setLoading(true)
    try{
      await useFetchWithAuth(`${BASE_URL}/logout/`,{
        method: 'POST',
        body: JSON.stringify({refresh: localStorage.getItem('refresh_token')})
      })
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigate('/login', {replace: true})
      
    } catch (err){
      messageApi.open({
        type:'error',
        content:'Failed to logout! Something went wrong.'
      })
    }
    setLoading(false)
  }


  // Data Fetching
  const [data, setData] = useState(null) //API Data
  useEffect(()=>{
    (async ()=>{
    setLoading(true)
    const res = await useFetchWithAuth(`${BASE_URL}/api/profile/`, {
      method: 'GET',
    })
    const jsonData = await res.json()
    setData(jsonData)
    setLoading(false)
    })();
  }, [])

  if (loading) return <p>Loading...</p>
  if (!data) return <p>Nothing...</p>
  
  return (
    <>
      {contextHolder}
      <h1>Hi! {data.username}</h1>
      <h1>You are {data.role} <Link to="/upload-product">Upload</Link></h1>

      {/* User Detail Form */}
      <UserDetailForm data={data} BASE_URL={BASE_URL} />

      {/* User Password Form */}
      <UserPasswordForm BASE_URL={BASE_URL} />

      <MyProduct />
      
      {/* Logout Button */}
      <Button onClick={logout} loading={loading} type="primary">Logout</Button>
    </>
  )
}