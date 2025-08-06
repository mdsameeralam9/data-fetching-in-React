import { useState, useEffect, useRef, useCallback } from 'react';

const cacheStore = new Map();

const useFetch5 = (url, options = {}) => {
    const controllerRef = useRef(null);
    const retryCount = useRef(0);

    const {
        retry = 0,
        cache = true,
        cacheKey = url,
        method = 'GET',
        headers = {},
        timeout = 8000,
    } = options;

    // Check cache immediately
    const cachedData = cache && cacheStore.has(cacheKey)
        ? cacheStore.get(cacheKey)
        : null;

    const [apistate, setapistate] = useState({
        data: cachedData,
        isLoading: !cachedData,
        isError: false,
        error: '',
    });

    const fetcher = useCallback(async () => {
        if (!url) {
            setapistate(s => ({ ...s, isLoading: false }));
            return;
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        setapistate(s => ({ ...s, isLoading: true, isError: false, error: '' }));

        const timeoutId = setTimeout(() => {
            controllerRef.current.abort();
        }, timeout);

        try {
            const response = await fetch(url, {
                signal,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            setapistate(s => ({ ...s, data: result }));

            if (cache) {
                cacheStore.set(cacheKey, result);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                if (retry && retryCount.current < retry) {
                    retryCount.current++;
                    fetcher();
                    return;
                }
                setapistate(s => ({ ...s, isError: true, error: err.message }));
            } else {
                // setapistate(s => ({ ...s, isError: true, error: 'Request timed out or aborted' }));
                console.log("Request timed out or aborted")
            }
        } finally {
            clearTimeout(timeoutId);
            setapistate(s => ({ ...s, isLoading: false }));
        }
    }, []);

    // url, method, headers, cache, cacheKey, retry, timeout

    useEffect(() => {
        if (!cachedData) {
            fetcher();
        }

        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []); // fetcher, cachedData


    const refetch = () => {
        retryCount.current = 0;
        fetcher();
    };

    const { data, isLoading, error, isError } = apistate;
    return { data, isLoading, error, isError, fetcher, refetch };
};

export default useFetch5;
