import React from "react"
import { Link } from "react-router-dom"

const VARIANT_CLASSES = {
  link: "flex items-center gap-1.5 text-sm text-ink hover:text-olive transition-colors",
  solid:
    "flex items-center gap-1.5 rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-olive transition-colors",
}

function NavAction({ label, to, variant = "link", icon: Icon }) {
  return (
    <Link to={to} className={VARIANT_CLASSES[variant]}>
      {Icon && <Icon size={16} />}
      {label}
    </Link>
  )
}

export default NavAction
