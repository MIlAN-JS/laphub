import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { Cpu, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import useLaptop from "../../hook/useLaptop.js"
import LaptopCard from "../../../../components/ui/LaptopCard.jsx"

const LIMIT = 12

function LaptopCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md border border-ink/20">
      <div className="aspect-4/3 bg-ink/10" />
      <div className="space-y-2 px-4 py-4">
        <div className="h-3.5 w-2/3 rounded bg-ink/10" />
        <div className="h-5 w-1/3 rounded bg-ink/10" />
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: LIMIT }).map((_, i) => (
        <LaptopCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3 rounded-md border border-accent/40 bg-accent/10 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-accent">
        <AlertCircle size={16} />
        {message}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  )
}

function EmptyState({ heading }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-md border border-ink py-16 text-center">
      <Cpu size={28} className="mb-3 text-neutral" />
      <p className="text-sm text-neutral">No laptops found for {heading.toLowerCase()}.</p>
    </div>
  )
}

function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="flex items-center gap-1.5 rounded-md border border-ink px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Prev
      </button>
      <span className="text-sm text-neutral">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="flex items-center gap-1.5 rounded-md border border-ink px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get("q") || ""
  const brand = searchParams.get("brand") || ""
  const categoryId = searchParams.get("categoryId") || ""
  const categoryName = searchParams.get("categoryName") || ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)

  const { handleSearchLaptops } = useLaptop()
  const { laptopData, isLoading, error } = useSelector((state) => state.laptop)
  const [pagination, setPagination] = useState(null)

  const runSearch = () => {
    handleSearchLaptops({ q, brand, categoryId, page, limit: LIMIT }).then(
      (result) => setPagination(result ?? null)
    )
  }

  useEffect(() => {
    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, brand, categoryId, page])

  const laptops = Array.isArray(laptopData) ? laptopData : []

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(nextPage))
    setSearchParams(next)
  }

  const heading = q
    ? `Results for "${q}"`
    : brand
    ? `${brand} laptops`
    : categoryName
    ? `${categoryName} laptops`
    : "All laptops"

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">{heading}</h1>
      <hr className="mt-4 border-neutral sm:mt-6" />

      {error && !isLoading && <ErrorBanner message={error} onRetry={runSearch} />}

      {isLoading && <LoadingGrid />}

      {!isLoading && !error && laptops.length === 0 && <EmptyState heading={heading} />}

      {!isLoading && !error && laptops.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {laptops.map((laptop) => (
              <LaptopCard key={laptop._id} laptop={laptop} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={pagination?.totalPages ?? 1}
            onPrev={() => goToPage(page - 1)}
            onNext={() => goToPage(page + 1)}
          />
        </>
      )}
    </section>
  )
}
