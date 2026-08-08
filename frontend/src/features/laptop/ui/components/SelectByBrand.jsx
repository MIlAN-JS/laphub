import React from "react"
import BrandCard from "../../../../components/ui/BrandCard"
import apple from "../../../../assets/brandAssets/apple.png"
import dell from "../../../../assets/brandAssets/dell.png"
import hp from "../../../../assets/brandAssets/hp.png"
import lenovo from "../../../../assets/brandAssets/lenovo.png"
import asus from "../../../../assets/brandAssets/asus.png"
import acer from "../../../../assets/brandAssets/acer.png"
import samsung from "../../../../assets/brandAssets/samsung.png"
import msi from "../../../../assets/brandAssets/msi.png"

const BRANDS = [
  { name: "Apple", logo: apple },
  { name: "Dell", logo: dell },
  { name: "HP", logo: hp },
  { name: "Lenovo", logo: lenovo },
  { name: "ASUS", logo: asus },
  { name: "Acer", logo: acer },
  { name: "Samsung", logo: samsung },
  { name: "MSI", logo: msi },
]

function SelectByBrand() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <h2 className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">Select By Brand</h2>
      <hr className="mt-4 border-neutral sm:mt-6" />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {BRANDS.map((brand) => (
          <BrandCard key={brand.name} name={brand.name} logo={brand.logo} />
        ))}
      </div>
    </section>
  )
}

export default SelectByBrand
