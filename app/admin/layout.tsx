// app/admin/layout.tsx
"use client"
import type React from "react"
import { AuthGuard } from "@/components/admin/auth-guard"
import AdminLayoutContent from "@/components/admin/admin-layout-content"
import { DivideCircleIcon } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (

      <div className="font-sans">
        <AuthGuard requireAdmin>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthGuard>
      </div>

  )
}
