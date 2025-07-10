'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

interface HeaderProps {
  isPublicPage?: boolean;
}

const Header = ({ isPublicPage = false }: HeaderProps) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(!isPublicPage)

  useEffect(() => {
    if (isPublicPage) {
      setIsLoading(false)
      return
    }

    const validateToken = async () => {
      const token = localStorage.getItem("access_token")
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        await api.get("/restaurants/my-restaurants", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem("access_token")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateToken()
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        validateToken()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setIsAuthenticated(false)
    router.push("/admin/dashboard")
  }

  const handleLogin = () => {
router.push("/auth");
  }

  return (
    <header className="bg-white border-b border-border p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          Restaurant Dashboard
        </h2>

        {!isLoading && (
          isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-foreground px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-primary hover:bg-primary/90 text-foreground px-4 py-2 rounded text-sm"
            >
              Login
            </button>
          )
        )}
      </div>
    </header>
  )
}

export default Header
