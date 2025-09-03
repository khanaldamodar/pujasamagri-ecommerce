"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Package, ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function PackagesGrid() {
  const [sortBy, setSortBy] = useState("featured")
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  // Fetch data from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${apiUrl}packages`)
        if (!res.ok) throw new Error("Failed to fetch packages")
        const json = await res.json()
        setPackages(json.data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const handleAddToCart = (pkg: any) => {
    addItem({
      id: pkg.id,
      name: pkg.name,
      price: parseFloat(pkg.price),
      image: pkg.products?.[0]?.images?.[0] 
        ? `${imageUrl}${pkg.products[0].images[0]}`
        : "/placeholder.svg",
      stock: pkg.products?.[0]?.stock ?? 0,
      brand: "PujaSamagri Package",
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading packages...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-8">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-muted-foreground">Showing {packages.length} packages</div>

        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const items = pkg.products?.map((p: any) => p.name) || []
          const image =
            pkg.products?.[0]?.images?.[0]
              ? `${imageUrl}${pkg.products[0].images[0]}`
              : "/placeholder.svg"

          return (
            <Card key={pkg.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img
                  src={image}
                  alt={pkg.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  New
                </Badge>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/packages/${pkg.id}`} className="cursor-pointer">
                    <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <CardHeader className="space-y-2">
                <Link href={`/packages/${pkg.id}`}>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{pkg.name}</CardTitle>
                </Link>
                <CardDescription className="text-sm text-pretty line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Includes:</div>
                  <div className="flex flex-wrap gap-1">
                    {items.slice(0, 3).map((item: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {items.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{items.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">Rs. {pkg.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {pkg.products?.[0]?.stock > 10 ? "In Stock" : `Only ${pkg.products?.[0]?.stock ?? 0} left`}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => handleAddToCart(pkg)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/packages/${pkg.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <div className="max-w-2xl mx-auto space-y-4">
          <Package className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-2xl font-bold text-foreground">Can't find what you're looking for?</h3>
          <p className="text-muted-foreground">
            We can create custom puja packages tailored to your specific needs and occasions.
          </p>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            Contact Us for Custom Packages
          </Button>
        </div>
      </div>
    </div>
  )
}
