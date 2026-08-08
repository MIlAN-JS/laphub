import React, { useEffect, useRef, useState } from "react"
import { FiSearch } from "react-icons/fi"
import useDebounce from "../../hooks/useDebounce"
import { searchProducts } from "./search.service.js"

function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const debouncedQuery = useDebounce(query, 400)
  const abortControllerRef = useRef(null)
  const containerRef = useRef(null)

  const runSearch = async (searchTerm) => {
    const trimmed = searchTerm.trim()

    abortControllerRef.current?.abort()

    if (!trimmed) {
      setResults([])
      setError(null)
      setIsLoading(false)
      setIsOpen(false)
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    setIsOpen(true)

    try {
      const products = await searchProducts(trimmed, controller.signal)
      setResults(products)
    } catch (err) {
      if (err.code === "ERR_CANCELED") return
      setError("Something went wrong. Please try again.")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runSearch(debouncedQuery)
    return () => abortControllerRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      runSearch(query)
    } else if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  const showDropdown = isOpen && query.trim().length > 0

  return (
    
    <div ref={containerRef} className="relative flex-1 max-w-150">
      <div className="flex items-center bg-white border border-neutral rounded-md overflow-hidden focus-within:border-olive">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search in Laphub"
          className="flex-1 px-4 py-1 text-sm text-ink placeholder-neutral outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => runSearch(query)}
          aria-label="Search"
          className="px-4 py-2 text-ink hover:text-olive transition-colors"
        >
          <FiSearch size={18} />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading && <p className="px-4 py-3 text-sm text-neutral">Searching...</p>}

          {!isLoading && error && <p className="px-4 py-3 text-sm text-accent">{error}</p>}

          {!isLoading && !error && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-neutral">
              No results found for &quot;{query.trim()}&quot;
            </p>
          )}

          {!isLoading &&
            !error &&
            results.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-cream cursor-pointer"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-10 w-10 object-cover rounded"
                />
                <span className="text-sm text-ink truncate">{product.title}</span>
              </div>
            ))}
        </div>
      )}
    </div>

  )
}

export default SearchBar
