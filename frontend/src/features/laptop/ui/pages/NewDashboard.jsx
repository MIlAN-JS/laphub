import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FiPackage,
  FiLayers,
  FiBox,
  FiAlertTriangle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import useLaptop from "../../hook/useLaptop.js";

const NewDashboard = () => {
  const { handleGetSellerLaptops } = useLaptop();
  const { sellerLaptops, isLoading, error } = useSelector((state) => state.laptop);

  useEffect(() => {
    handleGetSellerLaptops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const laptops = Array.isArray(sellerLaptops) ? sellerLaptops : [];
    const variants = laptops.flatMap((laptop) => laptop.variants || []);
    const totalStock = variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    const outOfStock = variants.filter(
      (variant) => variant.status === "out_of_stock" || variant.stock === 0
    ).length;

    return {
      totalListings: laptops.length,
      totalVariants: variants.length,
      totalStock,
      outOfStock,
    };
  }, [sellerLaptops]);

  const STATS = [
    { label: "Total listings", value: stats.totalListings, icon: FiPackage, accent: "blue" },
    { label: "Total variants", value: stats.totalVariants, icon: FiLayers, accent: "blue" },
    { label: "Units in stock", value: stats.totalStock, icon: FiBox, accent: "blue" },
    { label: "Out of stock", value: stats.outOfStock, icon: FiAlertTriangle, accent: "orange" },
  ];

  const ACCENT_STYLES = {
    blue: { box: "bg-[#2563EB]/10", icon: "text-[#2563EB]" },
    orange: { box: "bg-[#F97316]/10", icon: "text-[#F97316]" },
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 animate-pulse"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E2E8F0] mb-3" />
                <div className="h-6 w-16 bg-[#E2E8F0] rounded mb-2" />
                <div className="h-3 w-24 bg-[#E2E8F0] rounded" />
              </div>
            ))
          : STATS.map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${ACCENT_STYLES[accent].box} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${ACCENT_STYLES[accent].icon}`} />
                </div>
                <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
                <p className="text-sm text-[#64748B] mt-0.5">{label}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default NewDashboard;
