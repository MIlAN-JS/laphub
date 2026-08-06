import React, { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi"
import useCart from "../../features/cart/hook/useCart"

function CartIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const hasFetchedRef = useRef(false)

  const { handleGetCart } = useCart()
  const { cartData, isLoading, error } = useSelector((state) => state.cart)

  const items = cartData?.items || []

  const handleMouseEnter = () => {
    setIsOpen(true)
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      handleGetCart()
    }
  }

  const handleMouseLeave = () => setIsOpen(false)

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="/cart" className="relative flex items-center text-ink hover:text-olive transition-colors">
        <FiShoppingCart size={22} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
            {items.length}
          </span>
        )}
      </Link>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md border border-neutral bg-white p-5 shadow-lg z-50">
          <h3 className="text-base font-bold text-ink">Shopping cart</h3>

          {isLoading && <p className="mt-4 text-sm text-neutral">Loading...</p>}

          {!isLoading && error && <p className="mt-4 text-sm text-accent">{error}</p>}

          {!isLoading && !error && items.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-6">
              <FiShoppingCart size={40} className="text-neutral" />
              <p className="text-sm font-medium text-ink">Your cart is empty</p>
            </div>
          )}

          {!isLoading && !error && items.length > 0 && (
            <ul className="mt-4 flex max-h-64 flex-col gap-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.variantId?._id || item.variantId} className="flex items-center gap-3">
                  <img
                    src={item.variantId?.images?.[0]}
                    alt={item.variantId?.color}
                    className="h-12 w-12 rounded object-cover bg-cream"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-ink">
                      {item.variantId?.color} · {item.variantId?.ram} · {item.variantId?.storage}
                    </p>
                    <p className="text-xs text-neutral">
                      Qty {item.quantity} · {item.price?.currency} {item.price?.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/cart"
            className="mt-5 block w-full rounded-full border border-ink py-2 text-center text-sm font-semibold text-ink hover:bg-cream transition-colors"
          >
            Go to cart
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartIcon
