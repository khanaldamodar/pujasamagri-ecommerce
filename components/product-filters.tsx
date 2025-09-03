"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const categories = [
    "Pooja Thalis",
    "Incense & Dhoop",
    "Idols & Statues",
    "Puja Accessories",
    "Sacred Books",
    "Decorative Items",
    "Brass Items",
    "Silver Items",
  ]

  const brands = [
    "Divine Crafts",
    "Sacred Arts",
    "Spiritual Store",
    "Temple Treasures",
    "Holy Items",
    "Blessed Collection",
  ]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const clearAllFilters = () => {
    setPriceRange([0, 2000])
    setSelectedCategories([])
    setSelectedBrands([])
  }

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="mr-2 mb-2">
                {category}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(category, false)} />
              </Badge>
            ))}
            {selectedBrands.map((brand) => (
              <Badge key={brand} variant="secondary" className="mr-2 mb-2">
                {brand}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleBrandChange(brand, false)} />
              </Badge>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Badge variant="secondary" className="mr-2 mb-2">
                Rs. {priceRange[0]} - Rs. {priceRange[1]}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 2000])} />
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={2000} min={0} step={50} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Rs. {priceRange[0]}</span>
            <span>Rs. {priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brand Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <label
                htmlFor={brand}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {brand}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
