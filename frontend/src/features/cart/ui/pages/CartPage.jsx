import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiTrash2 } from "react-icons/fi"
import useCart from "../../hook/useCart"

function CartPage() {
  const { handleGetCart, handleRemoveCartItem } = useCart()
  const { cartData, isLoading, error } = useSelector((state) => state.cart)

  const items = cartData?.items || []

  const [removingItemId, setRemovingItemId] = useState(null)
  const [removeError, setRemoveError] = useState(null)

  useEffect(() => {
    handleGetCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRemove = async (itemId) => {
    setRemoveError(null)
    setRemovingItemId(itemId)
    try {
      await handleRemoveCartItem(itemId)
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Could not remove item"
      setRemoveError(message)
    } finally {
      setRemovingItemId(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink">Your Cart</h1>

      {isLoading && <p className="mt-6 text-sm text-neutral">Loading...</p>}

      {!isLoading && error && <p className="mt-6 text-sm text-accent">{error}</p>}

      {removeError && <p className="mt-6 text-sm text-accent">{removeError}</p>}

      {!isLoading && !error && items.length === 0 && (
        <p className="mt-6 text-sm text-neutral">Your cart is empty.</p>
      )}

      {!isLoading && !error && items.length > 0 && (
        <ul className="mt-6 flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-4 rounded-md border border-neutral p-3"
            >
              <img
                src={item.variantId?.images?.[0]}
                alt={item.variantId?.color}
                className="h-16 w-16 rounded object-cover bg-cream"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">
                  {item.variantId?.color} · {item.variantId?.ram} · {item.variantId?.storage}
                </p>
                <p className="text-sm text-neutral">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-ink">
                {item.price?.currency} {item.price?.price}
              </p>
              <button
                type="button"
                onClick={() => handleRemove(item._id)}
                disabled={removingItemId === item._id}
                className="text-neutral hover:text-accent disabled:opacity-50 transition-colors"
                aria-label="Remove item"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CartPage
