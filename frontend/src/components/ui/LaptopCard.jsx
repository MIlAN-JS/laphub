import React from "react"
import { useNavigate } from "react-router-dom"
import { Cpu } from "lucide-react"

const CURRENCY_SYMBOL = {
  NPR: "Rs.",
  USD: "$",
  EUR: "€",
}

function formatPrice(price, currency) {
  if (price === null || price === undefined) return null
  const symbol = CURRENCY_SYMBOL[currency] || ""
  return `${symbol} ${Number(price).toLocaleString("en-IN")}`.trim()
}

function LaptopCard({ laptop }) {
  const navigate = useNavigate()
  const variant =
    laptop.variants?.find((v) => v.isDefaultVariant) || laptop.variants?.[0]
  const priceLabel = formatPrice(variant?.price?.price, variant?.price?.currency)

  return (
    <div
      onClick={() => navigate(`/laptop/detail/${laptop._id}`)}
      className="cursor-pointer overflow-hidden rounded-md border border-ink bg-white transition hover:shadow-md"
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-white p-2 ">
        {laptop.thumbnail ? (
          <img
            src={laptop.thumbnail}
            alt={laptop.title}
            className="h-full w-full object-cover object-top rounded-lg"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral">
            <Cpu size={32} />
          </div>
        )}
      </div>
      <div className="px-4 py-4">
        <h3 className="line-clamp-2 text-sm font-bold text-ink sm:text-base">
          {laptop.title}
        </h3>
        {priceLabel && (
          <p className="mt-2 text-lg font-bold text-accent sm:text-xl">
            {priceLabel}
          </p>
        )}
      </div>
    </div>
  )
}

export default LaptopCard
