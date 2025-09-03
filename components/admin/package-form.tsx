"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Package, ShoppingBag, Calculator } from "lucide-react"

interface PackageFormProps {
  package?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PackageForm({ package: pkg, onSubmit, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState({
    name: pkg?.name || "",
    description: pkg?.description || "",
    price: pkg?.price || "",
    originalPrice: pkg?.originalPrice || "",
    category: pkg?.category || "",
    badge: pkg?.badge || "",
    stock: pkg?.stock || "",
    difficulty: pkg?.difficulty || "Beginner Friendly",
    duration: pkg?.duration || "",
    occasions: pkg?.occasions || [],
    items: pkg?.items || [],
  })
 

   const [availableProducts, setAvailableProducts] = useState<any[]>([])
   const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  // ✅ Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}products`)
        const data = await res.json()

        if (data.success && Array.isArray(data.data)) {
          // Map API response into usable product objects
          const products = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price), // convert string to number
            category: p.category || "Uncategorized",
            stock: p.stock,
            image: p.images?.length ? p.images[0] : null,
          }))
          setAvailableProducts(products)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchProducts()
  }, [])

  const categories = ["Festival Kits", "Daily Puja", "Deity Specific", "Ceremony Kits"]
  const difficultyLevels = ["Beginner Friendly", "Intermediate", "Advanced"]
  const occasionOptions = [
    "Ganesh Chaturthi",
    "Diwali",
    "Navratri",
    "Karva Chauth",
    "Dussehra",
    "Holi",
    "Janmashtami",
    "Maha Shivratri",
    "Daily Worship",
    "Home Blessing",
  ]

  const calculateTotalValue = () => {
    return formData.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateSavings = () => {
    const totalValue = calculateTotalValue()
    const packagePrice = Number(formData.price) || 0
    return Math.max(0, totalValue - packagePrice)
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const productIds = formData.items.map((item) => item.productId);

  const payload = {
    name: formData.name,
    description: formData.description,
    price: Number(formData.price),
    status: true, // or bind with toggle
    product_ids: productIds,
  };

  try {
    let res;
    let data;

    if (pkg) {
      // ✅ Update existing package
      res = await fetch(`${apiUrl}packages/${pkg.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      //  Create new package
      res = await fetch(`${apiUrl}packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    data = await res.json();

    if (res.ok) {
      alert(pkg ? "Package updated successfully!" : "Package created successfully!");
      onSubmit(data.data); // ⚡ return updated package data to parent
    } else {
      console.error("❌ Error:", data);
      alert("Failed: " + (data.message || "Validation error"));
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
    alert("Something went wrong!");
  }
};


  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddProduct = (product: any) => {
    const existingItem = formData.items.find((item) => item.productId === product.id)
    if (existingItem) {
      handleUpdateQuantity(product.id, existingItem.quantity + 1)
    } else {
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
      }))
    }
  }

  const handleRemoveProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.productId !== productId),
    }))
  }

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId)
      return
    }

    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    }))
  }

  const handleOccasionToggle = (occasion: string) => {
    setFormData((prev) => ({
      ...prev,
      occasions: prev.occasions.includes(occasion)
        ? prev.occasions.filter((o) => o !== occasion)
        : [...prev.occasions, occasion],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Package Information</CardTitle>
            <CardDescription>Basic details about the package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter package name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this package includes and its purpose"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => handleInputChange("badge", e.target.value)}
                  placeholder="e.g., Best Seller, Popular"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g., 3-11 days celebration"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Pricing & Value</span>
            </CardTitle>
            <CardDescription>Set package pricing and see value calculation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Package Price (Rs. )</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (Rs. )</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {formData.items.length > 0 && (
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Items Value:</span>
                  <span className="font-medium">Rs. {calculateTotalValue()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Package Price:</span>
                  <span className="font-medium">Rs. {formData.price || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span>Customer Savings:</span>
                  <span>Rs. {calculateSavings()}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {calculateSavings() > 0
                    ? `${((calculateSavings() / calculateTotalValue()) * 100).toFixed(1)}% discount`
                    : "No discount applied"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Select Products</span>
          </CardTitle>
          <CardDescription>Choose products to include in this package</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Products */}
            <div className="space-y-4">
              <h4 className="font-medium">Available Products</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <p className="text-sm font-medium text-primary">Rs. {product.price}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddProduct(product)}
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Products */}
            <div className="space-y-4">
              <h4 className="font-medium">Selected Products ({formData.items.length})</h4>
              {formData.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Package className="h-8 w-8 mx-auto mb-2" />
                  <p>No products selected</p>
                  <p className="text-sm">Add products from the left panel</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {formData.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-primary">Rs. {item.price} each</p>
                        <p className="text-xs text-muted-foreground">Subtotal: Rs. {item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occasions */}
      <Card>
        <CardHeader>
          <CardTitle>Suitable Occasions</CardTitle>
          <CardDescription>Select occasions this package is suitable for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {occasionOptions.map((occasion) => (
              <div key={occasion} className="flex items-center space-x-2">
                <Checkbox
                  id={occasion}
                  checked={formData.occasions.includes(occasion)}
                  onCheckedChange={() => handleOccasionToggle(occasion)}
                />
                <Label htmlFor={occasion} className="text-sm">
                  {occasion}
                </Label>
              </div>
            ))}
          </div>
          {formData.occasions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.occasions.map((occasion) => (
                <Badge key={occasion} variant="secondary">
                  {occasion}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={formData.items.length === 0}>
          {pkg ? "Update Package" : "Create Package"}
        </Button>
      </div>
    </form>
  )
}
