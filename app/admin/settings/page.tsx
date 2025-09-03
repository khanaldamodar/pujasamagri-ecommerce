"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    logo: null as File | string | null,
    favicon: null as File | string | null,
    paymentQr: null as File | string | null,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  // ✅ Fetch settings when page loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiUrl}setting`);
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();

        setBusinessSettings((prev) => ({
          ...prev,
          businessName: data.business_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          whatsapp: data.whatsapp || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          logo: data.logo ? `${imageUrl}${data.logo}` : null,
          favicon: data.favicon
            ? `${imageUrl}${data.favicon}`
            : null,
          paymentQr: data.payment_qr
            ? `${imageUrl}${data.payment_qr}`
            : null,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettings();
  }, []);

  const handleFileUpload = (
    field: "logo" | "favicon" | "paymentQr",
    file: File | null
  ) => {
    setBusinessSettings((prev) => ({ ...prev, [field]: file }));
  };

  const handleInputChange = (field: string, value: string) => {
    setBusinessSettings((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Save/Update settings
  const handleSaveBusinessSettings = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("business_name", businessSettings.businessName);
      formData.append("email", businessSettings.email);
      formData.append("phone", businessSettings.phone);
      formData.append("address", businessSettings.address);
      formData.append("whatsapp", businessSettings.whatsapp);
      formData.append("facebook", businessSettings.facebook);
      formData.append("instagram", businessSettings.instagram);

      if (businessSettings.logo instanceof File) {
        formData.append("logo", businessSettings.logo);
      }

      if (businessSettings.favicon instanceof File) {
        formData.append("favicon", businessSettings.favicon);
      }

      if (businessSettings.paymentQr instanceof File) {
        formData.append("payment_qr", businessSettings.paymentQr);
      }

      const res = await fetch(`${apiUrl}setting`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Error saving settings:", data);
        alert("Failed to save settings!");
        return;
      }

      alert("Business settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving settings!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store settings and preferences
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Business Information</span>
            </CardTitle>
            <CardDescription>
              Configure your business details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="businessName"
                  className="flex items-center space-x-2"
                >
                  <Store className="h-4 w-4" />
                  <span>Business Name</span>
                </Label>
                <Input
                  id="businessName"
                  value={businessSettings.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  value={businessSettings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Number</span>
                </Label>
                <Input
                  id="whatsapp"
                  value={businessSettings.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Business Address</span>
              </Label>
              <Textarea
                id="address"
                value={businessSettings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Social Media Links</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="facebook"
                    className="flex items-center space-x-2"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook URL</span>
                  </Label>
                  <Input
                    id="facebook"
                    value={businessSettings.facebook}
                    onChange={(e) =>
                      handleInputChange("facebook", e.target.value)
                    }
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="instagram"
                    className="flex items-center space-x-2"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram URL</span>
                  </Label>
                  <Input
                    id="instagram"
                    value={businessSettings.instagram}
                    onChange={(e) =>
                      handleInputChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Branding & Assets</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Business Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    {businessSettings.logo ? (
                      <img
                        src={
                          typeof businessSettings.logo === "string"
                            ? businessSettings.logo // from API
                            : URL.createObjectURL(businessSettings.logo) // newly uploaded
                        }
                        alt="Logo Preview"
                        className="h-20 w-auto mb-2 object-contain"
                      />
                    ) : (
                      <Upload className="h-8 w-8 mb-2 text-gray-400" />
                    )}

                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("logo", e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                    <Label
                      htmlFor="logo"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                    >
                      {businessSettings.logo
                        ? businessSettings.businessName + " Logo"
                        : "Upload Logo"}
                    </Label>
                  </div>
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    {businessSettings.favicon ? (
                      <img
                        src={
                          typeof businessSettings.favicon === "string"
                            ? businessSettings.favicon // from API
                            : URL.createObjectURL(businessSettings.favicon) // newly uploaded
                        }
                        alt="Logo Preview"
                        className="h-20 w-auto mb-2 object-contain"
                      />
                    ) : (
                      <Upload className="h-8 w-8 mb-2 text-gray-400" />
                    )}
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("favicon", e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                    <Label
                      htmlFor="favicon"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                    >
                      {businessSettings.favicon
                        ? businessSettings.businessName + " Favicon"
                        : "Upload Favicon"}
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentQr">Payment QR Code</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    {businessSettings.paymentQr ? (
                      <img
                        src={
                          typeof businessSettings.paymentQr === "string"
                            ? businessSettings.paymentQr // from API
                            : URL.createObjectURL(businessSettings.paymentQr) // newly uploaded
                        }
                        alt="Logo Preview"
                        className="h-20 w-auto mb-2 object-contain"
                      />
                    ) : (
                      <Upload className="h-8 w-8 mb-2 text-gray-400" />
                    )}
                    <Input
                      id="paymentQr"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "paymentQr",
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                    />
                    <Label
                      htmlFor="paymentQr"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                    >
                      {businessSettings.paymentQr
                        ? businessSettings.businessName + " QR Code"
                        : "Upload QR Code"}
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveBusinessSettings}
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Business Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts for new customer orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Reports</Label>
                <p className="text-sm text-muted-foreground">Weekly sales and performance reports</p>
              </div>
              <Switch />
            </div>
            <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
