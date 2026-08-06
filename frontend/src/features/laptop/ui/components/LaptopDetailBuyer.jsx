import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCpu,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiBatteryCharging,
  FiMonitor,
  FiShoppingCart,
  FiZap,
} from "react-icons/fi";
import useLaptop from "../../hook/useLaptop.js";

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];

function isVideo(url = "") {
  return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
}

function formatPrice(value) {
  if (value === null || value === undefined) return "—";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function LaptopDetailBuyer() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { handleGetLaptopDetail } = useLaptop();
  const { laptopData, error, isLoading } = useSelector((state) => state.laptop);
  const laptop = Array.isArray(laptopData) ? laptopData[0] : laptopData;

  console.log(laptop , "laptop det in home det")

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const thumbStripRef = useRef(null);

  useEffect(() => {
    if (productId) handleGetLaptopDetail(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // pick the default variant (or the first one) once the laptop loads
  useEffect(() => {
    if (!laptop?.variants?.length) return;
    const defaultVariant =
      laptop.variants.find((v) => v.isDefaultVariant) || laptop.variants[0];
    setSelectedVariantId(defaultVariant._id);
  }, [laptop]);

  const selectedVariant = useMemo(
    () => laptop?.variants?.find((v) => v._id === selectedVariantId) || null,
    [laptop, selectedVariantId]
  );

  // gallery = thumbnail + this variant's own images/videos
  const gallery = useMemo(() => {
    const items = [];
    if (laptop?.thumbnail) items.push(laptop.thumbnail);
    if (selectedVariant?.images?.length) items.push(...selectedVariant.images);
    return items;
  }, [laptop, selectedVariant]);

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [selectedVariantId]);

  const handleSelectVariant = (variantId) => {
    setSelectedVariantId(variantId);
  };

  const scrollThumbs = (direction) => {
    thumbStripRef.current?.scrollBy({
      left: direction === "right" ? 160 : -160,
      behavior: "smooth",
    });
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () =>
    setQuantity((q) => Math.min(selectedVariant?.stock || 1, q + 1));

  const handleAddToCart = () => {
    // Wire this up to your actual cart hook/state.
    console.log("Add to cart:", {
      productId: laptop?._id,
      variantId: selectedVariant?._id,
      quantity,
    });
  };

  const handleBuyNow = () => {
    // Wire this up to your actual checkout flow.
    console.log("Buy now:", {
      productId: laptop?._id,
      variantId: selectedVariant?._id,
      quantity,
    });
  };

  const discountPercent =
    selectedVariant?.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : null;

  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;
  const isLowStock =
    selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Error */}
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

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-[#E2E8F0] rounded-2xl" />
            <div className="space-y-3 py-2">
              <div className="h-6 w-3/4 bg-[#E2E8F0] rounded" />
              <div className="h-4 w-1/2 bg-[#E2E8F0] rounded" />
              <div className="h-10 w-1/3 bg-[#E2E8F0] rounded mt-4" />
              <div className="h-24 w-full bg-[#E2E8F0] rounded mt-4" />
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && laptop && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* -------- Left: gallery -------- */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5">
              <div className="aspect-square rounded-xl bg-[#F8FAFC] overflow-hidden flex items-center justify-center mb-4">
                {gallery.length > 0 ? (
                  isVideo(gallery[selectedImageIndex]) ? (
                    <video
                      src={gallery[selectedImageIndex]}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <img
                      src={gallery[selectedImageIndex]}
                      alt={laptop.title}
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <FiCpu className="w-16 h-16 text-[#64748B]" />
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollThumbs("left")}
                    className="shrink-0 w-7 h-7 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition"
                    aria-label="Scroll thumbnails left"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>

                  <div
                    ref={thumbStripRef}
                    className="flex-1 flex gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
                  >
                    {gallery.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImageIndex(i)}
                        className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                          selectedImageIndex === i
                            ? "border-[#2563EB]"
                            : "border-[#E2E8F0] hover:border-[#2563EB]/40"
                        }`}
                      >
                        {isVideo(url) ? (
                          <video src={url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img
                            src={url}
                            alt={`Thumbnail ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollThumbs("right")}
                    className="shrink-0 w-7 h-7 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition"
                    aria-label="Scroll thumbnails right"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* feature strip, built from fields your schema actually has */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[#E2E8F0]">
                <div className="flex flex-col items-center text-center gap-1.5 px-2">
                  <FiBatteryCharging className="w-6 h-6 text-[#22C55E]" />
                  <p className="text-xs text-[#334155] font-medium">
                    {laptop.battery || "—"}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 px-2">
                  <FiMonitor className="w-6 h-6 text-[#2563EB]" />
                  <p className="text-xs text-[#334155] font-medium">
                    {laptop.display || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* -------- Right: info -------- */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                  {laptop.title}
                </h1>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition"
                    aria-label="Share"
                  >
                    <FiShare2 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWishlisted((prev) => !prev)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition ${
                      isWishlisted
                        ? "text-[#F97316]"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    }`}
                    aria-label="Wishlist"
                  >
                    <FiHeart
                      className="w-4.5 h-4.5"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                {laptop.description}
              </p>

              <div className="flex items-center gap-2 text-sm mt-4">
                <span className="text-[#64748B]">Brand:</span>
                <span className="font-semibold text-[#2563EB]">
                  {laptop.brand}
                </span>
              </div>

              <div className="border-t border-[#E2E8F0] my-5" />

              {/* Price */}
              {selectedVariant && (
                <div className="flex items-end gap-3 flex-wrap">
                  <p className="text-3xl font-bold text-[#F97316]">
                    {formatPrice(selectedVariant.price)}
                  </p>
                  {discountPercent && (
                    <>
                      <p className="text-base text-[#64748B] line-through mb-1">
                        {formatPrice(selectedVariant.compareAtPrice)}
                      </p>
                      <span className="text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-full mb-1">
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Variant selection */}
              {laptop.variants?.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-[#334155] mb-2.5">
                    Choose an option
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {laptop.variants.map((variant) => {
                      const isSelected = variant._id === selectedVariantId;
                      const isSoldOut = variant.stock <= 0;
                      return (
                        <button
                          key={variant._id}
                          type="button"
                          onClick={() => handleSelectVariant(variant._id)}
                          disabled={isSoldOut}
                          className={`text-left px-3.5 py-2 rounded-lg border text-xs font-medium transition ${
                            isSelected
                              ? "border-[#2563EB] bg-[#2563EB]/5 text-[#0F172A]"
                              : "border-[#E2E8F0] text-[#334155] hover:border-[#2563EB]/40"
                          } ${isSoldOut ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          {variant.color} · {variant.ram} / {variant.storage}
                          {isSoldOut && (
                            <span className="block text-[10px] text-[#F97316] mt-0.5">
                              Sold out
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {selectedVariant && !isOutOfStock && (
                <div className="mt-6 flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-[#334155] mb-2">
                      Quantity
                    </p>
                    <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                      <button
                        type="button"
                        onClick={decreaseQty}
                        disabled={quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center text-[#334155] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-[#0F172A]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={increaseQty}
                        disabled={quantity >= selectedVariant.stock}
                        className="w-9 h-9 flex items-center justify-center text-[#334155] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isLowStock && (
                    <p className="text-xs font-medium text-[#F97316]">
                      Only {selectedVariant.stock} left — order soon!
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition shadow-sm"
                >
                  <FiZap className="w-4 h-4" />
                  {isOutOfStock ? "Out of stock" : "Buy now"}
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition shadow-sm"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}