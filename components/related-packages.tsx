import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

export function RelatedPackages() {
  const relatedPackages = [
    {
      id: 2,
      name: "Lakshmi Puja Essentials",
      description: "Traditional items for Lakshmi puja and Diwali celebrations",
      price: 649,
      originalPrice: 899,
      rating: 4.7,
      reviews: 89,
      image: "/lakshmi-puja-items-with-diyas--flowers--and-gold-d.png",
      badge: "Popular",
    },
    {
      id: 3,
      name: "Daily Puja Starter Kit",
      description: "Perfect for beginners starting their spiritual journey",
      price: 399,
      originalPrice: 599,
      rating: 4.6,
      reviews: 234,
      image: "/daily-puja-items-with-brass-thali--incense--and-tr.png",
      badge: "Beginner Friendly",
    },
    {
      id: 4,
      name: "Shiva Puja Complete Set",
      description: "Sacred items for Lord Shiva worship and Maha Shivratri",
      price: 749,
      originalPrice: 999,
      rating: 4.9,
      reviews: 67,
      image: "/shiva-puja-set-with-lingam-and-sacred-items.png",
      badge: "Premium",
    },
  ]

  return (
    <section className="py-16">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Related Packages</h2>
          <p className="text-muted-foreground">You might also be interested in these packages</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPackages.map((pkg) => (
            <Card key={pkg.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <Link href={`/packages/${pkg.id}`}>
                  <img
                    src={pkg.image || "/placeholder.svg"}
                    alt={pkg.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{pkg.badge}</Badge>
              </div>

              <CardHeader className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{pkg.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                </div>
                <Link href={`/packages/${pkg.id}`}>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{pkg.name}</CardTitle>
                </Link>
                <CardDescription className="text-sm text-pretty">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">Rs. {pkg.price}</span>
                      <span className="text-sm text-muted-foreground line-through">Rs. {pkg.originalPrice}</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">Save Rs. {pkg.originalPrice - pkg.price}</div>
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
