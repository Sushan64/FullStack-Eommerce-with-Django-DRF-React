const BASE_URL = import.meta.env.VITE_BASE_URL


export default async function isAuthenticated(){
  const token = localStorage.getItem('access_token')
  let res = await fetch(`${BASE_URL}/token/verify/`,{
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
  },
    body: JSON.stringify({token : `${token}`})
  })
  if (res.status == 401){
    return false
    }
  return true
}