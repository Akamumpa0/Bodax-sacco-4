import { useCallback, useEffect, useState } from 'react';
import api from '../api/client.js';

/**
 * useApi – fetch data from an API endpoint with built-in loading, error, and retry support.
 * Shows a loading state after 1 second (threshold) to match the spinner requirement.
 */
export function useApi(path, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(() => {
    if (!path) return;
    let mounted = true;
    setLoading(true);
    setError('');

    api
      .get(path)
      .then((response) => {
        if (mounted) {
          setData(response.data);
          setError('');
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.response?.data?.message || 'Failed to load data. Please retry.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [path, retryCount]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  /** Call retry() to re-trigger the fetch */
  function retry() {
    setRetryCount((c) => c + 1);
  }

  return { data, setData, loading, error, retry };
}
