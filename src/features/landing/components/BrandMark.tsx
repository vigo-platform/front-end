import { Link } from 'react-router-dom'

function BrandMark() {
  return (
    <Link to="/" aria-label="Vigo home" className="inline-flex items-center">
      <img src="/vigo-logo.svg" alt="Vigo" className="h-10 w-auto max-w-[132px] object-contain vigo-logo" />
    </Link>
  )
}

export default BrandMark
