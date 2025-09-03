"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  QrCode,
  Lock,
  Truck,
  Shield,
  CheckCircle,
  User,
  UserPlus,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useUser } from "@/contexts/user-context";
import Link from "next/link";

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface AuthForm {
  email: string;
  password: string;
  confirmPassword: string;
  isLogin: boolean;
}

export function CheckoutContent() {
  const { items, total, itemCount, clearCart } = useCart();
  const { user, isLoggedIn, login, register, createUser, addOrder } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrPaymentStatus, setQrPaymentStatus] = useState<"pending" | "paid">(
    "pending"
  );

  const [authForm, setAuthForm] = useState<AuthForm>({
    email: "",
    password: "",
    confirmPassword: "",
    isLogin: true,
  });

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
    country: user?.country || "India",
  });

  const [errors, setErrors] = useState<Partial<BillingDetails & AuthForm>>({});

  const validateAuthForm = (): boolean => {
    const newErrors: Partial<AuthForm> = {};

    if (!authForm.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(authForm.email))
      newErrors.email = "Email is invalid";

    if (!authForm.password.trim()) newErrors.password = "Password is required";
    else if (authForm.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!authForm.isLogin) {
      if (!authForm.confirmPassword.trim())
        newErrors.confirmPassword = "Confirm password is required";
      else if (authForm.password !== authForm.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BillingDetails> = {};

    if (!billingDetails.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!billingDetails.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!billingDetails.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(billingDetails.email))
      newErrors.email = "Email is invalid";
    if (!billingDetails.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(billingDetails.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone number must be 10 digits";
    if (!billingDetails.address.trim())
      newErrors.address = "Address is required";
    if (!billingDetails.city.trim()) newErrors.city = "City is required";
    if (!billingDetails.state.trim()) newErrors.state = "State is required";
    if (!billingDetails.pincode.trim())
      newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(billingDetails.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAuthForm()) return;

    setIsProcessing(true);

    try {
      if (authForm.isLogin) {
        const success = await login(authForm.email, authForm.password);
        if (!success) {
          setErrors((prev) => ({
            ...prev,
            password: "Invalid email or password",
          }));
          setIsProcessing(false);
          return;
        }
      } else {
        if (!validateForm()) {
          setIsProcessing(false);
          return;
        }

        const success = await register({
          ...billingDetails,
          email: authForm.email,
          password: authForm.password,
          orders: [],
        });

        if (!success) {
          setErrors((prev) => ({
            ...prev,
            email: "User with this email already exists",
          }));
          setIsProcessing(false);
          return;
        }
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, password: "Authentication failed" }));
    }

    setIsProcessing(false);
  };

  const handleInputChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAuthInputChange = (
    field: keyof AuthForm,
    value: string | boolean
  ) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const subtotal = total;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.13);
  const finalTotal = subtotal + shipping + tax;

  const generateWhatsAppMessage = () => {
    const orderDetails = items
      .map(
        (item) =>
          `• ${item.name} (Qty: ${item.quantity}) - Rs. ${
            item.price * item.quantity
          }`
      )
      .join("\n");

    const message = `🙏 *New Order from PujaSamagri*

*Customer Details:*
Name: ${billingDetails.firstName} ${billingDetails.lastName}
Phone: ${billingDetails.phone}
Email: ${billingDetails.email}

*Delivery Address:*
${billingDetails.address}
${billingDetails.city}, ${billingDetails.state} - ${billingDetails.pincode}

*Order Items:*
${orderDetails}

*Order Summary:*
Subtotal: Rs. ${subtotal}
Shipping: ${shipping === 0 ? "Free" : `Rs. ${shipping}`}
Tax (18%): Rs. ${tax}
*Total: Rs. ${finalTotal}*

Please confirm this order and provide payment details. Thank you! 🙏`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppPayment = () => {
    if (!validateForm()) return;

    const whatsappNumber = "9779851353789";
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder = {
      id: orderId,
      items,
      total: finalTotal,
      status: "pending" as const,
      paymentMethod: "WhatsApp",
      date: new Date().toISOString(),
      paymentStatus: "pending" as const,
    };

    if (isLoggedIn && user) {
      addOrder(newOrder);
    } else {
      createUser({
        ...billingDetails,
        orders: [newOrder],
      });
    }

    window.open(whatsappUrl, "_blank");
    clearCart();
    router.push("/account");
  };

  const handleQRPayment = async () => {
    if (!validateForm()) return;

    setShowQRCode(true);
    setIsProcessing(true);

    setTimeout(() => {
      setQrPaymentStatus("paid");
      setIsProcessing(false);

      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const newOrder = {
        id: orderId,
        items,
        total: finalTotal,
        status: "confirmed" as const,
        paymentMethod: "QR Code",
        date: new Date().toISOString(),
        paymentStatus: "paid" as const,
      };

      if (isLoggedIn && user) {
        addOrder(newOrder);
      } else {
        createUser({
          ...billingDetails,
          orders: [newOrder],
        });
      }

      clearCart();
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "whatsapp") {
      handleWhatsAppPayment();
    } else if (paymentMethod === "qrcode") {
      handleQRPayment();
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground">Complete your order below</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!isLoggedIn && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {authForm.isLogin ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <UserPlus className="h-5 w-5" />
                  )}
                  <span>
                    {authForm.isLogin
                      ? "Login to Your Account"
                      : "Create Account"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="flex space-x-4 mb-4">
                    <Button
                      type="button"
                      variant={authForm.isLogin ? "default" : "outline"}
                      onClick={() => handleAuthInputChange("isLogin", true)}
                      className="flex-1"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant={!authForm.isLogin ? "default" : "outline"}
                      onClick={() => handleAuthInputChange("isLogin", false)}
                      className="flex-1"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auth-email">Email Address *</Label>
                    <Input
                      id="auth-email"
                      type="email"
                      value={authForm.email}
                      onChange={(e) =>
                        handleAuthInputChange("email", e.target.value)
                      }
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auth-password">Password *</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      value={authForm.password}
                      onChange={(e) =>
                        handleAuthInputChange("password", e.target.value)
                      }
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {!authForm.isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="auth-confirm-password">
                        Confirm Password *
                      </Label>
                      <Input
                        id="auth-confirm-password"
                        type="password"
                        value={authForm.confirmPassword}
                        onChange={(e) =>
                          handleAuthInputChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className={
                          errors.confirmPassword ? "border-destructive" : ""
                        }
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : authForm.isLogin
                      ? "Login"
                      : "Create Account & Continue"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {(!isLoggedIn && !authForm.isLogin) || isLoggedIn ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>
                    {isLoggedIn
                      ? "Delivery Information"
                      : "Customer Information"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={billingDetails.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={billingDetails.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={billingDetails.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={errors.email ? "border-destructive" : ""}
                      disabled={isLoggedIn}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={billingDetails.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={billingDetails.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={billingDetails.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={billingDetails.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={billingDetails.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {isLoggedIn || (!isLoggedIn && !authForm.isLogin) ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label
                        htmlFor="whatsapp"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                        <span>WhatsApp Order</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="qrcode" id="qrcode" />
                      <Label
                        htmlFor="qrcode"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <QrCode className="h-4 w-4 text-blue-600" />
                        <span>QR Code Payment</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "whatsapp" && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            WhatsApp Order
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Your order details will be sent to our WhatsApp
                            business number. Our team will confirm your order
                            and provide payment instructions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "qrcode" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            QR Code Payment
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Scan the QR code with any UPI app to make instant
                            payment. Your order will be confirmed automatically
                            after payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {showQRCode && paymentMethod === "qrcode" && (
                    <div className="mt-4 p-6 bg-white rounded-lg border-2 border-blue-200 text-center">
                      {qrPaymentStatus === "pending" ? (
                        <div className="space-y-4">
                          <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border">
                            <img
                              src="/payment-qr.png"
                              alt="Payment QR Code"
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              Scan to Pay Rs. {finalTotal}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Use any UPI app to scan and pay
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Payment will be confirmed automatically
                            </p>
                          </div>
                          {isProcessing && (
                            <div className="flex items-center justify-center space-x-2 text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="text-sm">
                                Waiting for payment...
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">
                              Payment Successful!
                            </h4>
                            <p className="text-sm text-green-600 mt-1">
                              Redirecting to your account...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={
                      isProcessing ||
                      (showQRCode && qrPaymentStatus === "pending")
                    }
                  >
                    {paymentMethod === "whatsapp"
                      ? `Send to WhatsApp - Rs. ${finalTotal}`
                      : showQRCode && qrPaymentStatus === "pending"
                      ? "Waiting for Payment..."
                      : `Pay via QR Code - Rs. ${finalTotal}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      Rs. {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (13%)</span>
                  <span>Rs. {tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">Rs. {finalTotal}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="h-3 w-3" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-3 w-3" />
                  <span>Free delivery on orders above Rs. 500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-3 w-3" />
                  <span>Safe and trusted payment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
