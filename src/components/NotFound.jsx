import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='notFound'>
        <h1>NotFound</h1>
        <Link to="/">GO TO HOME</Link>
    </div>
  )
}

export default NotFound