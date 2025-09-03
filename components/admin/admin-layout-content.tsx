// components/admin/admin-layout-content.tsx
"use client"
import React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          {/* SidebarHeader */}
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center space-x-2">
              <div className="text-xl">🕉️</div>
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">PujaSamagri</h2>
                <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
              </div>
            </div>
            {user && (
              <div className="mt-3 p-2 bg-sidebar-accent/10 rounded-md">
                <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
            )}
          </SidebarHeader>

          {/* SidebarMenu */}
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin" className="flex items-center space-x-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/products" className="flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/packages" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Packages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/orders" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Logout */}
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
