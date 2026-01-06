// client/src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        url,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
