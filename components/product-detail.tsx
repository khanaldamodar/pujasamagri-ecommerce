"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  // ✅ Fetch product details
  useEffect(() => {
    fetch(`${apiUrl}products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const p = data.data
          setProduct({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : null,
            rating: parseFloat(p.rating) || 0,
            reviews: p.reviews || 0,
            images: p.images && p.images.length > 0 ? p.images.map((img: string) => `${imageUrl}${img}`) : [],
            category: p.category || "Uncategorized",
            brand: p.brand || "No Brand",
            isNew: p.is_new,
            discount: parseFloat(p.discount) || 0,
            stock: p.stock,
            description: p.description,
            features: p.features ? JSON.parse(p.features) : [],
            specifications: p.specifications ? JSON.parse(p.specifications) : {},
            inTheBox: p.in_the_box ? JSON.parse(p.in_the_box) : [],
          })
        }
      })
      .finally(() => setLoading(false))
  }, [productId])

  const handleQuantityChange = (change: number) => {
    if (!product) return
    setQuantity(Math.max(1, Math.min(product.stock, quantity + change)))
  }

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || "/placeholder.svg",
        stock: product.stock,
        brand: product.brand,
      })
    }
  }

  if (loading) return <div className="text-center py-10">Loading product...</div>
  if (!product) return <div className="text-center py-10">Product not found</div>

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {product.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
            {product.discount > 0 && <Badge className="bg-red-500 text-white">{product.discount}% OFF</Badge>}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="text-muted-foreground">by {product.brand}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm font-medium ml-2">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary">रु. {product.price}</span>
            {/* {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">रु. {product.originalPrice}</span>
                <span className="text-green-600 font-medium">
                  Save रु. {product.originalPrice - product.price}
                </span>
              </>
            )} */}
          </div>
          <p className="text-sm text-muted-foreground">
            {product.stock > 10 ? "In Stock" : `Only ${product.stock} left in stock`}
          </p>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Authentic Product</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <RotateCcw className="h-4 w-4 text-primary" />
            <span>Easy Returns</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.inTheBox && product.inTheBox.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">What's in the Box:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {product.inTheBox.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications">
            <div className="space-y-3">
              {product.specifications &&
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value as string}</span>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <p>Customer reviews will be displayed here.</p>
                <p className="text-sm">Feature coming soon!</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
