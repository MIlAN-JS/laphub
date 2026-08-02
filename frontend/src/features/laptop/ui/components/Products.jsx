import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiAlertCircle,
  FiRefreshCw,
  FiPackage,
  FiCpu,
  FiCalendar,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiLoader,
} from "react-icons/fi";
import useLaptop from "../../hook/useLaptop.js";

const STATUS_FILTERS = ["all", "active", "inactive", "draft"];

const STATUS_STYLES = {
  active: "bg-[#22C55E]/10 text-[#22C55E]",
  inactive: "bg-[#F97316]/10 text-[#F97316]",
  draft: "bg-[#64748B]/10 text-[#64748B]",
};

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SellerProducts({ onAddNew }) {
  const { handleGetSellerLaptops } = useLaptop();
  const { laptopData, error, isLoading } = useSelector((state) => state.laptop);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // laptop object pending delete
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    handleGetSellerLaptops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close the open kebab menu on any outside click
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

  const filteredLaptops = useMemo(() => {
    const list = Array.isArray(laptopData) ? laptopData : [];

    return list.filter((laptop) => {
      const matchesStatus =
        statusFilter === "all" || laptop.status === statusFilter;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        laptop.title?.toLowerCase().includes(query) ||
        laptop.brand?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [laptopData, search, statusFilter]);

  const handleCardClick = (productId) => {
    navigate(`/laptop/view/${productId}`);
  };

  const handleEditClick = (e, productId) => {
    e.stopPropagation();
    setOpenMenuId(null);
    navigate(`/laptop/edit/${productId}`);
  };

  const handleDeleteClick = (e, laptop) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteTarget(laptop);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await handleDeleteLaptop(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Your laptops
              </h1>
              <p className="text-sm text-[#64748B]">
                {Array.isArray(laptopData) ? laptopData.length : 0} listed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddNew}
            className="flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            Add new laptop
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or brand..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#64748B]/70 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition ${
                  statusFilter === status
                    ? "bg-[#2563EB] text-white"
                    : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3 mb-6">
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

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#E2E8F0]" />
                <div className="p-4 space-y-2">
                  <div className="h-3.5 w-2/3 bg-[#E2E8F0] rounded" />
                  <div className="h-3 w-1/3 bg-[#E2E8F0] rounded" />
                  <div className="h-3 w-1/2 bg-[#E2E8F0] rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredLaptops.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-[#E2E8F0] rounded-2xl py-16 px-6">
            <div className="w-14 h-14 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-4">
              <FiPackage className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A] mb-1">
              {Array.isArray(laptopData) && laptopData.length > 0
                ? "No laptops match your filters"
                : "No laptops listed yet"}
            </h3>
            <p className="text-sm text-[#64748B] max-w-sm mb-5">
              {Array.isArray(laptopData) && laptopData.length > 0
                ? "Try a different search term or status filter."
                : "Once you list a laptop, it'll show up here for you to manage."}
            </p>
            {!(Array.isArray(laptopData) && laptopData.length > 0) && (
              <button
                type="button"
                onClick={onAddNew}
                className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
              >
                <FiPlus className="w-4 h-4" />
                Add your first laptop
              </button>
            )}
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && filteredLaptops.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredLaptops.map((laptop) => (
              <div
                key={laptop._id}
                onClick={() => handleCardClick(laptop._id)}
                className="relative text-left bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2563EB]/40 transition group cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
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
                  <span
                    className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      STATUS_STYLES[laptop.status] || STATUS_STYLES.draft
                    }`}
                  >
                    {laptop.status}
                  </span>

                  {/* kebab menu */}
                  <div
                    className="absolute top-2 right-2"
                    ref={openMenuId === laptop._id ? menuRef : null}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) =>
                          prev === laptop._id ? null : laptop._id
                        );
                      }}
                      className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-[#E2E8F0] flex items-center justify-center text-[#334155] hover:bg-white transition"
                      aria-label="Laptop actions"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === laptop._id && (
                      <div className="absolute right-0 mt-1.5 w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-md py-1.5 z-10">
                        <button
                          type="button"
                          onClick={(e) => handleEditClick(e, laptop._id)}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(e, laptop)}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-[#F97316] hover:bg-[#F8FAFC] transition"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide mb-0.5 truncate">
                    {laptop.brand}
                  </p>
                  <h3 className="text-sm font-semibold text-[#0F172A] truncate">
                    {laptop.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2">
                    {laptop.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-3 pt-3 border-t border-[#E2E8F0]">
                    <FiCalendar className="w-3 h-3" />
                    Added {formatDate(laptop.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <div className="w-11 h-11 rounded-full bg-[#F97316]/10 flex items-center justify-center mb-4">
                <FiTrash2 className="w-5 h-5 text-[#F97316]" />
              </div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-1">
                Delete this laptop?
              </h3>
              <p className="text-sm text-[#64748B] mb-6">
                <span className="font-medium text-[#334155]">
                  {deleteTarget.title}
                </span>{" "}
                will be permanently removed from your listings. This can't be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="text-sm font-medium text-[#334155] hover:text-[#0F172A] px-4 py-2 rounded-lg hover:bg-[#F8FAFC] transition disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
                >
                  {isDeleting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
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