import React, { useEffect, useRef, useState } from "react"
import { FiGlobe, FiChevronDown } from "react-icons/fi"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ne", label: "नेपाली" },
  {code : "kr", label : "한국어"}
]

const STORAGE_KEY = "laphub-language"

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.find((language) => language.code === stored) || LANGUAGES[0]
  })
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (language) => {
    setSelected(language)
    localStorage.setItem(STORAGE_KEY, language.code)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-ink hover:text-olive transition-colors"
      >
        <FiGlobe size={18} />
        <span className="text-sm">{selected.label}</span>
        <FiChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md border border-neutral bg-white py-1 shadow-lg z-50">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => handleSelect(language)}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-cream transition-colors ${
                language.code === selected.code ? "text-olive font-medium" : "text-ink"
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
