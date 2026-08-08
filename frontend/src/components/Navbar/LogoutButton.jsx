import { useEffect, useRef, useState } from "react"
import { FiLogOut, FiLoader } from "react-icons/fi"
import useAuth from "../../features/auth/hook/useAuth.js"

function LogoutButton({ mobile = false }) {
  const { handleLogout } = useAuth()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isConfirmOpen) return

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsConfirmOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsConfirmOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isConfirmOpen])

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    await handleLogout()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsConfirmOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isConfirmOpen}
        className="flex items-center gap-2 text-sm text-ink hover:text-red-600 transition-colors"
      >
        <FiLogOut size={16} />
        <span>Logout</span>
      </button>

      {isConfirmOpen && (
        <div
          role="dialog"
          aria-label="Confirm logout"
          className={`absolute z-20 mt-2 w-60 rounded-lg border border-neutral/30 bg-white p-4 shadow-lg ${
            mobile ? "left-1/2 -translate-x-1/2" : "right-0"
          }`}
        >
          <p className="mb-3 text-sm text-ink">Log out of your account?</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isLoggingOut}
              className="rounded-md px-3 py-1.5 text-sm text-ink hover:bg-cream transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogoutButton
