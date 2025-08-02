import React, { useEffect, useState } from 'react'

const useFetch = (url) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);

    const fetcher = async () => {
        if(!url) {
            setLoading(false)
            return
        };

        if(!loading) setLoading(true);
        if(error) setError(false);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if(Array.isArray(result?.products) && result?.products?.length > 0){
              const formatResponse = result?.products?.map(({id, title, images}) => ({id, title, image: images?.[0]}));
               setData(formatResponse);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetcher()
    },[])


    return { loading, error, data }
}

export default useFetch;