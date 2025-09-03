"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";

export function ProductsGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const itemsPerPage = 12;
  const { addItem } = useCart();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  //  Fetch products from API
  useEffect(() => {
    fetch(`${apiUrl}products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            originalPrice: p.original_price
              ? parseFloat(p.original_price)
              : null,
            rating: parseFloat(p.rating) || 0,
            reviews: p.reviews || 0,
            // ⬇️ store only relative path
            image:
              p.images && p.images.length > 0
                ? p.images[0]
                : "/placeholder.svg",
            category: p.category || "",
            brand: p.brand || "",
            isNew: p.is_new,
            discount: parseFloat(p.discount) || 0,
            stock: p.stock,
          }));

          setProducts(mapped);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      stock: product.stock,
      brand: product.brand,
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, products.length)} of{" "}
          {products.length} products
        </div>

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
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {currentProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}` || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-green-500 text-white">New</Badge>
                )}
                {product.discount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">
                      {product.rating.toFixed(1)}
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
                      रु.{" "}
                      {product.price.toLocaleString("ne-NP", {
                        minimumFractionDigits: 2,
                      })}
                    </span>

                    {/* {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {product.originalPrice}
                      </span>
                    )} */}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.stock > 10
                      ? "In Stock"
                      : `Only ${product.stock} left`}
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

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
            className="w-10"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
