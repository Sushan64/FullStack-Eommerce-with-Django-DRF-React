import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import useFetchWithAuth from '../hooks/useFetchWithAuth'
const BASE_URL = import.meta.env.VITE_BASE_URL
export default function MyProduct(){
  const [data, setData] = useState(null)
  const[loading, setLoading] = useState(false)
  
  useEffect(()=>{
    setLoading(true)
    const fetchData = async () =>{
      const res = await useFetchWithAuth(`${BASE_URL}/api/profile/my-upload/`,{
        method: 'GET'
      })
      const resData = await res.json()
      setData(resData)
    }
    fetchData()
    setLoading(false)
  }, [])

  if (loading) return <p>Loading..</p>
  if (!data) return <p>Nothing..</p>
  
  return (
    <>
      <h1 className="font-bold text-2xl mt-4">My Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
      {Array.isArray(data.results) && data.results.map((item, key)=>(
      <div key={key} className="h-64 bg-indigo-500 text-black w-full rounded-md bg-white/30 backdrop-blur-md shadow-lg border border-white/20 px-3 pt-2">
        <img className="h-1/2 w-full rounded-md object-cover" src={item.image} />
        <div>
          <h3 className="font-bold text-gray-500 line-clamp-2 pt-2 dark:text-gray-200"><Link to={`/product/${item.slug}`}> {item.name}</Link></h3>
          <p className="text-gray-500 dark:text-gray-200 mt-4">Rs. {item.price}</p>
        </div>
      </div>
      ))}
    </div>
    </>
  )
}