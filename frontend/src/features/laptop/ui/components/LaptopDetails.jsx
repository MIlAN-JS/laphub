


import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiRefreshCw,
  FiCpu,
  FiCalendar,
  FiMonitor,
  FiBatteryCharging,
  FiMoreVertical,
  FiEdit2,
  FiStar,
  FiPackage,
  FiHash,
  FiTrendingUp,
  FiLoader,
  FiX,
  FiPlus,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import useLaptop from "../../hook/useLaptop.js";


const STATUS_STYLES = {
  active: "bg-[#22C55E]/10 text-[#22C55E]",
  inactive: "bg-[#F97316]/10 text-[#F97316]",
  draft: "bg-[#64748B]/10 text-[#64748B]",
};

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];
const CURRENCY_OPTIONS = ["NPR", "USD", "EUR"];
const MAX_NEW_VARIANT_IMAGES = 5;

function makeEmptyVariantForm() {
  return {
    color: "",
    ram: "",
    storage: "",
    price: "",
    currency: "NPR",
    compareAtPrice: "",
    stock: "",
    sku: "",
    isDefaultVariant: false,
  };
}

function isVideo(url = "") {
  return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price) {
  if (!price || price.price === null || price.price === undefined || price.price === "")
    return "—";
  return `${price.currency} ${Number(price.price).toLocaleString("en-IN")}`;
}

export default function LaptopDetails({ onBack }) {
  // Adjust to your actual route param name if different.
  const { productId } = useParams();
  const navigate = useNavigate();

  // handleUpdateVariant is assumed to follow the same naming convention as
  // your other useLaptop functions (handleCreateLaptop, handleUpdateLaptop,
  // handleDeleteLaptop, handleGetSellerLaptops). Rename if yours differs.
  const { handleGetLaptopDetail, handleUpdateVariant, handleAddVariant } = useLaptop();

  // The sample response you gave is an array containing a single laptop
  // object, so laptopDetail is read as an array and we take the first item.
  const { laptopData, error, isLoading } = useSelector((state) => state.laptop);
  const lapdets = useSelector((state) => state);
  console.log(lapdets)
  const laptop = Array.isArray(laptopData) ? laptopData[0] : laptopData;

  

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariantForm, setNewVariantForm] = useState(makeEmptyVariantForm());
  const [newVariantImages, setNewVariantImages] = useState([]);
  const [isCreatingVariant, setIsCreatingVariant] = useState(false);
  const [addVariantError, setAddVariantError] = useState(null);

  const menuRef = useRef(null);
  const newVariantImageInputRef = useRef(null);

  useEffect(() => {
    if (productId) handleGetLaptopDetail(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const openEditModal = (variant) => {
    setOpenMenuId(null);
    setEditingVariant(variant);
    setEditForm({
      color: variant.color || "",
      ram: variant.ram || "",
      storage: variant.storage || "",
      price: variant.price ?? "",
      compareAtPrice: variant.compareAtPrice ?? "",
      stock: variant.stock ?? "",
      sku: variant.sku || "",
      status: variant.status || "active",
    });
  };

  const closeEditModal = () => {
    setEditingVariant(null);
    setEditForm(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveVariant = async () => {
    if (!editingVariant) return;
    setIsSaving(true);
    await handleUpdateVariant(editingVariant._id, editForm);
    setIsSaving(false);
    closeEditModal();
    if (productId) handleGetLaptopDetail(productId);
  };

  const openAddVariantModal = () => {
    setOpenMenuId(null);
    setAddVariantError(null);
    setNewVariantForm(makeEmptyVariantForm());
    setNewVariantImages([]);
    setIsAddingVariant(true);
  };

  const closeAddVariantModal = () => {
    if (isCreatingVariant) return;
    setIsAddingVariant(false);
    setNewVariantForm(makeEmptyVariantForm());
    setNewVariantImages([]);
    setAddVariantError(null);
    if (newVariantImageInputRef.current) newVariantImageInputRef.current.value = "";
  };

  const handleNewVariantFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVariantForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewVariantImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setNewVariantImages((prev) => [...prev, ...files].slice(0, MAX_NEW_VARIANT_IMAGES));
  };

  const removeNewVariantImage = (index) => {
    setNewVariantImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateVariant = async () => {
    if (!laptop?._id) return;
    if (newVariantImages.length === 0) {
      setAddVariantError("At least one image is required.");
      return;
    }

    setIsCreatingVariant(true);
    setAddVariantError(null);
    try {
      await handleAddVariant(laptop._id, {
        color: newVariantForm.color,
        ram: newVariantForm.ram,
        storage: newVariantForm.storage,
        price: { price: newVariantForm.price, currency: newVariantForm.currency },
        compareAtPrice: newVariantForm.compareAtPrice,
        stock: newVariantForm.stock,
        sku: newVariantForm.sku,
        isDefaultVariant: newVariantForm.isDefaultVariant,
        variantImage: newVariantImages,
      });
      closeAddVariantModal();
      if (productId) handleGetLaptopDetail(productId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to add variant";
      setAddVariantError(message);
    } finally {
      setIsCreatingVariant(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] mb-5 transition"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>

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

        {/* Loading */}
        {isLoading && (
          <div className="animate-pulse space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex gap-5">
              <div className="w-32 h-32 rounded-xl bg-[#E2E8F0] shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 w-1/3 bg-[#E2E8F0] rounded" />
                <div className="h-5 w-2/3 bg-[#E2E8F0] rounded" />
                <div className="h-3 w-full bg-[#E2E8F0] rounded" />
                <div className="h-3 w-4/5 bg-[#E2E8F0] rounded" />
              </div>
            </div>
            <div className="h-32 bg-[#E2E8F0] rounded-2xl" />
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && laptop && (
          <div className="space-y-6">
            {/* Product overview */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
                  {laptop.thumbnail ? (
                    <img
                      src={laptop.thumbnail}
                      alt={laptop.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                      <FiCpu className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide">
                      {laptop.brand}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        STATUS_STYLES[laptop.status] || STATUS_STYLES.draft
                      }`}
                    >
                      {laptop.status}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-[#0F172A] break-words">
                    {laptop.title}
                  </h1>
                  <p className="text-sm text-[#64748B] mt-2">
                    {laptop.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-[#334155]">
                    <span className="flex items-center gap-1.5">
                      <FiMonitor className="w-4 h-4 text-[#64748B]" />
                      {laptop.display}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiBatteryCharging className="w-4 h-4 text-[#64748B]" />
                      {laptop.battery}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#64748B]">
                      <FiCalendar className="w-4 h-4" />
                      Added {formatDate(laptop.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#0F172A]">
                  Variants ({laptop.variants?.length || 0})
                </h2>
                <button
                  type="button"
                  onClick={openAddVariantModal}
                  className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  Add variant
                </button>
              </div>

              <div className="space-y-3">
                {(laptop.variants || []).map((variant) => (
                  <div
                    key={variant._id}
                    className={`relative bg-white border rounded-2xl shadow-sm p-4 sm:p-5 ${
                      variant.isDefaultVariant
                        ? "border-[#2563EB]"
                        : "border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {variant.color || "Unnamed"} · {variant.ram || "—"} ·{" "}
                          {variant.storage || "—"}
                        </p>
                        {variant.isDefaultVariant && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#2563EB] text-white px-2 py-0.5 rounded-full">
                            <FiStar className="w-2.5 h-2.5" />
                            Default
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                            STATUS_STYLES[variant.status] || STATUS_STYLES.draft
                          }`}
                        >
                          {variant.status}
                        </span>
                      </div>

                      {/* kebab menu */}
                      <div
                        className="relative shrink-0"
                        ref={openMenuId === variant._id ? menuRef : null}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === variant._id ? null : variant._id
                            )
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition"
                          aria-label="Variant actions"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === variant._id && (
                          <div className="absolute right-0 mt-1.5 w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-md py-1.5 z-10">
                            <button
                              type="button"
                              onClick={() => openEditModal(variant)}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs text-[#64748B]">Price</p>
                        <p className="font-medium text-[#0F172A]">
                          {formatPrice(variant.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] flex items-center gap-1">
                          <FiPackage className="w-3 h-3" />
                          Stock
                        </p>
                        <p className="font-medium text-[#0F172A]">
                          {variant.stock ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] flex items-center gap-1">
                          <FiHash className="w-3 h-3" />
                          SKU
                        </p>
                        <p className="font-medium text-[#0F172A] truncate">
                          {variant.sku || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] flex items-center gap-1">
                          <FiTrendingUp className="w-3 h-3" />
                          Sold
                        </p>
                        <p className="font-medium text-[#0F172A]">
                          {variant.soldCount ?? 0}
                        </p>
                      </div>
                    </div>

                    {variant.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {variant.images.map((url, i) =>
                          isVideo(url) ? (
                            <video
                              key={i}
                              src={url}
                              className="w-16 h-16 rounded-lg object-cover border border-[#E2E8F0]"
                              muted
                            />
                          ) : (
                            <img
                              key={i}
                              src={url}
                              alt={`${variant.color || "Variant"} ${i + 1}`}
                              className="w-16 h-16 rounded-lg object-cover border border-[#E2E8F0]"
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit variant modal */}
        {editingVariant && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] shrink-0">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Edit variant
                </h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition"
                  aria-label="Close"
                >
                  <FiX className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Color
                    </label>
                    <input
                      name="color"
                      value={editForm.color}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      RAM
                    </label>
                    <input
                      name="ram"
                      value={editForm.ram}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Storage
                    </label>
                    <input
                      name="storage"
                      value={editForm.storage}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Compare-at price
                    </label>
                    <input
                      name="compareAtPrice"
                      type="number"
                      value={editForm.compareAtPrice}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Stock
                    </label>
                    <input
                      name="stock"
                      type="number"
                      value={editForm.stock}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      SKU
                    </label>
                    <input
                      name="sku"
                      value={editForm.sku}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E2E8F0] shrink-0">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSaving}
                  className="text-sm font-medium text-[#334155] hover:text-[#0F172A] px-4 py-2 rounded-lg hover:bg-[#F8FAFC] transition disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVariant}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add variant modal */}
        {isAddingVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] shrink-0">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Add new variant
                </h3>
                <button
                  type="button"
                  onClick={closeAddVariantModal}
                  disabled={isCreatingVariant}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition disabled:opacity-60"
                  aria-label="Close"
                >
                  <FiX className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 space-y-4">
                {addVariantError && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-2 text-xs text-[#F97316]">
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {addVariantError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Color
                    </label>
                    <input
                      name="color"
                      value={newVariantForm.color}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      RAM
                    </label>
                    <input
                      name="ram"
                      value={newVariantForm.ram}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Storage
                    </label>
                    <input
                      name="storage"
                      value={newVariantForm.storage}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={newVariantForm.price}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={newVariantForm.currency}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    >
                      {CURRENCY_OPTIONS.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Compare-at price
                    </label>
                    <input
                      name="compareAtPrice"
                      type="number"
                      value={newVariantForm.compareAtPrice}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Stock
                    </label>
                    <input
                      name="stock"
                      type="number"
                      value={newVariantForm.stock}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      SKU
                    </label>
                    <input
                      name="sku"
                      value={newVariantForm.sku}
                      onChange={handleNewVariantFieldChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      id="isDefaultVariant"
                      name="isDefaultVariant"
                      type="checkbox"
                      checked={newVariantForm.isDefaultVariant}
                      onChange={handleNewVariantFieldChange}
                      className="w-4 h-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]/20"
                    />
                    <label htmlFor="isDefaultVariant" className="text-xs font-medium text-[#334155]">
                      Set as default variant
                    </label>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Images
                    </label>
                    <input
                      ref={newVariantImageInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleNewVariantImagesChange}
                      className="hidden"
                      id="newVariantImages"
                    />
                    <label
                      htmlFor="newVariantImages"
                      className="flex items-center justify-center gap-2 border border-dashed border-[#E2E8F0] rounded-lg py-3 text-sm text-[#64748B] hover:border-[#2563EB]/40 hover:text-[#2563EB] cursor-pointer transition"
                    >
                      <FiUpload className="w-4 h-4" />
                      Upload images ({newVariantImages.length}/{MAX_NEW_VARIANT_IMAGES})
                    </label>

                    {newVariantImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {newVariantImages.map((file, i) => (
                          <div key={i} className="relative w-16 h-16 shrink-0">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New variant ${i + 1}`}
                              className="w-16 h-16 rounded-lg object-cover border border-[#E2E8F0]"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewVariantImage(i)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#F97316] hover:bg-[#F97316]/10 transition"
                              aria-label="Remove image"
                            >
                              <FiTrash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E2E8F0] shrink-0">
                <button
                  type="button"
                  onClick={closeAddVariantModal}
                  disabled={isCreatingVariant}
                  className="text-sm font-medium text-[#334155] hover:text-[#0F172A] px-4 py-2 rounded-lg hover:bg-[#F8FAFC] transition disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateVariant}
                  disabled={isCreatingVariant}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
                >
                  {isCreatingVariant ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add variant"
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