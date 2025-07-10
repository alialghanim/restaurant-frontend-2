// src/components/dashboard/sidebar.tsx
'use client'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-card text-foreground p-6 space-y-4 border-r border-border min-h-screen shadow-sm">
      <h1 className="text-2xl font-bold mb-8">Restaurant Admin</h1>
      <nav className="space-y-2">
        <Link
          href="/admin/dashboard"
          className="block py-2 px-4 rounded hover:bg-muted transition"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/dashboard/restaurants"
          className="block py-2 px-4 rounded hover:bg-muted transition"
        >
          Restaurants
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
