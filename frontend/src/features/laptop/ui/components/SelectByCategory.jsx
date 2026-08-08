import React from "react"
import { Gamepad2, Briefcase, Laptop, Palette, GraduationCap, Cpu, Tablet, Home } from "lucide-react"
import CategoryCard from "../../../../components/ui/CategoryCard"

const CATEGORIES = [
  { name: "Gaming", icon: Gamepad2, image: "https://picsum.photos/seed/laphub-gaming/600/400" },
  { name: "Business", icon: Briefcase, image: "https://picsum.photos/seed/laphub-business/600/400" },
  { name: "Ultrabook", icon: Laptop, image: "https://picsum.photos/seed/laphub-ultrabook/600/400" },
  { name: "Creator", icon: Palette, image: "https://picsum.photos/seed/laphub-creator/600/400" },
  { name: "Student", icon: GraduationCap, image: "https://picsum.photos/seed/laphub-student/600/400" },
  { name: "Workstation", icon: Cpu, image: "https://picsum.photos/seed/laphub-workstation/600/400" },
  { name: "2-in-1", icon: Tablet, image: "https://picsum.photos/seed/laphub-2in1/600/400" },
  { name: "Home Use", icon: Home, image: "https://picsum.photos/seed/laphub-home/600/400" },
]

function SelectByCategory() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <h2 className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">Shop by Category</h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            icon={category.icon}
            image={category.image}
          />
        ))}
      </div>
    </section>
  )
}

export default SelectByCategory
