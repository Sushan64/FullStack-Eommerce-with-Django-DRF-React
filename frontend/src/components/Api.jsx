import { useState, useEffect } from 'react';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

export default function useApi(path = '') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fullUrl = path ? `${BASE_URL}/${path}/` : `${BASE_URL}/`;
        console.log('url', fullUrl)
        const res = await fetch(fullUrl, { signal: controller.signal });

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
  }, [path]);

  return { data, loading, error };
}