"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ShoppingBag, Package, TrendingUp, Users, AlertTriangle, IndianRupee, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const dashboardStats = {
    totalRevenue: 45680,
    totalOrders: 234,
    totalProducts: 24,
    totalPackages: 8,
    lowStockItems: 5,
    averageRating: 4.6,
    topSellingProducts: [
      { id: 1, name: "Brass Puja Thali Set", sales: 67, revenue: 20033, stock: 15 },
      { id: 2, name: "Sandalwood Incense Sticks", sales: 123, revenue: 18327, stock: 8 },
      { id: 5, name: "Rudraksha Mala 108 Beads", sales: 156, revenue: 93444, stock: 20 },
    ],
    topSellingPackages: [
      { id: 1, name: "Complete Ganesh Puja Kit", sales: 156, revenue: 140244, stock: 25 },
      { id: 3, name: "Daily Puja Starter Kit", sales: 234, revenue: 93366, stock: 42 },
      { id: 2, name: "Lakshmi Puja Essentials", sales: 89, revenue: 57761, stock: 18 },
    ],
    recentOrders: [
      { id: "ORD-001", customer: "Priya Sharma", amount: 899, status: "confirmed", date: "2024-01-15" },
      { id: "ORD-002", customer: "Raj Patel", amount: 649, status: "processing", date: "2024-01-15" },
      { id: "ORD-003", customer: "Anita Singh", amount: 1199, status: "shipped", date: "2024-01-14" },
    ],
    lowStockProducts: [
      { id: 3, name: "Marble Ganesha Idol", stock: 3, category: "Idols & Statues" },
      { id: 6, name: "Silver Plated Aarti Plate", stock: 7, category: "Silver Items" },
      { id: 2, name: "Sandalwood Incense Sticks", stock: 8, category: "Incense & Dhoop" },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "shipped":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {dashboardStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{dashboardStats.lowStockItems} low stock</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Avg rating {dashboardStats.averageRating}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Selling Products</span>
            </CardTitle>
            <CardDescription>Best performing individual products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardStats.topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">Rs. {product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
            <Link href="/admin/products">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View All Products
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Top Selling Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Top Selling Packages</span>
            </CardTitle>
            <CardDescription>Best performing package bundles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardStats.topSellingPackages.map((pkg, index) => (
              <div key={pkg.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-sm font-medium text-secondary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{pkg.name}</p>
                    <p className="text-xs text-muted-foreground">{pkg.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">Rs. {pkg.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Stock: {pkg.stock}</p>
                </div>
              </div>
            ))}
            <Link href="/admin/packages">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View All Packages
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardStats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                  <div className="text-right">
                    <p className="font-medium text-sm">Rs. {order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Low Stock Alert</span>
            </CardTitle>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardStats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={(product.stock / 25) * 100} className="w-16 h-2" />
                  <Badge variant="destructive" className="text-xs">
                    {product.stock} left
                  </Badge>
                </div>
              </div>
            ))}
            <Link href="/admin/products?filter=low-stock">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
