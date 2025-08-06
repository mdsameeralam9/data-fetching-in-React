import { useState, useEffect, useRef } from 'react';

const cacheStore = new Map();

const useFetch = (url, options = {}) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    isError: false,
    error: '',
  });
  
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!url) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }

    const { cache = true, cacheKey = url } = options;

    // Check cache first
    if (cache && cacheStore.has(cacheKey)) {
      const data = cacheStore.get(cacheKey);
      setState({ data, isLoading: false, isError: false, error: '' });
      return;
    }

    // Abort previous request
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    // if loading is false then make it true;
    if(!state.isLoading){
      setState(s => ({ ...s, isLoading: true, isError: false, error: '' }));
    }
    

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          signal: controllerRef.current.signal,
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!mountedRef.current) return;

        setState({ data: result, isLoading: false, isError: false, error: '' });

        if (cache) {
          cacheStore.set(cacheKey, result);
        }

      } catch (err) {
        if (!mountedRef.current || err.name === 'AbortError') return;
        setState({ data: null, isLoading: false, isError: true, error: err.message });
      }
    };

    fetchData();

    return () => {
      controllerRef.current?.abort();
    };
  }, [url]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = () => {
    if (url) {
      setState(s => ({ ...s, isLoading: true, isError: false, error: '' }));
      const { cache = true, cacheKey = url } = options;
      if (cache) cacheStore.delete(cacheKey);
    }
  };

  return { ...state, refetch };
};

export default useFetch;