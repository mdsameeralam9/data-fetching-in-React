import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductListWrapper from './ProductListWrapper';

const queryClient = new QueryClient();

const React_Query = () => {
    return (
        <QueryClientProvider client={queryClient}>
          <ProductListWrapper />
        </QueryClientProvider>
    )
}

export default React_Query;

