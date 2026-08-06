import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiCpu,
  FiAlertCircle,
  FiRefreshCw,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import useLaptop from "../../hook/useLaptop";

const LIMIT = 12;

function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const windowSize = 1; // pages shown on either side of current

  const start = Math.max(1, currentPage - windowSize);
  const end = Math.min(totalPages, currentPage + windowSize);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

export default function Home() {
  // handleGetLaptops is called as handleGetLaptops({ page, limit }).
  const { handleGetLaptops } = useLaptop();

  // totalPages is assumed to come back alongside laptopData from your API/
  // reducer (a common pattern: { laptopData, totalPages, error, isLoading }).
  // If your slice doesn't expose totalPages yet, tell me and I'll fall back
  // to a "Next disabled once a short page comes back" heuristic instead.
  const { laptopData, totalPages, error, isLoading } = useSelector(
    (state) => state.laptop
  );


  const [page, setPage] = useState(1);

  useEffect(() => {
    handleGetLaptops({ page, limit: LIMIT });
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const navigate = useNavigate();

  const laptops = Array.isArray(laptopData) ? laptopData : [];
  const safeTotalPages = totalPages || 1;

  const goToPage = (target) => {
    if (target < 1 || target > safeTotalPages || target === page) return;
    setPage(target);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <FiCpu className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              All laptops
            </h1>
            <p className="text-xs text-[#64748B]">
              Browse every laptop listed on LapHub
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error */}
        {error && !isLoading && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-[#F97316]">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
            <button
              type="button"
              onClick={() => handleGetLaptops({ page, limit: LIMIT })}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] shrink-0 transition"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-[#E2E8F0]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-full bg-[#E2E8F0] rounded" />
                  <div className="h-3 w-2/3 bg-[#E2E8F0] rounded" />
                  <div className="h-3.5 w-1/2 bg-[#E2E8F0] rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && laptops.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-[#E2E8F0] rounded-2xl py-16 px-6">
            <div className="w-14 h-14 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-4">
              <FiPackage className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A] mb-1">
              No laptops available right now
            </h3>
            <p className="text-sm text-[#64748B] max-w-sm">
              Check back soon — new listings show up here as sellers add them.
            </p>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && laptops.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {laptops.map((laptop) => (
                <div
                  key={laptop._id}
                  onClick={() => navigate(`/laptop/detail/${laptop._id}`)}
                  className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2563EB]/40 transition group cursor-pointer"
                >
                  <div className="aspect-square bg-[#F8FAFC] overflow-hidden">
                    {laptop.thumbnail ? (
                      <img
                        src={laptop.thumbnail}
                        alt={laptop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                        <FiCpu className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-[11px] font-medium text-[#2563EB] uppercase tracking-wide mb-0.5 truncate">
                      {laptop.brand}
                    </p>
                    <h3 className="text-sm text-[#0F172A] line-clamp-2 leading-snug">
                      {laptop.title}
                    </h3>

                    {/* Price row — only rendered if your API includes a
                        price on the laptop object (e.g. from its default
                        variant). Remove this block if it never applies. */}
                    {(laptop.price ?? laptop.startingPrice) != null && (
                      <p className="text-sm font-bold text-[#F97316] mt-1.5">
                        ₹
                        {Number(
                          laptop.price ?? laptop.startingPrice
                        ).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {safeTotalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Previous page"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers(page, safeTotalPages).map((item, i) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-9 h-9 flex items-center justify-center text-sm text-[#64748B]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                        item === page
                          ? "bg-[#2563EB] text-white"
                          : "border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === safeTotalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Next page"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}