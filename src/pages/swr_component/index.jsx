import React from 'react'
import useSWR from 'swr';
import ProductList from '../../components/ProductList'
import { makeAPICall } from '../suspense_component/util';

const SWR_Component = () => {
    const { isLoading , error, data } = useSWR('productList_api',makeAPICall);
    return (
        <div>
            <ProductList loading={isLoading } error={error} data={data} callFrom={"SWR"}/>
        </div>
    )
}

export default SWR_Component