import React from "react"
import { Laptop } from "lucide-react"

function CategoryCard({ name, icon: Icon = Laptop, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-ink px-4 py-6 transition hover:shadow-md sm:gap-4 sm:px-6 sm:py-8"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive/10 text-olive sm:h-14 sm:w-14">
        <Icon size={22} />
      </span>
      <span className="text-base font-bold text-ink sm:text-lg">{name}</span>
    </button>
  )
}

export default CategoryCard
