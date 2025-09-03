"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function RecentProductsSection() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}products`) // replace with your real API endpoint
        const data = await res.json()
        if (data.success && data.data) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.images?.[0] ? `${imageUrl}${product.images[0]}` : "/placeholder.svg",
      stock: product.stock,
      brand: product.brand,
    })
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Star className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wide">New Arrivals</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            Recently Added Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover our latest collection of authentic puja items and spiritual accessories
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 12).map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    product.images?.[0]
                      ? `${imageUrl}${product.images[0]}`
                      : "/placeholder.svg"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.is_new && <Badge className="bg-green-500 text-white">New</Badge>}
                  {product.discount > 0 && (
                    <Badge className="bg-red-500 text-white">{product.discount}% OFF</Badge>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">Rs. {product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          Rs. {product.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
