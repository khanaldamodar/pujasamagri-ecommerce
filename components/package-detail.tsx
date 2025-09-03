"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Package,
  Gift,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface PackageDetailProps {
  packageId: string;
}

export function PackageDetail({ packageId }: PackageDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  // ✅ Fetch Package Data
  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(
          `${apiUrl}packages/${packageId}`
        );
        const json = await res.json();
        if (json.success) {
          setPackageData(json.data);
        }
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [packageId]);

  if (loading) return <p>Loading package details...</p>;
  if (!packageData) return <p>Package not found.</p>;

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: packageData.id,
        name: packageData.name,
        price: parseFloat(packageData.price),
        originalPrice: null,
        image: packageData.products[0]?.images?.[0] || "/placeholder.svg",
        stock: packageData.products.reduce(
          (sum: number, p: any) => sum + (p.stock ?? 0),
          0
        ),
        brand: "Custom Package",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Package Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={
              packageData.products[selectedImage]?.images?.length
                ? `${imageUrl}${packageData.products[selectedImage].images[0]}`
                : "/placeholder.svg"
            }
            alt={packageData.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {packageData.products.map((product: any, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <img
                src={  `${imageUrl}${product.images?.[0]}` || "/placeholder.svg"}
                alt={`${product.name}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Package Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {packageData.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            {packageData.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary">
              Rs. {packageData.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Includes {packageData.products.length} products
          </p>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add Package to Cart - Rs. {parseFloat(packageData.price) * quantity}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Items Included</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <div className="grid gap-3">
              {packageData.products.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-sm font-semibold">Rs. {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-2">
              {/* <p><strong>Slug:</strong> {packageData.slug}</p> */}
              <p>
                <strong>Status:</strong>{" "}
                {packageData.status ? "Active" : "Inactive"}
              </p>
              <p>
                <strong>Product Added On:</strong>{" "}
                {new Date(packageData.created_at).toLocaleDateString()}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
