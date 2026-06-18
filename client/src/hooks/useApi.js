import { useEffect, useState } from 'react';
import api from '../api/client.js';

export function useApi(path, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!path) return;
    let mounted = true;
    setLoading(true);
    api
      .get(path)
      .then((response) => mounted && setData(response.data))
      .catch((err) => mounted && setError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [path]);

  return { data, setData, loading, error };
}
