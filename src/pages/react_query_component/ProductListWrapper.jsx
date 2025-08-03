import { useQuery } from '@tanstack/react-query';
import { makeAPICall } from "../suspense_component/util";
import ProductList from '../../components/ProductList';

const ProductListWrapper = () => {

    const {
        data,
        error,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['products'],
        queryFn: makeAPICall,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        retry: 2, // Retry failed requests up to 2 times
    });


    return (
        <ProductList loading={isLoading} error={isError} data={data} callFrom={"React Query"} />
    );
}

export default ProductListWrapper;