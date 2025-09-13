import { Navigate } from 'react-router-dom'
export default function ProtectedRegisterRoute({children}){
  const token = localStorage.getItem('access_token')
  if (token){
    return <Navigate to='/profile' />
  }
  return children
}