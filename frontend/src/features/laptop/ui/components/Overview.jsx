import React from 'react'
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

const Overview = () => {

    const STATS = [
  {
    label: "Total revenue",
    value: "₹24,50,000",
    change: "+12.4%",
    trend: "up",
    icon: FiDollarSign,
  },
  {
    label: "Total orders",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    icon: FiShoppingCart,
  },
  {
    label: "Total products",
    value: "96",
    change: "+4 new",
    trend: "up",
    icon: FiPackage,
  },
  {
    label: "Total customers",
    value: "3,542",
    change: "+15.1%",
    trend: "up",
    icon: FiUsers,
  },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 420000 },
  { month: "Feb", revenue: 380000 },
  { month: "Mar", revenue: 510000 },
  { month: "Apr", revenue: 460000 },
  { month: "May", revenue: 590000 },
  { month: "Jun", revenue: 670000 },
  { month: "Jul", revenue: 720000 },
];

const TOP_PRODUCTS = [
  { name: "MacBook Pro 14", sales: 142 },
  { name: "Dell XPS 15", sales: 98 },
  { name: "ThinkPad X1", sales: 76 },
  { name: "ROG Zephyrus", sales: 64 },
  { name: "Surface Laptop 5", sales: 51 },
];

const RECENT_ORDERS = [
  {
    id: "#LH-3021",
    customer: "Milan Neupane",
    product: "MacBook Pro 14 · Space Gray",
    amount: 89999,
    status: "Delivered",
    date: "Aug 1, 2026",
  },
  {
    id: "#LH-3020",
    customer: "Aayush Karki",
    product: "Dell XPS 15 · Platinum",
    amount: 112999,
    status: "Processing",
    date: "Aug 1, 2026",
  },
  {
    id: "#LH-3019",
    customer: "Prashant Rai",
    product: "ThinkPad X1 Carbon",
    amount: 134999,
    status: "Shipped",
    date: "Jul 31, 2026",
  },
  {
    id: "#LH-3018",
    customer: "Sujata Gurung",
    product: "ROG Zephyrus G14",
    amount: 149999,
    status: "Cancelled",
    date: "Jul 31, 2026",
  },
  {
    id: "#LH-3017",
    customer: "Bikash Thapa",
    product: "Surface Laptop 5",
    amount: 94999,
    status: "Delivered",
    date: "Jul 30, 2026",
  },
];

const LOW_STOCK_ITEMS = [
  { name: "Dell XPS 15", variant: "16GB / 512GB", sku: "DX15-16-512", stock: 3 },
  { name: "ROG Zephyrus G14", variant: "32GB / 1TB", sku: "RZ14-32-1TB", stock: 2 },
  { name: "ThinkPad X1 Carbon", variant: "8GB / 256GB", sku: "TX1-8-256", stock: 4 },
];

const STATUS_STYLES = {
  Delivered: "bg-[#22C55E]/10 text-[#22C55E]",
  Processing: "bg-[#2563EB]/10 text-[#2563EB]",
  Shipped: "bg-[#06B6D4]/10 text-[#06B6D4]",
  Cancelled: "bg-[#F97316]/10 text-[#F97316]",
};


  return (
   <main className="flex-1 p-4 sm:p-6 space-y-6">
            
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ label, value, change, trend, icon: Icon }) => (
              <div
                key={label}
                className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      trend === "up" ? "text-[#22C55E]" : "text-[#F97316]"
                    }`}
                  >
                    {trend === "up" ? (
                      <FiTrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <FiTrendingDown className="w-3.5 h-3.5" />
                    )}
                    {change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
                <p className="text-sm text-[#64748B] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Revenue trend */}
            <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Revenue trend
                  </h3>
                  <p className="text-xs text-[#64748B]">Last 7 months</p>
                </div>
                <button className="text-[#64748B] hover:text-[#0F172A] transition">
                  <FiMoreHorizontal className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        fontSize: "13px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563EB"
                      strokeWidth={2}
                      fill="url(#revenueFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top products */}
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Top selling products
                </h3>
                <p className="text-xs text-[#64748B]">By units sold</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="sales" fill="#06B6D4" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent orders + Low stock */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Recent orders */}
            <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Recent orders
                </h3>
                <button className="text-xs font-medium text-[#06B6D4] hover:text-[#2563EB] transition">
                  View all
                </button>
              </div>

              <div className="overflow-x-auto -mx-5 sm:-mx-6">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
                      <th className="font-medium px-5 sm:px-6 py-2">Order</th>
                      <th className="font-medium px-3 py-2">Customer</th>
                      <th className="font-medium px-3 py-2">Amount</th>
                      <th className="font-medium px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition"
                      >
                        <td className="px-5 sm:px-6 py-3">
                          <p className="font-medium text-[#0F172A]">{order.id}</p>
                          <p className="text-xs text-[#64748B]">{order.product}</p>
                        </td>
                        <td className="px-3 py-3 text-[#334155]">{order.customer}</td>
                        <td className="px-3 py-3 font-medium text-[#0F172A]">
                          ₹{order.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                  <FiAlertTriangle className="w-4 h-4 text-[#F97316]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Low stock alerts
                  </h3>
                  <p className="text-xs text-[#64748B]">Restock soon</p>
                </div>
              </div>

              <div className="space-y-3">
                {LOW_STOCK_ITEMS.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {item.variant} · {item.sku}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F97316]/10 text-[#F97316]">
                      {item.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </main>
  )
}

export default Overview
