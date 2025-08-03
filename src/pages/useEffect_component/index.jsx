import React from 'react'
import ProductList from '../../components/ProductList'
import useFetch from './useFetch';

const UseEffect_Component = () => {
    const { loading, error, data } = useFetch('https://dummyjson.com/products');
    return (
        <div>
            <ProductList loading={loading} error={error} data={data} callFrom={"useEffect"}/>
        </div>
    )
}

export default UseEffect_Component