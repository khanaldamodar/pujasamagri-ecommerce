import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}setting`, {
    cache: "no-store", // always fetch latest
  })
  const settings = await res.json()

  return {
    title: settings.business_name || "PujaSamagri - Authentic Hindu Puja Items",
    description: settings.description || "Your trusted source for authentic Hindu puja items and spiritual accessories",
    icons: { icon: settings.favicon ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${settings.favicon}` : "/favicon.ico" },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  )
}
