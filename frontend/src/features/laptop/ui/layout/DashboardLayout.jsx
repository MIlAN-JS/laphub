import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiCpu } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: FiGrid, end: true },
  { label: "Laptops", to: "/dashboard/laptops", icon: FiCpu, end: false },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <aside className="w-64 shrink-0 bg-white border-r border-[#E2E8F0] px-4 py-6">
        <h2 className="text-lg font-semibold text-[#0F172A] px-3 mb-6">Dashboard</h2>
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2563EB]/10 text-[#2563EB]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
