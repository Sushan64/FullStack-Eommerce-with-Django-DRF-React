import { useState, useEffect } from 'react';

export default function API(){
  let [data, setData] = useState(null);
  let [error, setError] = useState(null);

  useEffect(()=>{
    const fetchData = async () =>{
      try{
       const res = await fetch('https://77225b06-8bb0-4de2-843f-75ac4721ae65-00-gz4u5a1hikve.sisko.replit.dev/api/')
        if (!res.ok) throw new Error('Failed to fetch API');
        const json = await res.json();
        setData(json)
      } catch (err){
        setError(err.message)
      }
    };

    fetchData();
    
  }, []);

  return {data, error};
}