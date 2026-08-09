import React from "react"

function BrandCard({ name, logo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-ink px-4 py-6 transition hover:shadow-md sm:gap-4 sm:px-6 sm:py-8"
    >
      <img src={logo} alt={name} className="h-10 w-auto object-contain sm:h-12" />
      <span className="text-base font-bold text-ink sm:text-lg">{name}</span>
    </button>
  )
}

export default BrandCard
