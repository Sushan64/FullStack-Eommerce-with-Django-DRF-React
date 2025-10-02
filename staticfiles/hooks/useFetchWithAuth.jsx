import isAuthenticated from '../components/isAuthenticated'
import {navigate} from '../services/navigationService'

const BASE_URL = import.meta.env.VITE_BASE_URL

async function refreshToken(){
  const refresh = localStorage.getItem('refresh_token')
  const res = await fetch(`${BASE_URL}/token/refresh/`,{
    method: 'POST',
    headers :{
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({ refresh })
  })
  if (!res.ok) throw new Error('Refresh Token Invalid')
  const data = await res.json()
  localStorage.setItem('access_token', data.access)
  return data.access
}



export default async function useFetchWithAuth(url, options = {}, isFormData=false){
  
  let token = localStorage.getItem('access_token')
  const authorized = await isAuthenticated()
  
  if (!authorized){
    try{
      token = await refreshToken()
      localStorage.setItem('access_token', token)
    } catch (err){
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigate('/login', {replace: true})
      return
      }
  }

  console.log('Authorized user')
  options.headers ={
    Authorization : `Bearer ${token}`,
    ...(!isFormData && {'Content-Type': 'application/json'})
  }
  let res = await fetch(url, options)
  return res
}