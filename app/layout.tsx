"use client"

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import "./globals.css"
import { usePathname } from "next/navigation"
import { UserProvider } from "@/contexts/user-context"
import { User } from "lucide-react"


// export const metadata: Metadata = {
//   title: "PujaSamagri - Authentic Hindu Puja Items",
//   description: "Your trusted source for authentic Hindu puja items and spiritual accessories",
//   generator: "v0.app",
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <UserProvider>
            <CartProvider>
              {!isAdminRoute && <Navbar />}
              {children}
              {!isAdminRoute && <Footer />}
            </CartProvider>
            </UserProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
