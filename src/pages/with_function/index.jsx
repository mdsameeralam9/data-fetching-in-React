import React, { useState, useCallback, useRef } from 'react'
import ProductList from '../../components/ProductList';

const With_IIFE_Function = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);

    const fetchAgain = useRef(true)

    fetchAgain.current && (async () => {
        fetchAgain.current = false;
        if (!loading) setLoading(true);
        if (error) setError(false);

        try {
            const response = await fetch('https://dummyjson.com/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (Array.isArray(result?.products) && result?.products?.length > 0) {
                const formatResponse = result?.products?.map(({ id, title, images }) => ({ id, title, image: images?.[0] }));
                setData(formatResponse);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    })()


    return (
        <div>
            <ProductList loading={loading} error={error} data={data} callFrom={"Normal Funtion"} />
        </div>
    )
}

export default With_IIFE_Function