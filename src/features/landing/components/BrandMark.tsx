import { Link } from 'react-router-dom'

function BrandMark() {
  return (
    <Link to="/" aria-label="Vigo home" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-accent">
        <svg aria-hidden="true" viewBox="0 0 28 28" className="h-6 w-6" fill="none">
          <path
            d="m5 7 6.2 14h2.1L19.5 7h-3.3l-4 9.2L8.3 7H5Z"
            fill="currentColor"
          />
          <path
            d="M18.5 18.8 22 11h-3.2l-3.4 7.8h3.1Z"
            fill="currentColor"
            opacity=".65"
          />
        </svg>
      </span>
      <span className="text-[19px] font-extrabold tracking-[-1px] text-ink">
        vigo<span className="text-[#9bcf3f]">.</span>
      </span>
    </Link>
  )
}

export default BrandMark
