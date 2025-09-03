"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Eye, Filter, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}products`, {
          
        })
        const result = await res.json()
        if (result.success) {
          // Normalize Laravel response → frontend shape
          const mapped = result.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : null,
            category: p.category || "Uncategorized",
            brand: p.brand || "",
            stock: p.stock ?? 0,
            rating: Number(p.rating ?? 0),
            reviews: p.reviews ?? 0,
            isNew: !!p.is_new,
            discount: p.discount ? Number(p.discount) : 0,
            image: p.images && p.images.length > 0
              ? `${imageUrl}${p.images[0]}`
              : "/placeholder.svg",
            status: p.status ? "active" : "inactive",
            description: p.description,
            specifications: p.specifications ? JSON.parse(p.specifications) : {},
          }))
          setProducts(mapped)
        } else {
          console.error("Failed to fetch products:", result)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      }
    }

    fetchProducts()
  }, [])

  const categories = ["Pooja Thalis", "Incense & Dhoop", "Idols & Statues", "Puja Accessories", "Silver Items"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock <= 10) ||
      (stockFilter === "out" && product.stock === 0) ||
      (stockFilter === "in" && product.stock > 10)

    return matchesSearch && matchesCategory && matchesStock
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price":
        return a.price - b.price
      case "stock":
        return a.stock - b.stock
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const buildFormData = (data: any) => {
  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("description", data.description || "")
  formData.append("price", data.price || 0)
  formData.append("original_price", data.originalPrice || 0)
  formData.append("category", data.category || "")
  formData.append("brand", data.brand || "")
  formData.append("stock", data.stock || 0)
  formData.append("is_new", data.isNew ? "1" : "0")
  formData.append("status", data.status === "active" ? "1" : "0")

  // Specifications → JSON
  formData.append("specifications", JSON.stringify(data.specifications || {}))

  // Images → loop over File objects
  if (data.images && data.images.length > 0) {
    data.images.forEach((file: File, index: number) => {
      formData.append(`images[${index}]`, file)
    })
  }

  return formData
}


  const handleAddProduct = async (productData: any) => {
  try {
    
    const formData = buildFormData(productData)
    const response = await fetch(`${apiUrl}products`, {
      method: "POST",
      // body: buildFormData(productData), // function we’ll define below
      body: formData, // function we’ll define below
    })

    const result = await response.json()

    if (result.success) {
      setProducts([...products, result.data])
      setIsAddDialogOpen(false)
    } else {
      console.error("Validation failed:", result.errors)
    }
  } catch (error) {
    console.error("Error creating product:", error)
  }
}


  const handleEditProduct = async (productData: any) => {
  if (!editingProduct) return

  try {
    const formData = buildFormData(productData)

    // Laravel requires PUT/PATCH for updates
    formData.append("_method", "PUT")

    const response = await fetch(`${apiUrl}products/${editingProduct.id}`, {
      method: "POST", // Laravel will treat as PUT because of _method
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      // Normalize Laravel response → frontend shape
      const updated = {
        id: result.data.id,
        name: result.data.name,
        price: Number(result.data.price),
        originalPrice: result.data.original_price ? Number(result.data.original_price) : null,
        category: result.data.category || "Uncategorized",
        brand: result.data.brand || "",
        stock: result.data.stock ?? 0,
        rating: Number(result.data.rating ?? 0),
        reviews: result.data.reviews ?? 0,
        isNew: !!result.data.is_new,
        discount: result.data.discount ? Number(result.data.discount) : 0,
        image:
          result.data.images && result.data.images.length > 0
            ? `${imageUrl}${result.data.images[0]}`
            : "/placeholder.svg",
        status: result.data.status ? "active" : "inactive",
        description: result.data.description,
        specifications: result.data.specifications ? JSON.parse(result.data.specifications) : {},
      }

      // Replace in state
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))

      setIsEditDialogOpen(false)
      setEditingProduct(null)
    } else {
      console.error("Validation failed:", result.errors)
    }
  } catch (error) {
    console.error("Error updating product:", error)
  }
}


 const handleDeleteProduct = async (productId: number) => {
  try {
    const response = await fetch(`${apiUrl}products/${productId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      console.error("Failed to delete:", result.message || result);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};


  const handleEditClick = (product: any) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-500" }
    if (stock <= 10) return { label: "Low Stock", color: "bg-yellow-500" }
    return { label: "In Stock", color: "bg-green-500" }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-3xl md:max-w-5xl lg:max-w-[1400px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product for your store</DialogDescription>
            </DialogHeader>
            <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products ({sortedProducts.length})</CardTitle>
          <CardDescription>
            {products.filter((p) => p.stock <= 10).length > 0 && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{products.filter((p) => p.stock <= 10).length} products have low stock</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">Rs. {product.price}</p>
                          {product.originalPrice > product.price && (
                            <p className="text-sm text-muted-foreground line-through">Rs. {product.originalPrice}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{product.stock}</span>
                          <Badge className={`${stockStatus.color} text-white text-xs`}>{stockStatus.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No products found matching your criteria.</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full sm:max-w-3xl md:max-w-5xl lg:max-w-[1400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingProduct(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
