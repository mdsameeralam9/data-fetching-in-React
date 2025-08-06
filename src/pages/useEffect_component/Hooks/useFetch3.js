import { useState, useRef } from 'react';

// Cache API responses
const cacheStore = new Map();

const useFetch3 = (url, options = {}) => {
  const [apistate, setapistate] = useState({
    data: null,
    isLoading: false,
    isError: false,
    error: '',
  });

  const controllerRef = useRef(null);
  const retryCount = useRef(0);

  const {
    retry = 0,
    cache = true,
    cacheKey = url,
    method = 'GET',
    headers = {}
  } = options;

  const fetcher = async () => {
    if (!url) return;

    // Return cached data if available
    if (cache && cacheStore.has(cacheKey)) {
      const cachedData = cacheStore.get(cacheKey);
      setapistate(prev => ({
        ...prev,
        data: cachedData,
        isLoading: false,
        isError: false,
        error: ''
      }));
      return cachedData;
    }

    // Abort previous request if any
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    // Reset retry count
    retryCount.current = 0;

    // Set loading state once
    setapistate(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: ''
    }));

    const attemptFetch = async () => {
      try {
        const response = await fetch(url, {
          signal: controllerRef.current.signal,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Cache response
        if (cache) {
          cacheStore.set(cacheKey, result);
        }

        setapistate(prev => ({
          ...prev,
          data: result,
          isLoading: false,
          isError: false,
          error: ''
        }));

        return result;
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }

        if (retryCount.current < retry) {
          retryCount.current++;
          console.log(`Retrying... attempt ${retryCount.current}`);
          return attemptFetch(); // retry
        }

        setapistate(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: err.message
        }));
      }
    };

    return attemptFetch();
  };

  const { data, isLoading, error, isError } = apistate;
  return { data, isLoading, error, isError, fetcher };
};

export default useFetch3;

// use fetcher with button action
{/**
  
import React from 'react';
import useFetch from './useFetch'; // adjust path as needed

const ManualFetchExample = () => {
  const {
    data,
    isLoading,
    error,
    isError,
    fetcher
  } = useFetch('', {}); // initially no URL

  const handleFetchAndAct = async () => {
    try {
      // Set URL dynamically if needed
      await fetcher(); // wait for fetch to complete

      // Do something with the response
      if (data) {
        console.log('Fetched data:', data);
        alert(`User name is ${data.name}`);
      }
    } catch (err) {
      console.error('Error during fetch:', err);
    }
  };

  return (
    <div>
      <h2>Manual Fetch Trigger</h2>

      {isLoading && <p>Loading...</p>}
      {isError && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && <p><strong>Fetched Name:</strong> {data.name}</p>}

      <button onClick={handleFetchAndAct} disabled={isLoading}>
        Fetch and Act
      </button>
    </div>
  );
};

export default ManualFetchExample;
 
*/}