import React from 'react'
import logo from '../../assets/logo.png'

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Laphub" className="h-12 w-12 object-contain" />
      <span className="text-2xl font-bold text-ink">Laphub</span>
    </div>
  )
}

export default Logo
