"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"

export default function AdminOrders() {
  const orders = [
    {
      id: "ORD-001",
      customer: "Priya Sharma",
      email: "priya@example.com",
      amount: 899,
      status: "confirmed",
      date: "2024-01-15",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Raj Patel",
      email: "raj@example.com",
      amount: 649,
      status: "processing",
      date: "2024-01-15",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Anita Singh",
      email: "anita@example.com",
      amount: 1199,
      status: "shipped",
      date: "2024-01-14",
      items: 5,
    },
  ]

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>Rs. {order.amount}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
