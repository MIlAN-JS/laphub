import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FiMessageSquare, FiGrid, FiPackage, FiUser } from "react-icons/fi"
import NavAction from "../ui/NavAction"

function UserActions({ mobile = false }) {
  const user = useSelector((state) => state.auth.user)
  const isSeller = user?.role?.trim() === "seller"

  const primaryAction = isSeller
    ? { label: "Dashboard", to: "/dashboard", icon: FiGrid }
    : { label: "Chats", to: "/chats", icon: FiMessageSquare }

  return (
    <div className={mobile ? "flex flex-col items-center gap-4" : "flex items-center gap-8"}>
      <NavAction {...primaryAction} />
      <NavAction label="Orders" to="/orders" icon={FiPackage} />

      <Link
        to="/profile"
        className="flex items-center gap-2 text-sm text-ink hover:text-olive transition-colors"
      >
        <span>User</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink">
          <FiUser size={16} />
        </span>
      </Link>
    </div>
  )
}

export default UserActions
