import React from "react"
import { FiUser } from "react-icons/fi"
import NavAction from "../ui/NavAction"

const ACTIONS = [
  { label: "Become a seller", to: "/register", variant: "link" },
  { label: "Login", to: "/login", variant: "link", icon: FiUser },
  { label: "Create Account", to: "/register", variant: "solid" },
]

function AuthActions({ mobile = false }) {
  return (
    <div className={mobile ? "flex flex-col items-center gap-4" : "flex items-center gap-5"}>
      {ACTIONS.map((action) => (
        <NavAction key={action.label} {...action} />
      ))}
    </div>
  )
}

export default AuthActions
