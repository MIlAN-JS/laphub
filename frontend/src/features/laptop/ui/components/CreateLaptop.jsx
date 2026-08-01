import { useState, useRef } from "react";
import  useLaptop from "../../hook/useLaptop.js";
import {
  FiUpload,
  FiX,
  FiPlus,
  FiTrash2,
  FiCpu,
  FiTag,
  FiMonitor,
  FiBatteryCharging,
  FiType,
  FiAlignLeft,
  FiHash,
  FiPackage,
  FiStar,
  FiImage,
  FiDollarSign,
  FiLoader,
  FiEye,
  FiEdit2,
  FiCheckCircle,
} from "react-icons/fi";

const MAX_VARIANT_IMAGES = 5;

const STATUS_OPTIONS = ["active", "inactive", "draft"];

function makeEmptyVariant(isDefaultVariant = false) {
  return {
    color: "",
    ram: "",
    storage: "",
    price: "",
    stock: "",
    sku: "",
    status: "active",
    isDefaultVariant,
    imageCount: 0,
  };
}

export default function CreatelaptopComponent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    battery: "",
    brand: "",
    display: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [variants, setVariants] = useState([makeEmptyVariant(true)]);
  // Parallel array to `variants` — variantImage[i] holds the File objects
  // for variants[i]. Kept under one key ("variantImage") as requested,
  // rather than a separate key per variant.
  const [variantImage, setVariantImage] = useState([[]]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const thumbnailInputRef = useRef(null);
  const variantImageInputRefs = useRef([]);

  // ---------- basic fields ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- thumbnail ----------
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  // ---------- variants ----------
  const addVariant = () => {
    setVariants((prev) => [...prev, makeEmptyVariant(false)]);
    setVariantImage((prev) => [...prev, []]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return; // always keep at least one variant

    setVariants((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // if we removed the default variant, promote the first remaining one
      if (prev[index].isDefaultVariant && next.length > 0) {
        next[0] = { ...next[0], isDefaultVariant: true };
      }
      return next;
    });
    setVariantImage((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantFieldChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const setDefaultVariant = (index) => {
    setVariants((prev) =>
      prev.map((variant, i) => ({
        ...variant,
        isDefaultVariant: i === index,
      }))
    );
  };

  // ---------- variant images ----------
  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setVariantImage((prev) => {
      const next = [...prev];
      const existing = next[index] || [];
      const merged = [...existing, ...files].slice(0, MAX_VARIANT_IMAGES);
      next[index] = merged;

      setVariants((prevVariants) =>
        prevVariants.map((variant, i) =>
          i === index ? { ...variant, imageCount: merged.length } : variant
        )
      );

      return next;
    });

    // reset the input so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariantImage((prev) => {
      const next = [...prev];
      const updated = next[variantIndex].filter((_, i) => i !== imageIndex);
      next[variantIndex] = updated;

      setVariants((prevVariants) =>
        prevVariants.map((variant, i) =>
          i === variantIndex
            ? { ...variant, imageCount: updated.length }
            : variant
        )
      );

      return next;
    });
  };

  // ---------- submit ----------
  const openPreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const { handleCreateLaptop } = useLaptop();

  // --------- confirm submit ----------
  const handleConfirmSubmit = async() => {
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      battery: formData.battery,
      brand: formData.brand,
      display: formData.display,
      thumbnail,
      variants,
      variantImage,
    };

    
    await handleCreateLaptop(payload);
    console.log("New laptop payload:", payload);
    setIsSubmitting(false);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <FiCpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              List a new laptop
            </h1>
            <p className="text-sm text-[#64748B]">
              Fill in the details buyers will see on LapHub.
            </p>
          </div>
        </div>

        <form onSubmit={openPreview} className="space-y-6">
          {/* ---------------- Basic info ---------------- */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#0F172A] mb-4">
              Basic information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Title
                </label>
                <div className="relative">
                  <FiType className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. MacBook Pro 14-inch M3"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Brand
                </label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    placeholder="e.g. Apple"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>

              {/* Display */}
              <div>
                <label
                  htmlFor="display"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Display
                </label>
                <div className="relative">
                  <FiMonitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="display"
                    name="display"
                    type="text"
                    placeholder="e.g. 14.2-inch Liquid Retina XDR"
                    value={formData.display}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>

              {/* Battery */}
              <div>
                <label
                  htmlFor="battery"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Battery
                </label>
                <div className="relative">
                  <FiBatteryCharging className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="battery"
                    name="battery"
                    type="text"
                    placeholder="e.g. Up to 18 hours"
                    value={formData.battery}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Description
                </label>
                <div className="relative">
                  <FiAlignLeft className="absolute left-3 top-3 w-4.5 h-4.5 text-[#64748B]" />
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe the condition, specs, and anything a buyer should know..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition resize-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Thumbnail ---------------- */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#0F172A] mb-1">
              Thumbnail
            </h2>
            <p className="text-sm text-[#64748B] mb-4">
              The main image shown in listings and search results.
            </p>

            {thumbnailPreview ? (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-[#E2E8F0]">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#0F172A]/70 hover:bg-[#0F172A] text-white flex items-center justify-center transition"
                  aria-label="Remove thumbnail"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-40 h-40 rounded-xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2 text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#2563EB]/[0.03] transition"
              >
                <FiUpload className="w-6 h-6" />
                <span className="text-xs font-medium">Upload image</span>
              </button>
            )}

            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
          </section>

          {/* ---------------- Variants ---------------- */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Variants
                </h2>
                <p className="text-sm text-[#64748B]">
                  Different configurations of this laptop — color, RAM, storage, price.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 shrink-0 bg-[#2563EB]/10 hover:bg-[#2563EB]/15 text-[#2563EB] text-sm font-medium px-3.5 py-2 rounded-lg transition"
              >
                <FiPlus className="w-4 h-4" />
                Add variant
              </button>
            </div>

            <div className="space-y-5">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-4 sm:p-5 transition ${
                    variant.isDefaultVariant
                      ? "border-[#2563EB] bg-[#2563EB]/[0.03]"
                      : "border-[#E2E8F0]"
                  }`}
                >
                  {/* variant header */}
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setDefaultVariant(index)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition ${
                        variant.isDefaultVariant
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]"
                      }`}
                    >
                      <FiStar className="w-3.5 h-3.5" />
                      {variant.isDefaultVariant ? "Default variant" : "Set as default"}
                    </button>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="flex items-center gap-1 text-xs font-medium text-[#F97316] hover:text-[#EA580C] transition"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* variant fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Space Gray"
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantFieldChange(index, "color", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        RAM
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 16GB"
                        value={variant.ram}
                        onChange={(e) =>
                          handleVariantFieldChange(index, "ram", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        Storage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 512GB SSD"
                        value={variant.storage}
                        onChange={(e) =>
                          handleVariantFieldChange(index, "storage", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <input
                          type="number"
                          min="0"
                          placeholder="89999"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantFieldChange(index, "price", e.target.value)
                          }
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        Stock
                      </label>
                      <div className="relative">
                        <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <input
                          type="number"
                          min="0"
                          placeholder="25"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantFieldChange(index, "stock", e.target.value)
                          }
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        SKU
                      </label>
                      <div className="relative">
                        <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <input
                          type="text"
                          placeholder="e.g. LT-SG-16-512"
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantFieldChange(index, "sku", e.target.value)
                          }
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">
                        Status
                      </label>
                      <select
                        value={variant.status}
                        onChange={(e) =>
                          handleVariantFieldChange(index, "status", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* variant images */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-[#334155]">
                        Images
                      </label>
                      <span className="text-xs text-[#64748B]">
                        {variantImage[index]?.length || 0}/{MAX_VARIANT_IMAGES}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {(variantImage[index] || []).map((file, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E2E8F0] shrink-0"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`${variant.color || "Variant"} image ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imgIndex)}
                            className="absolute top-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-[#0F172A]/70 hover:bg-[#0F172A] text-white flex items-center justify-center transition"
                            aria-label="Remove image"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {(variantImage[index]?.length || 0) < MAX_VARIANT_IMAGES && (
                        <button
                          type="button"
                          onClick={() => variantImageInputRefs.current[index]?.click()}
                          className="w-16 h-16 rounded-lg border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-0.5 text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#2563EB]/[0.03] transition shrink-0"
                        >
                          <FiImage className="w-4 h-4" />
                          <span className="text-[10px] font-medium">Add</span>
                        </button>
                      )}
                    </div>

                    <input
                      ref={(el) => (variantImageInputRefs.current[index] = el)}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleVariantImageChange(index, e)}
                      className="hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Preview trigger ---------------- */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition shadow-sm"
            >
              <FiEye className="w-4 h-4" />
              Preview listing
            </button>
          </div>
        </form>

        {/* ---------------- Preview modal ---------------- */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              {/* modal header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E2E8F0] shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Preview listing
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    This is what you're about to publish. Check it over before confirming.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition shrink-0"
                  aria-label="Close preview"
                >
                  <FiX className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* modal body */}
              <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
                {/* title block */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt={formData.title || "Thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                        <FiImage className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide mb-1">
                      {formData.brand || "Brand not set"}
                    </p>
                    <h3 className="text-lg font-bold text-[#0F172A] break-words">
                      {formData.title || "Untitled laptop"}
                    </h3>
                    <p className="text-sm text-[#64748B] mt-1.5 line-clamp-3">
                      {formData.description || "No description added yet."}
                    </p>
                  </div>
                </div>

                {/* specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#E2E8F0] px-3.5 py-2.5">
                    <p className="text-xs text-[#64748B] flex items-center gap-1.5 mb-0.5">
                      <FiMonitor className="w-3.5 h-3.5" />
                      Display
                    </p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {formData.display || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E2E8F0] px-3.5 py-2.5">
                    <p className="text-xs text-[#64748B] flex items-center gap-1.5 mb-0.5">
                      <FiBatteryCharging className="w-3.5 h-3.5" />
                      Battery
                    </p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {formData.battery || "—"}
                    </p>
                  </div>
                </div>

                {/* variants */}
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] mb-3">
                    Variants ({variants.length})
                  </p>

                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className={`rounded-xl border p-4 ${
                          variant.isDefaultVariant
                            ? "border-[#2563EB] bg-[#2563EB]/[0.03]"
                            : "border-[#E2E8F0]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {variant.color || "Unnamed color"} · {variant.ram || "—"} ·{" "}
                            {variant.storage || "—"}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {variant.isDefaultVariant && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#2563EB] text-white px-2 py-0.5 rounded-full">
                                <FiStar className="w-2.5 h-2.5" />
                                Default
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                variant.status === "active"
                                  ? "bg-[#22C55E]/10 text-[#22C55E]"
                                  : variant.status === "draft"
                                  ? "bg-[#64748B]/10 text-[#64748B]"
                                  : "bg-[#F97316]/10 text-[#F97316]"
                              }`}
                            >
                              {variant.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-xs text-[#64748B]">Price</p>
                            <p className="font-medium text-[#0F172A]">
                              {variant.price
                                ? `₹${Number(variant.price).toLocaleString("en-IN")}`
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B]">Stock</p>
                            <p className="font-medium text-[#0F172A]">
                              {variant.stock || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B]">SKU</p>
                            <p className="font-medium text-[#0F172A] truncate">
                              {variant.sku || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B]">Images</p>
                            <p className="font-medium text-[#0F172A]">
                              {variant.imageCount}/{MAX_VARIANT_IMAGES}
                            </p>
                          </div>
                        </div>

                        {(variantImage[index] || []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {variantImage[index].map((file, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="w-12 h-12 rounded-lg overflow-hidden border border-[#E2E8F0] shrink-0"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`${variant.color || "Variant"} ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* modal footer */}
              <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#E2E8F0] shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#334155] hover:text-[#0F172A] px-4 py-2 rounded-lg hover:bg-[#F8FAFC] transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Back to edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      Confirm &amp; list
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}