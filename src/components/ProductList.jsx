import React from 'react'
import Card from './Card'
import PorductSkelton from './PorductSkelton'

const ProductList = ({ error="", loading=false, data=[], callFrom="" }) => {
  console.count(callFrom)
  if(loading) return <PorductSkelton />
  if(error) return <h1>Failed to Fetch Data</h1>
  if(data.length === 0) return <h1>No Products Available</h1>
  return (
    <div className='productList'>
        {data?.map(product => (
            <Card key={product.id} {...product}/>
        ))}
    </div>
  )
}

export default ProductList