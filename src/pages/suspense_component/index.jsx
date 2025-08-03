import React, { Suspense } from 'react'
import ProductListSkeleton from '../../components/PorductSkelton'
import ProdList from './ProdList'
import ErrorBoundary from '../../components/ErrorBoundry'

const Suspense_Component = () => {
  return (
    <ErrorBoundary>
    <Suspense
      fallback={<ProductListSkeleton />}
    >
     <ProdList />
    </Suspense>
    </ErrorBoundary>
  )
}

export default Suspense_Component