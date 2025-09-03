"use client"

import { Search, ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"

export function Navbar() {
  const { itemCount } = useCart()
  const { user } = useUser()

  const categories = [
    "Pooja Thalis",
    "Incense & Dhoop",
    "Idols & Statues",
    "Puja Accessories",
    "Sacred Books",
    "Decorative Items",
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              🕉️ PujaSamagri
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input type="search" placeholder="Search for puja items..." className="pl-10 pr-4" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground  hover:text-white">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/packages">
              <Button variant="ghost" className="text-foreground hover:text-white">
                Packages
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="ghost" className="text-foreground hover:text-white">
                Products
              </Button>
            </Link>
            <Button variant="ghost" className="text-foreground hover:text-white">
              About
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-whitey">
              Contact
            </Button>
          </div>

          {/* Cart, Account and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link href="/account">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
                {user && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                    <span className="sr-only">Account active</span>
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <Link href="/packages">Packages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products">Products</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>About</DropdownMenuItem>
                  <DropdownMenuItem>Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Input type="search" placeholder="Search for puja items..." className="pl-10 pr-4" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </nav>
  )
}
