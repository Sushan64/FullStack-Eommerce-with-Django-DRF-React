import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }){
  const token = localStorage.getItem('access_token')
  const location= useLocation()
  if (!token){
    return <Navigate to={`/login?next=${location.pathname}`} replace />
  } else{
    return children
  }
}