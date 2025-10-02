import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import {Link} from 'react-router-dom'
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function SearchBar({ query, onClose }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false)

  const fetchData = async (q) => {
    if (!q) return;
    setLoading(true)
    const res = await fetch(`${BASE_URL}/api/search/?search=${q}`, {
      method: "GET",
      header:{
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    setResults(data);
    setLoading(false)
  };

  const debouncedFetch = useCallback(
    debounce((value) => fetchData(value), 400), [])

  useEffect(() => {
    if (query) debouncedFetch(query);
  }, [query]);

  if (loading) return <>Loading..</>

  

  return (
    <>
      {/* You can add search results or suggestions here */}
      <div className="p-4 text-center text-slate-500">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
      {results ? results.results.map((item, key)=>(
      <div key={key} className="h-64 bg-indigo-500 text-black w-full rounded-md bg-white/30 backdrop-blur-md shadow-lg border border-white/20 px-3 pt-2">
        <img className="h-1/2 w-full rounded-md object-cover" src={item.image} />
        <div>
          <h3 className="font-bold text-gray-500 line-clamp-2 pt-2 dark:text-gray-200"><Link onClick={onClose} to={`/product/${item.slug}`}> {item.name}</Link></h3>
          <p className="text-gray-500 dark:text-gray-200 mt-4">Rs. {item.price}</p>
        </div>
      </div>
      )) : <div className="col-span-2">Start typing to see results...</div> }
    </div>
      </div>
    </>
  );
}
