import { useState, useEffect, useRef } from 'react';

const cache = new Map();
const inflightRequests = new Map();

export function useRequest({ url, method = 'GET', body = null, headers = {}, options = {} }) {
    const {
        retry = 2,
        staleTime = 1000 * 60 * 5,
        refetchOnWindowFocus = false,
        enabled = true,
        cacheKey = url,
    } = options;

    const [data, setData] = useState(() => method === 'GET' ? cache.get(cacheKey)?.data || null : null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(() => method === 'GET' && !cache.has(cacheKey));
    const [isFetching, setFetching] = useState(false);
    const retryCount = useRef(0);
    const abortController = useRef(null);

    const fetchData = async () => {
        if (!enabled) return;

        setFetching(true);
        setLoading(method === 'GET' && !cache.has(cacheKey));
        setError(null);

        if (method === 'GET' && inflightRequests.has(cacheKey)) {
            return inflightRequests.get(cacheKey)
                .then(result => setData(result))
                .catch(err => setError(err))
                .finally(() => setFetching(false));
        }

        abortController.current = new AbortController();
        const signal = abortController.current.signal;

        const fetchPromise = (async () => {
            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers,
                    },
                    body: body ? JSON.stringify(body) : null,
                    signal,
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                const result = await response.json();

                if (method === 'GET') {
                    cache.set(cacheKey, {
                        data: result,
                        timestamp: Date.now(),
                    });
                }

                setData(result);
                retryCount.current = 0;
                return result;
            } catch (err) {
                if (retryCount.current < retry) {
                    retryCount.current += 1;
                    return fetchData(); // Retry
                } else {
                    throw err;
                }
            }
        })();

        if (method === 'GET') inflightRequests.set(cacheKey, fetchPromise);

        return fetchPromise
            .catch(err => setError(err))
            .finally(() => {
                inflightRequests.delete(cacheKey);
                setLoading(false);
                setFetching(false);
            });
    };

    useEffect(() => {
        if (method === 'GET') {
            const cached = cache.get(cacheKey);
            const isStale = !cached || Date.now() - cached.timestamp > staleTime;

            if (enabled && isStale) {
                fetchData();
            }

            const handleFocus = () => {
                if (refetchOnWindowFocus) {
                    fetchData();
                }
            };

            window.addEventListener('focus', handleFocus);
            return () => {
                window.removeEventListener('focus', handleFocus);
                abortController.current?.abort();
            };
        }
    }, [url, method, enabled]);

    return {
        data,
        error,
        isLoading,
        isFetching,
        refetch: fetchData,
        mutate: fetchData, // for POST/PUT/DELETE
    };
}
