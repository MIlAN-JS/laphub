import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiGrid,
  FiMonitor,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiSearch,
  FiBell,
  FiPlus,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiCpu,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Overview from "../components/Overview";
import Products from "../components/Products";

// ---------------- mock data (swap for real API data) ----------------

const NAV_ITEMS = [
  { label: "Dashboard", icon: FiGrid },
  { label: "Products", icon: FiMonitor },
  { label: "Orders", icon: FiShoppingCart },
  { label: "Customers", icon: FiUsers },
  { label: "Analytics", icon: FiBarChart2 },
  { label: "Settings", icon: FiSettings },
];



// ---------------- component ----------------

export default function Dashboard({ onCreateProduct }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);



  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* ---------------- Sidebar ---------------- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <FiCpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-[#0F172A]">
              LapHub
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#64748B] hover:text-[#0F172A] transition"
            aria-label="Close sidebar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2563EB]/10 text-[#2563EB]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#E2E8F0] shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition">
            <FiLogOut className="w-4.5 h-4.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#0F172A]/40 lg:hidden"
        />
      )}

      {/* ---------------- Main ---------------- */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#64748B] hover:text-[#0F172A] transition shrink-0"
              aria-label="Open sidebar"
            >
              <FiMenu className="w-5.5 h-5.5" />
            </button>

            <div className="relative hidden sm:block max-w-xs w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#0F172A] placeholder:text-[#64748B]/70 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/create-laptop"
              
              className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg transition shadow-sm"
            >
              <FiPlus className="w-4 h-4" />

              <span className="hidden sm:inline">New product</span>
            </Link>

            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition"
              aria-label="Notifications"
            >
              <FiBell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316]" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-[#F8FAFC] transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  MN
                </div>
                <FiChevronDown className="w-4 h-4 text-[#64748B] hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-sm py-1.5 z-10">
                  <button className="w-full text-left px-3.5 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition">
                    Profile
                  </button>
                  <button className="w-full text-left px-3.5 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition">
                    Store settings
                  </button>
                  <button className="w-full text-left px-3.5 py-2 text-sm text-[#F97316] hover:bg-[#F8FAFC] transition flex items-center gap-2">
                    <FiLogOut className="w-3.5 h-3.5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}

       <main className="flex-1 p-4 sm:p-6 space-y-6">
        {activeNav === "Dashboard" && <Overview />}
        {activeNav === "Products" && <Products />}
        {/* {activeNav === "Orders" && <OrdersPage />} */}
        {/* {activeNav === "Customers" && <CustomersPage />} */}
        {/* {activeNav === "Analytics" && <AnalyticsPage />} */}
        {/* {activeNav === "Settings" && <SettingsPage />} */}
        
       </main>
        

        
      </div>


    </div>
  );
}