import useAPI from '../components/Api';
import { Link } from 'react-router-dom';

export default function Product({ path = ''}){
  const {data, loading, error} = useAPI(path);
  if (error) return <p>Error: {error}</p>
  if (loading) return <p>Loading...</p>
  
  return(
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 ">
      {Array.isArray(data) && data.map((item, key)=>(
      <div key={key} className="bg-indigo-500 text-black h-64 w-full rounded-md bg-white/30 backdrop-blur-md shadow-lg border border-white/20 px-3 pt-2">
        <img className="h-1/2 w-full rounded-md object-cover" src={item.image} />
        <div>
          <h3 className="font-bold text-gray-500 line-clamp-2 pt-2 dark:text-gray-200"><Link to={`/product/${item.slug}`}> {item.name}</Link></h3>
          <p className="text-gray-500 dark:text-gray-200 mt-4">Rs. {item.price}</p>
        </div>
      </div>
      ))}
    </div>
  )
}