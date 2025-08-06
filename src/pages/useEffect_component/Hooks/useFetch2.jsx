import React, { useCallback, useEffect, useState, useRef } from 'react'

const useFetch = (url) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const controllerRef = useRef();

    const fetcher = useCallback(async () => {
        if (!url) {
            setLoading(false)
            return
        };

        // Cleanup previous request
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();

        // if loading is true, reset it to false
        if (!loading) setLoading(true);

        // only clearing error if there was a previous error
        if (error) setError(false);

        try {
            const response = await fetch(url, { signal: controllerRef.current.signal });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (Array.isArray(result?.products) && result?.products?.length > 0) {
                const formatResponse = result?.products?.map(({ id, title, images }) => ({ id, title, image: images?.[0] }));
                setData(formatResponse);
            }
        } catch (err) {
            if(err.name !== 'AbortError'){
              setError(err.message);
            }else{
                console.log("AbortError")
            }
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetcher()

        return () => controllerRef.current.abort();
    }, [])


    return { loading, error, data }
}

export default useFetch;