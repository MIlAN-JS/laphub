import React from "react"

function BrandCard({ name, logo }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-ink px-4 py-6 sm:gap-4 sm:px-6 sm:py-8">
      <img src={logo} alt={name} className="h-10 w-auto object-contain sm:h-12" />
      <span className="text-base font-bold text-ink sm:text-lg">{name}</span>
    </div>
  )
}

export default BrandCard
