"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

interface OrderConfirmationProps {
  orderId: string
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  // Mock order data - in real app, fetch based on orderId
  const orderData = {
    id: orderId,
    date: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    status: "confirmed",
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    items: [
      {
        id: 1,
        name: "Brass Puja Thali Set",
        price: 299,
        quantity: 1,
        image: "/ornate-brass-puja-thali-with-decorative-patterns.png",
      },
      {
        id: 2,
        name: "Sandalwood Incense Sticks",
        price: 149,
        quantity: 2,
        image: "/premium-sandalwood-incense-sticks-bundle.png",
      },
    ],
    subtotal: 597,
    shipping: 0,
    tax: 107,
    total: 704,
    shippingAddress: {
      name: "John Doe",
      address: "123 Temple Street, Spiritual District",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    paymentMethod: "Credit Card ending in 1234",
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-6 mb-12">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Order ID: {orderData.id}
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Order Date: {orderData.date}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Order Confirmed</p>
                    <p className="text-sm text-green-600">Your order is being prepared</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Confirmed</Badge>
              </div>

              <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Estimated delivery: {orderData.estimatedDelivery}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {item.price * item.quantity}</p>
                    <p className="text-sm text-muted-foreground">Rs. {item.price} each</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{orderData.shippingAddress.name}</p>
                <p className="text-muted-foreground">{orderData.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                  {orderData.shippingAddress.pincode}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Rs. {orderData.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">Rs. {orderData.total}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">{orderData.paymentMethod}</p>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Link href="/products" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• You will receive an email confirmation shortly</p>
                <p>• Track your order status in your account</p>
                <p>• Contact support for any questions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                We'll prepare your items with care and ensure they're blessed for your spiritual journey.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Your order will be carefully packaged and shipped to your address within 1-2 business days.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Receive your authentic puja items and begin your spiritual practices with confidence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
