"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  QrCode,
  CheckCircle,
  Clock,
  Truck,
  ShoppingBag,
} from "lucide-react"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"

export function AccountContent() {
  const { user, updateOrderStatus } = useUser()

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">No Account Found</h2>
            <p className="text-muted-foreground">
              Please place an order to create your account and track your purchases.
            </p>
          </div>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-green-600" />
      case "qr code":
        return <QrCode className="h-4 w-4 text-blue-600" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and track your orders</p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
        </TabsList>

        {/* Order History Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Your Orders ({user?.orders?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!user?.orders||user.orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {user.orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(order.date).toLocaleDateString("en-IN")}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {getPaymentIcon(order.paymentMethod)}
                                  <span>{order.paymentMethod}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-primary">Rs. {order.total}</div>
                              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                {order.paymentStatus === "paid"
                                  ? "Paid"
                                  : order.paymentStatus === "pending"
                                    ? "Payment Pending"
                                    : "Payment Failed"}
                              </Badge>
                            </div>
                          </div>

                          <Separator />

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Items Ordered:</h4>
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-sm font-medium">Rs. {item.price * item.quantity}</div>
                              </div>
                            ))}
                          </div>

                          {/* Order Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {order.paymentStatus === "pending" && order.paymentMethod === "WhatsApp" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Simulate payment confirmation
                                  updateOrderStatus(order.id, "confirmed", "paid")
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark as Paid
                              </Button>
                            )}
                            {order.status === "confirmed" && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Being Prepared</span>
                              </Badge>
                            )}
                            {order.status === "shipped" && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <Truck className="h-3 w-3" />
                                <span>In Transit</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Details Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{user.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{user.address}</p>
                <p className="text-muted-foreground">
                  {user.city}, {user.state} - {user.pincode}
                </p>
                <p className="text-muted-foreground">{user.country}</p>
              </CardContent>
            </Card>
          </div>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user?.orders?.length}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user?.orders?.filter((o) => o.paymentStatus === "paid").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Paid Orders</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {user?.orders?.filter((o) => o.paymentStatus === "pending").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Payment</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    Rs. {user?.orders?.reduce((sum, order) => sum + order.total, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
