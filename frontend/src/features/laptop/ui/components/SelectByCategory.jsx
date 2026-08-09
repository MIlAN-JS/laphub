import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Gamepad2, Briefcase, Laptop, Palette, GraduationCap, Cpu, Tablet, Home } from "lucide-react"
import CategoryCard from "../../../../components/ui/CategoryCard"
import useCategory from "../../../categories/hook/useCategory.js"

// Cosmetic only — purely picks a fitting icon for known category names.
// Anything that doesn't match (eg. a category a seller adds later) just
// falls back to the generic Laptop icon in CategoryCard.
const CATEGORY_ICONS = {
  gaming: Gamepad2,
  business: Briefcase,
  ultrabook: Laptop,
  creator: Palette,
  student: GraduationCap,
  workstation: Cpu,
  "2-in-1": Tablet,
  "home use": Home,
}

function getCategoryIcon(name) {
  return CATEGORY_ICONS[name?.trim().toLowerCase()]
}

function SelectByCategory() {
  const navigate = useNavigate()
  const { handleGetAllCategories } = useCategory()
  const { categoryData } = useSelector((state) => state.category)

  useEffect(() => {
    handleGetAllCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categories = Array.isArray(categoryData) ? categoryData : []

  if (categories.length === 0) return null

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <h2 className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">Shop by Category</h2>
      <hr className="mt-4 border-neutral sm:mt-6" />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            name={category.name}
            icon={getCategoryIcon(category.name)}
            onClick={() =>
              navigate(
                `/search?categoryId=${category._id}&categoryName=${encodeURIComponent(category.name)}`
              )
            }
          />
        ))}
      </div>
    </section>
  )
}

export default SelectByCategory
