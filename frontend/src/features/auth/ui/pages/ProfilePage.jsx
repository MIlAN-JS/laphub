import React from "react"
import { useSelector } from "react-redux"

function ProfilePage() {
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink">Profile</h1>
      <p className="mt-6 text-sm text-ink">{user?.username}</p>
      <p className="text-sm text-neutral">{user?.email}</p>
    </div>
  )
}

export default ProfilePage
