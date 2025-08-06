import { useState, useEffect, useRef, useCallback } from 'react';

// cache api response;
const cacheStore = new Map();

const useFetch = (url, options = {}) => {
    const {
    retry = '',
    cache = true,
    cacheKey = url,
    method = 'GET',
    timeout = 8000,
    headers = {}
  } = options;

  const [apistate, setapistate] = useState({
    data: null,
    isLoading: cache ? false : true,
    isError: false,
    error: '',
  });
  const controllerRef = useRef(null);
  const retryCount = useRef(0);


  const fetcher = useCallback(async () => {
    if (!url) {
      setapistate(s => ({ ...s, isLoading: false }));
      return;
    }

    // if (cache && cacheStore.has(cacheKey)) {
    //   const data = cacheStore.get(cacheKey);
    //   setapistate(s => ({ ...s, data, isLoading: false }));
    //   return;
    // }


    // Cleanup previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    // if loading is false, reset it to true and clearing error if there was a previous error
    if (!apistate.isLoading) setapistate(s => ({ ...s, isLoading: true, isError: false, error: '' }));

    // timeout support - abort requests after a certain duration.
    const timeoutId = setTimeout(() => controllerRef.current.abort(), timeout)

    // fetch api
    try {
      const response = await fetch(url, {
        signal: controllerRef.current.signal,
        method,
        headers: {
          'Content-type': 'application/json',
          ...headers
        }
      });

      // if api failed, then throw error
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setapistate(s => ({ ...s, data: result }));

      // cache response
      if (cache) {
        cacheStore.set(cacheKey, result);
      }

      // return api response
      // return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        if (retry && retryCount.current <= retry) {
          retryCount.current++;
          fetcher();
          return;
        }
        setapistate(s => ({ ...s, isError: true, error: err.message }));
      } else {
        console.log('AbortError')
      }
    } finally {
      clearTimeout(timeoutId); // Always clear timeout
      setapistate(s => ({ ...s, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    const isCached = cache && cacheStore.has(url);
    if (isCached) {
      // already data is cached then use the same data
      const cachedData = cacheStore.get(url);
      setapistate(s => ({ ...s, data: cachedData, isLoading: false }));
      return;
    } else {
      fetcher();
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);


  const { data, isLoading, error, isError } = apistate
  return { data, isLoading, error, isError, fetcher };
};

export default useFetch;