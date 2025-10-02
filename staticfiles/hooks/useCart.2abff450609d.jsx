import axios from 'axios';
import {useState, useEffect} from "react"
import useFetchWithAuth from './useFetchWithAuth'
import {useNavigate} from 'react-router-dom'

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`

export default function useCart() {
  const navigate = useNavigate()
  const addToCart = async (data) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }
    const requestBody = {
      product_id: data.product_id,
      quantity: data.quantity || 1,
      selected_attributes: data.attributes,
    };

    try {
      const response = await useFetchWithAuth(
        `${BASE_URL}/cart/add/`, {
          method: 'POST',
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add to cart: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message || error };
    }
  };

  return { addToCart };
}

export function useCartGet(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fullUrl = `${BASE_URL}/cart/add/`
        const res = await useFetchWithAuth(fullUrl, { method: 'GET', });

        if (!res.ok) {
          throw new Error(`Failed to fetch API: ${res.statusText}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
          setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      const res = await useFetchWithAuth(fullUrl, {
        method: 'DELETE'
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