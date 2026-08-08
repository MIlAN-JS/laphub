import React from "react"

function CategoryCard({ name, image, icon: Icon }) {
  return (
    <div className="overflow-hidden rounded-md border border-ink">
      <img src={image} alt={name} className="h-56 w-full object-cover" />
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-lg font-bold text-ink">{name}</span>
        <Icon size={20} className="text-neutral" />
      </div>
    </div>
  )
}

export default CategoryCard
