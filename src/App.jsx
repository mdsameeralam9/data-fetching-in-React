import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UseEffect_Component from './pages/useEffect_component'
import Header from './components/Header'
import NotFound from './components/NotFound'
import ErrorBoundry from './components/ErrorBoundry'
import With_IIFE_Function from './pages/with_function'
import Suspense_Component from './pages/suspense_component'
import USE_API_Component from './pages/use_api_componet'

function App() {
  return (

    <BrowserRouter>
      <ErrorBoundry>
        <Header />
        <Routes>
          <Route path="/" element={<With_IIFE_Function />} />
          <Route path="/useeffect" element={<UseEffect_Component />} />
          <Route path="/suspense" element={<Suspense_Component />} />
          <Route path="/useapi" element={<USE_API_Component />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundry>
    </BrowserRouter>

  )
}

export default App
