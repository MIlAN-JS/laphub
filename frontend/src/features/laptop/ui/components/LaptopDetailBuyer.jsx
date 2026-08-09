import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiRefreshCw,
  FiCpu,
  FiMonitor,
  FiBatteryCharging,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import useLaptop from "../../hook/useLaptop.js";

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];

function isVideo(url = "") {
  return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
}

function formatPrice(price) {
  if (!price || price.price === null || price.price === undefined || price.price === "")
    return "—";
  return `${price.currency} ${Number(price.price).toLocaleString("en-IN")}`;
}

export default function LaptopDetailBuyer() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { handleGetLaptopDetail } = useLaptop();
  const { laptopData, error, isLoading } = useSelector((state) => state.laptop);
  const { user } = useSelector((state) => state.auth);

  const laptop = Array.isArray(laptopData) ? laptopData[0] : laptopData;

  const isOwner = Boolean(
    user && laptop && String(user._id) === String(laptop.seller)
  );

  const [selectedColorOverride, setSelectedColorOverride] = useState(null);
  const [selectedVariantIdOverride, setSelectedVariantIdOverride] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (productId) handleGetLaptopDetail(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Redirect sellers viewing their own listing to the management view.
  useEffect(() => {
    if (isOwner) {
      navigate(`/laptop/view/${productId}`, { replace: true });
    }
  }, [isOwner, navigate, productId]);

  const variants = useMemo(() => laptop?.variants || [], [laptop]);

  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter(Boolean))],
    [variants]
  );

  const defaultVariant = useMemo(
    () => variants.find((v) => v.isDefaultVariant) || variants[0] || null,
    [variants]
  );

  const selectedColor = selectedColorOverride ?? defaultVariant?.color ?? null;

  const variantsForColor = useMemo(
    () => variants.filter((v) => v.color === selectedColor),
    [variants, selectedColor]
  );

  const selectedVariant =
    variantsForColor.find((v) => v._id === selectedVariantIdOverride) ||
    variantsForColor[0] ||
    defaultVariant;

  // Reset gallery/quantity whenever the selected variant changes, without an
  // effect (see https://react.dev/learn/you-might-not-need-an-effect).
  const [lastVariantId, setLastVariantId] = useState(selectedVariant?._id ?? null);
  if (selectedVariant?._id !== lastVariantId) {
    setLastVariantId(selectedVariant?._id ?? null);
    setActiveImage(0);
    setQuantity(1);
  }

  const handleSelectColor = (color) => {
    setSelectedColorOverride(color);
    setSelectedVariantIdOverride(null);
  };

  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : laptop?.thumbnail
    ? [laptop.thumbnail]
    : [];

  const inStock = (selectedVariant?.stock ?? 0) > 0;

  const discountPercent =
    selectedVariant?.compareAtPrice && selectedVariant?.price?.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : 0;

  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQuantity = () =>
    setQuantity((q) => Math.min(selectedVariant?.stock ?? 1, q + 1));

  if (isOwner) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] mb-5 transition"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>

        {error && !isLoading && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-[#F97316]">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
            <button
              type="button"
              onClick={() => productId && handleGetLaptopDetail(productId)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] shrink-0 transition"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl bg-[#E2E8F0]" />
            <div className="space-y-3 py-2">
              <div className="h-3 w-1/4 bg-[#E2E8F0] rounded" />
              <div className="h-6 w-3/4 bg-[#E2E8F0] rounded" />
              <div className="h-8 w-1/3 bg-[#E2E8F0] rounded mt-4" />
              <div className="h-24 w-full bg-[#E2E8F0] rounded mt-6" />
            </div>
          </div>
        )}

        {!isLoading && !error && laptop && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white flex items-center justify-center">
                {images[activeImage] ? (
                  isVideo(images[activeImage]) ? (
                    <video
                      src={images[activeImage]}
                      className="w-full h-full object-contain"
                      controls
                      muted
                    />
                  ) : (
                    <img
                      src={images[activeImage]}
                      alt={laptop.title}
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <FiCpu className="w-12 h-12 text-[#64748B]" />
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border ${
                        activeImage === i
                          ? "border-[#2563EB]"
                          : "border-[#E2E8F0]"
                      }`}
                    >
                      {isVideo(url) ? (
                        <video src={url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img
                          src={url}
                          alt={`${laptop.title} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide mb-1">
                {laptop.brand}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] break-words">
                {laptop.title}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-bold text-[#0F172A]">
                  {formatPrice(selectedVariant?.price)}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-sm text-[#64748B] line-through">
                      {selectedVariant?.price?.currency}{" "}
                      {Number(selectedVariant.compareAtPrice).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-semibold text-[#22C55E]">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {colors.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-medium text-[#334155] mb-2">
                    Color{selectedColor ? `: ${selectedColor}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`text-sm px-3.5 py-2 rounded-lg border font-medium transition ${
                          selectedColor === color
                            ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                            : "border-[#E2E8F0] text-[#334155] hover:border-[#2563EB]/40"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {variantsForColor.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-medium text-[#334155] mb-2">
                    Configuration
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variantsForColor.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => setSelectedVariantIdOverride(v._id)}
                        disabled={v.stock <= 0}
                        className={`text-sm px-3.5 py-2 rounded-lg border font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${
                          selectedVariant?._id === v._id
                            ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                            : "border-[#E2E8F0] text-[#334155] hover:border-[#2563EB]/40"
                        }`}
                      >
                        {v.ram} · {v.storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center gap-2 text-sm">
                {inStock ? (
                  <span className="flex items-center gap-1.5 text-[#22C55E] font-medium">
                    <FiCheckCircle className="w-4 h-4" />
                    In stock ({selectedVariant.stock} available)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#F97316] font-medium">
                    <FiXCircle className="w-4 h-4" />
                    Out of stock
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-5">
                <span className="text-sm font-medium text-[#334155]">Quantity</span>
                <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    disabled={!inStock || quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-[#334155] disabled:opacity-40 hover:bg-[#F8FAFC] transition"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-[#0F172A]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    disabled={!inStock || quantity >= (selectedVariant?.stock ?? 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#334155] disabled:opacity-40 hover:bg-[#F8FAFC] transition"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  disabled={!inStock}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-3 rounded-lg transition shadow-sm"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  disabled={!inStock}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold px-5 py-3 rounded-lg transition"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] space-y-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#334155]">
                  <span className="flex items-center gap-1.5">
                    <FiMonitor className="w-4 h-4 text-[#64748B]" />
                    {laptop.display}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiBatteryCharging className="w-4 h-4 text-[#64748B]" />
                    {laptop.battery}
                  </span>
                </div>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  {laptop.description}
                </p>

                {laptop.sellerInfo && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                    <div className="w-9 h-9 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                      <FiShoppingBag className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#64748B]">Sold by</p>
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {laptop.sellerInfo.storeName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
