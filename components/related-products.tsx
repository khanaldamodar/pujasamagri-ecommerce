"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

type Product = {
  id: number
  name: string
  slug: string
  price: string
  original_price: string
  discount: string
  rating: string
  reviews: number
  images: string[]
}

export function RelatedProducts() {
  const [products, setProducts] = useState<Product[]>([])
   const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}products`) 
        const data = await res.json()
        if (data.success && data.data) {
          setProducts(data.data.slice(0, 8)) // only first 8 products
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-16">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
          <p className="text-muted-foreground">You might also like these items</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <img
                    src={`${imageUrl}${product.images[0]}`} // prepend storage path
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {parseFloat(product.discount) > 0 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">
                        {parseFloat(product.rating).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        रु. {product.price}
                      </span>
                      {parseFloat(product.original_price) > 0 && (
                        <span className="text-sm text-muted-foreground line-through">
                          रु. {product.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
