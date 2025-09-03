"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    brand: product?.brand || "",
    stock: product?.stock || "",
    isNew: product?.isNew || false,
    status: product?.status || "active",
    images: product?.images || [],
    specifications: product?.specifications || {
      material: "",
      dimensions: "",
      weight: "",
      finish: "",
      origin: "",
      care: "",
    },
  });

  const categories = [
    "Pooja Thalis",
    "Incense & Dhoop",
    "Idols & Statues",
    "Puja Accessories",
    "Silver Items",
    "Sacred Books",
    "Decorative Items",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecificationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
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
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>Set pricing and stock information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (Rs. )</Label>
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
                  onChange={(e) =>
                    handleInputChange("originalPrice", e.target.value)
                  }
                  placeholder="0"
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

            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  handleInputChange("isNew", checked)
                }
              />
              <Label htmlFor="isNew">Mark as New Product</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Upload product images (first image will be the main image)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="images"
            className="cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center block"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports: JPG, PNG, WebP (Max 5MB each)
            </p>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData((prev) => ({
                  ...prev,
                  images: [...prev.images, ...files], // store selected images
                }));
              }}
            />
          </label>

          {/* Preview selected images */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
          <CardDescription>Additional product specifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.specifications.material}
                onChange={(e) =>
                  handleSpecificationChange("material", e.target.value)
                }
                placeholder="e.g., Brass, Silver, Wood"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.specifications.dimensions}
                onChange={(e) =>
                  handleSpecificationChange("dimensions", e.target.value)
                }
                placeholder="e.g., 12 x 8 x 2 inches"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.specifications.weight}
                onChange={(e) =>
                  handleSpecificationChange("weight", e.target.value)
                }
                placeholder="e.g., 500 grams"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finish">Finish</Label>
              <Input
                id="finish"
                value={formData.specifications.finish}
                onChange={(e) =>
                  handleSpecificationChange("finish", e.target.value)
                }
                placeholder="e.g., Antique Gold, Polished"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.specifications.origin}
                onChange={(e) =>
                  handleSpecificationChange("origin", e.target.value)
                }
                placeholder="e.g., India, Handcrafted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="care">Care Instructions</Label>
              <Input
                id="care"
                value={formData.specifications.care}
                onChange={(e) =>
                  handleSpecificationChange("care", e.target.value)
                }
                placeholder="e.g., Hand wash with mild soap"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
