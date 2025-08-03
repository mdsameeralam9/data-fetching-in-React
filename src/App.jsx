import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UseEffect_Component from './pages/useEffect_component'
import Header from './components/Header'
import NotFound from './components/NotFound'
import ErrorBoundry from './components/ErrorBoundry'
import With_IIFE_Function from './pages/with_function'

function App() {
  return (
    
      <BrowserRouter>
      <ErrorBoundry>
        <Header />
        <Routes>
          <Route path="/" element={<With_IIFE_Function />} />
          <Route path="/useeffect" element={<UseEffect_Component />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
         </ErrorBoundry>
      </BrowserRouter>
   
  )
}

export default App
