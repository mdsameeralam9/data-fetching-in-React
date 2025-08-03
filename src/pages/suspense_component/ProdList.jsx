import Card from '../../components/Card'
import { productResource } from './util'

const ProdList = () => {
    console.count("ProdList")
    const data = productResource.read(); // Suspends until resolved
    return (
        <div className='productList'>
            {data.length > 0 && data?.map(product => (
                <Card key={product.id} {...product} />
            ))}
        </div>
    )
}

export default ProdList