"use client"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { UserProvider } from "@/contexts/user-context"
import { Analytics } from "@vercel/analytics/next"
import { SettingsProvider } from "@/contexts/setting-context"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <SettingsProvider>
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <Footer />}
            </SettingsProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
      <Analytics />
    </Suspense>
  )
}
