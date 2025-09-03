"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Settings = {
  business_name: string
  email: string
  phone: string
  address: string
  logo?: string
  favicon?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
  payment_qr?: string
}

type SettingsContextType = {
  settings: Settings | null
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}setting`, {
          cache: "no-store",
        })
        const data = await res.json()
        setSettings(data)
      } catch (err) {
        console.error("Failed to fetch settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
