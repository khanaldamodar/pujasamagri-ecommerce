import { OrderConfirmation } from "@/components/order-confirmation"

interface OrderConfirmationPageProps {
  params: {
    orderId: string
  }
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <OrderConfirmation orderId={params.orderId} />
    </div>
  )
}
