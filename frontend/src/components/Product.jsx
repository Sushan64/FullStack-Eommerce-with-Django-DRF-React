import API from '../components/Api';

export default function Product(){
  const {data, error} = API();
  const BASE_URL = "https://77225b06-8bb0-4de2-843f-75ac4721ae65-00-gz4u5a1hikve.sisko.replit.dev/"
  if (error) return <p>Error: {error}</p>
  return(
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {Array.isArray(data) && data.map((item, key)=>(
      <div key={key} className="bg-indigo-500 text-black h-auto w-full rounded-md bg-white/30 backdrop-blur-md shadow-lg border border-white/20 p-3">
        <img src={`${BASE_URL}${item.image}`} />
        <div>
          <h3 className="font-bold">{item.name}</h3>
          <p>Rs. {item.price}</p>
        </div>
      </div>
      ))}
    </div>
  )
}