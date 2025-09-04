"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { useSettings } from "@/contexts/setting-context"

export function PackagesSection() {
  const { addItem } = useCart()
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const {settings} = useSettings()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}packages`)
        const data = await res.json()
        if (data.success) {
          setPackages(data.data)
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
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
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      image: pkg.products?.[0]?.images?.[0] 
        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${pkg.products[0].images[0]}`
        : "/placeholder.svg",
      stock: pkg.products?.[0]?.stock || 0,
      brand: "PujaSamagri Package",
    })
  }

  if (loading) {
    return <div className="text-center py-10">Loading packages...</div>
  }

  // Show only first 3
  const displayedPackages = packages.slice(0, 3)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Package className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wide">Curated Packages</span> 
          </div>
          <span className="bg-primary p-1 text-white rounded">Inquiry Number: +977-{settings?.phone}</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Complete Puja Packages</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughtfully curated collections of authentic puja items for every occasion and deity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPackages.map((pkg) => (
            <Card key={pkg.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Link href={`/packages/${pkg.id}`}>
                  <img
                    src={
                      pkg.products?.[0]?.images?.[0]
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${pkg.products[0].images[0]}`
                        : "/placeholder.svg"
                    }
                    alt={pkg.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Link>
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">New</Badge>
              </div>

              <CardHeader className="space-y-2">
                <Link href={`/packages/${pkg.id}`}>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{pkg.name}</CardTitle>
                </Link>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                  <span className="text-sm text-muted-foreground">(100 reviews)</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">Rs. {pkg.price}</span>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleAddToCart(pkg)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {packages.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/packages">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                View All Packages
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
