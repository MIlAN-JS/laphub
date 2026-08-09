import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPlus, FiCpu, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import useLaptop from "../../hook/useLaptop.js";

const STOCK_STYLES = {
  in_stock: "bg-[#22C55E]/10 text-[#22C55E]",
  low_stock: "bg-[#F97316]/10 text-[#F97316]",
  out_of_stock: "bg-[#F97316]/10 text-[#F97316]",
};

function getStockInfo(variants) {
  const list = Array.isArray(variants) ? variants : [];
  const totalStock = list.reduce((sum, variant) => sum + (variant.stock || 0), 0);

  if (totalStock === 0) {
    return { label: "Out of stock", style: STOCK_STYLES.out_of_stock };
  }
  if (totalStock <= 5) {
    return { label: `Low stock · ${totalStock}`, style: STOCK_STYLES.low_stock };
  }
  return { label: `In stock · ${totalStock}`, style: STOCK_STYLES.in_stock };
}

function getDisplayPrice(variants) {
  const list = Array.isArray(variants) ? variants : [];
  const defaultVariant = list.find((variant) => variant.isDefaultVariant) || list[0];
  if (!defaultVariant?.price) return null;
  return `${defaultVariant.price.currency} ${defaultVariant.price.price}`;
}

const ManageLaptopsPage = () => {
  const { handleGetSellerLaptops } = useLaptop();
  const { sellerLaptops, isLoading, error } = useSelector((state) => state.laptop);

  useEffect(() => {
    handleGetSellerLaptops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const laptops = useMemo(
    () => (Array.isArray(sellerLaptops) ? sellerLaptops : []),
    [sellerLaptops]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-2xl shadow-sm px-5 py-4">
        <h1 className="text-lg font-semibold text-[#0F172A]">Manage your laptops</h1>
        <Link
          to="/create-laptop"
          className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          Add
        </Link>
      </div>

      {error && !isLoading && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#F97316]">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
          <button
            type="button"
            onClick={handleGetSellerLaptops}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] shrink-0 transition"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-[#E2E8F0]" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 w-2/3 bg-[#E2E8F0] rounded" />
                <div className="h-3 w-1/3 bg-[#E2E8F0] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : laptops.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-white border border-[#E2E8F0] rounded-2xl py-16 px-6">
          <div className="w-14 h-14 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-4">
            <FiCpu className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h3 className="text-base font-semibold text-[#0F172A] mb-1">No laptops listed yet</h3>
          <p className="text-sm text-[#64748B] max-w-sm mb-5">
            Once you list a laptop, it&apos;ll show up here for you to manage.
          </p>
          <Link
            to="/create-laptop"
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add your first laptop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {laptops.map((laptop) => {
            const stockInfo = getStockInfo(laptop.variants);
            const price = getDisplayPrice(laptop.variants);

            return (
              <Link
                key={laptop._id}
                to={`/laptop/view/${laptop._id}`}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2563EB]/40 transition group"
              >
                <div className="aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
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
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#0F172A] truncate">{laptop.title}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">{laptop.brand}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E8F0]">
                    <span className="text-sm font-semibold text-[#0F172A]">{price ?? "—"}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stockInfo.style}`}
                    >
                      {stockInfo.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageLaptopsPage;
