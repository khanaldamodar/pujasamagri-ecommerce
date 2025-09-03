"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, Eye, Filter, Package } from "lucide-react";
import { PackageForm } from "@/components/admin/package-form";
import Link from "next/link";

export default function AdminPackages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${apiUrl}packages`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Map API response into frontend format
          const mapped = json.data.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            description: pkg.description,
            price: Number(pkg.price) || 0,
            originalPrice: Number(pkg.original_price) || 0,
            category: pkg.category ?? "Uncategorized",
            stock:
              pkg.products?.reduce(
                (sum: number, p: any) => sum + (Number(p.stock) || 0),
                0
              ) || 0,
            rating: pkg.products?.length ? 4.5 : 0, // placeholder
            reviews: pkg.products?.length || 0,
            badge: "",
            image: pkg.products?.[0]?.images?.[0]
              ? `${imageUrl}${pkg.products[0].images[0]}`
              : "/placeholder.svg",
            status: pkg.status === 1 ? "active" : "inactive",
            items:
              pkg.products?.map((p: any) => ({
                productId: p.id,
                name: p.name,
                price: Number(p.price) || 0,
                quantity: p.pivot?.quantity || 1,
              })) || [],
            occasions: [],
            difficulty: "",
            duration: "",
          }));
          setPackages(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const categories = [
    "Festival Kits",
    "Daily Puja",
    "Deity Specific",
    "Ceremony Kits",
  ];

  const filteredPackages = packages.filter((pkg) => {
    const name = pkg?.name ?? "";
    const description = pkg?.description ?? "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (pkg?.category ?? "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a?.name ?? "").localeCompare(b?.name ?? "");
      case "price":
        return (Number(a?.price) || 0) - (Number(b?.price) || 0);
      case "stock":
        return (Number(a?.stock) || 0) - (Number(b?.stock) || 0);
      default:
        return 0;
    }
  });

  const handleCreatePackage = (packageData: any) => {
    // same logic as before, will append new package locally
    const newPackage = {
      id: packages.length + 1,
      name: packageData?.name ?? "Untitled Package",
      description: packageData?.description ?? "",
      price: Number(packageData?.price) || 0,
      originalPrice: Number(packageData?.originalPrice) || 0,
      category: packageData?.category ?? "Uncategorized",
      stock: Number(packageData?.stock) || 0,
      rating: 0,
      reviews: 0,
      badge: packageData?.badge ?? "",
      image: packageData?.image ?? "/placeholder.svg",
      status: "active",
      items: Array.isArray(packageData?.items) ? packageData.items : [],
    };
    setPackages([...packages, newPackage]);
    setShowPackageForm(false);
  };

 const handleUpdatePackage = async (packageData: any) => {
  if (!editingPackage) return;

  try {
    const res = await fetch(`${apiUrl}packages/${editingPackage.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: packageData?.name,
        description: packageData?.description,
        price: packageData?.price,
        status: packageData?.status === "active" ? 1 : 0,
        product_ids: Array.isArray(packageData?.items)
          ? packageData.items.map((item: any) => item.productId)
          : [],
      }),
    });

    const json = await res.json();

    if (json.success) {
      // Update local state with response from API
      setPackages(
        packages.map((pkg) =>
          pkg.id === editingPackage.id
            ? {
                ...pkg,
                ...json.data,
                price: Number(json.data.price) || 0,
                description: json.data.description,
                items: json.data.products?.map((p: any) => ({
                  productId: p.id,
                  name: p.name,
                  price: Number(p.price) || 0,
                  quantity: p.pivot?.quantity || 1,
                })) || [],
                status: json.data.status === 1 ? "active" : "inactive",
              }
            : pkg
        )
      );
      setEditingPackage(null);
    } else {
      console.error("Failed to update package:", json.message, json.errors);
      alert("Failed to update package. Please check input.");
    }
  } catch (error) {
    console.error("Error updating package:", error);
    alert("Something went wrong while updating the package.");
  }
};


  const handleDeletePackage = async (packageId: number) => {
  try {
    const res = await fetch(`${apiUrl}packages/${packageId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await res.json();
    // console.log(json)

    if (res.ok && json.success) {
      // Remove package from UI state
      setPackages(packages.filter((pkg) => pkg.id !== packageId));
    } else {
      console.error("Failed to delete package:", json.message || "Unknown error");
      alert(json.message || "Failed to delete package.");
    }
  } catch (error) {
    console.error("Error deleting package:", error);
    alert("Something went wrong while deleting the package.");
  }
};


  const calculatePackageValue = (items: any[] = []) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce(
      (total, item) =>
        total + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
      0
    );
  };

  const getStockStatus = (stock: number = 0) => {
    if (stock <= 0) return { label: "Out of Stock", color: "bg-red-500" };
    if (stock <= 10) return { label: "Low Stock", color: "bg-yellow-500" };
    return { label: "In Stock", color: "bg-green-500" };
  };

  if (loading) {
    return <div className="p-6">Loading packages...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Packages</h1>
          <p className="text-muted-foreground">
            Manage your product packages and bundles
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowPackageForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Package
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
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

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Packages ({sortedPackages.length})</CardTitle>
          <CardDescription>
            Manage your curated product bundles and festival kits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPackages.map((pkg) => {
                  const stockStatus = getStockStatus(pkg.stock);
                  const packageValue = calculatePackageValue(pkg.items);
                  const savings = packageValue - pkg.price;

                  return (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={pkg.image || "/placeholder.svg"}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{pkg.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {pkg.description?.length > 60
                                ? pkg.description.slice(0, 60) + "..."
                                : pkg.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{pkg.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {pkg.items.length} items
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Value: Rs. {packageValue}
                          </p>
                          {savings > 0 && (
                            <p className="text-xs text-green-600">
                              Save Rs. {savings}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">Rs. {pkg.price}</p>
                          {pkg.originalPrice > pkg.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              Rs. {pkg.originalPrice}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{pkg.stock}</span>
                          <Badge
                            className={`${stockStatus.color} text-white text-xs`}
                          >
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{pkg.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({pkg.reviews})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 text-white">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/packages/${pkg.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPackage(pkg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Package
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{pkg.name}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePackage(pkg.id)}
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {sortedPackages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p>No packages found matching your criteria.</p>
              <p className="text-sm">
                Try adjusting your filters or create a new package.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Form Dialog */}
      <Dialog open={showPackageForm} onOpenChange={setShowPackageForm}>
        <DialogContent className="w-full sm:max-w-3xl md:max-w-5xl lg:max-w-[1400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
            <DialogDescription>
              Create a new package by selecting products and setting bundle
              details
            </DialogDescription>
          </DialogHeader>
          <PackageForm
            onSubmit={handleCreatePackage}
            onCancel={() => setShowPackageForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog
        open={!!editingPackage}
        onOpenChange={() => setEditingPackage(null)}
      >
        <DialogContent className="w-full sm:max-w-3xl md:max-w-5xl lg:max-w-[1400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>
              Update package information and product selection
            </DialogDescription>
          </DialogHeader>
          <PackageForm
            package={editingPackage}
            onSubmit={handleUpdatePackage}
            onCancel={() => setEditingPackage(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
