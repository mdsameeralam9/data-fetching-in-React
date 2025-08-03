import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header>
            <h2>Data Fetching with</h2>
            <nav>
                <Link to="/">IIFE Function</Link>
                <Link to="/useeffect">UseEffect</Link>
                <Link to="/suspense">Suspense</Link>
                <Link to="/useapi">Use API</Link>
                <Link to="/swr">swr</Link>
                <Link to="/usequery">usequery</Link>
            </nav>
        </header>
    )
}

export default Header