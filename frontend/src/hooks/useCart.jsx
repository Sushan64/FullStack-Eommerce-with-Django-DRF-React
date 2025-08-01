import axios from 'axios';
import {useState, useEffect} from "react"


const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`

export default function useCart() {
  const addToCart = async (data) => {

    const token = localStorage.getItem('token');
if (!token) {
  return { success: false, error: 'User not authenticated' };
}
    
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/add/`,
        {
          product_id: data.product_id,
          quantity: data.quantity || 1,
          selected_attributes: data.attributes,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error };
    }
  };

  return { addToCart };
}


export function useCartGet(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fullUrl = `${BASE_URL}/cart/add/`
        const res = await fetch(fullUrl,
      { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization : `Token ${localStorage.getItem('token')}`
        },
        signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to fetch API: ${res.statusText}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}



export function useCartDelete() {
  const [delData, setData] = useState({});
  const [delLoading, setLoading] = useState(false);
  const [delError, setError] = useState(null);
  const [delSuccess, setSuccess] = useState(false);

  const deleteItem = async (itemID) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fullUrl = `${BASE_URL}/cart/delete/${itemID}/`;
      const res = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to remove: ${res.statusText}`);
      }

      const json = await res.json();
      setData(json);
      setSuccess(true);
      return json
    } catch (err) {
      setError(err.message);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteItem,
    delData,
    delLoading,
    delError,
    delSuccess
  };
}