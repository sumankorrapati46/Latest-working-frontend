import { useState, useCallback, useRef } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());
  const abortController = useRef(null);

  const executeApiCall = useCallback(async (apiFunction, options = {}) => {
    const {
      cacheKey = null,
      cacheTime = 5 * 60 * 1000, // 5 minutes
      skipCache = false,
      showError = true,
      onSuccess = null,
      onError = null
    } = options;

    // Cancel previous request if it exists
    if (abortController.current) {
      abortController.current.abort();
    }

    // Create new abort controller
    abortController.current = new AbortController();

    // Check cache first
    if (cacheKey && !skipCache) {
      const cached = cache.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(abortController.current.signal);
      
      // Cache the response
      if (cacheKey) {
        cache.current.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }

      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);

      if (onError) {
        onError(err);
      }

      if (showError) {
        console.error('API Error:', err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback((key = null) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  return {
    loading,
    error,
    executeApiCall,
    clearCache,
    cancelRequest
  };
}; 