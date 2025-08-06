import React from 'react'
import ProductList from '../../components/ProductList'
import useFetch from './Hooks/useFetch';




const UseEffect_Component = () => {
    const { isLoading, isError, data } = useFetch('https://dummyjson.com/products');
    console.log("UseEffect_Component===>",isLoading, isError, data)
    const formatResponse = data?.products?.map(({ id, title, images }) => ({ id, title, image: images?.[0] })) || [];
    return (
        <div>
            <ProductList loading={isLoading} error={isError} data={formatResponse} callFrom={"useEffect"}/>
        </div>
    )
}

export default UseEffect_Component