import { use } from 'react';
import Card from '../../components/Card'
import { makeAPICall } from './util';


const ProdList = () => {
    console.count("USE API")
    const data = use(makeAPICall()); // Suspends until resolved
    return (
        <div className='productList'>
            {data.length > 0 && data?.map(product => (
                <Card key={product.id} {...product} />
            ))}
        </div>
    )
}

export default ProdList