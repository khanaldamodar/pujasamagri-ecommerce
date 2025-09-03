"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    // const savedUser = localStorage.getItem("auth_user")
    const savedUser = Cookies.get("auth_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        // localStorage.removeItem("auth_user")
        Cookies.remove("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, call your API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    // Mock admin credentials
    if (email === "admin@pujasamagri.com" && password === "admin123") {
      const adminUser: User = {
        id: "1",
        email: "admin@pujasamagri.com",
        name: "Admin User",
        role: "admin",
      }

      setUser(adminUser)
      // localStorage.setItem("auth_user", JSON.stringify(adminUser))
      Cookies.set("auth_user", JSON.stringify(adminUser), { expires: 7 }) // Example cookie

      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    // localStorage.removeItem("auth_user")
    Cookies.remove("auth_user")
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
