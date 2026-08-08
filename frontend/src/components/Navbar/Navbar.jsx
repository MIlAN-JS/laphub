import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiSearch } from 'react-icons/fi'
import Logo from './Logo'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import LanguageSelector from './LanguageSelector'
import AuthActions from './AuthActions'
import UserActions from './UserActions'

function Navbar() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const location = useLocation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
    setIsMobileSearchOpen(false)
  }, [location.pathname])

  return (
    <nav className="bg-cream px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Logo />

        <div id="search-cart" className="hidden flex-1 items-center justify-center gap-5 md:flex">
          <SearchBar />
          <CartIcon />
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <LanguageSelector />
          {isAuthenticated ? <UserActions /> : <AuthActions />}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
            className="text-ink hover:text-olive transition-colors"
          >
            <FiSearch size={20} />
          </button>
          <CartIcon />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="text-ink hover:text-olive transition-colors"
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>
      )}

      {isMenuOpen && (
        <div className="mt-4 flex flex-col items-center gap-5 border-t border-neutral pt-4 md:hidden">
          <LanguageSelector />
          {isAuthenticated ? <UserActions mobile /> : <AuthActions mobile />}
        </div>
      )}
    </nav>
  )
}

export default Navbar
