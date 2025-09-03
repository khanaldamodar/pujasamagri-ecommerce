"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie"
export interface Order {
  id: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  date: string
}

export interface User {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  orders: Order[]
}

interface UserContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: User & { password: string }) => Promise<boolean>
  logout: () => void
  createUser: (userData: User) => void
  updateUser: (userData: Partial<User>) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

 const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await fetch(`${apiUrl}customers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Login failed:", errorData);
      return false;
    }

    const userData = await res.json();

    // Save logged-in user in cookie
    setUser(userData);
    setIsLoggedIn(true);
    Cookies.set("pujasamagri_current_user", JSON.stringify(userData), { expires: 7 });

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};


const register = async (formData: any) => {
  // Map camelCase to snake_case for Laravel
  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone_number: formData.phone, // map phone to phone_number
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    password: formData.password,
  };

  console.log("Registering user with data:", payload);

  const res = await fetch(`${apiUrl}customers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // IMPORTANT
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Registration failed:", errorData);
    throw new Error("Failed to register");
  }

  return await res.json();
};




  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    // localStorage.removeItem("pujasamagri_current_user")
    Cookies.remove("pujasamagri_current_user")
  }

  const createUser = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    // localStorage.setItem("pujasamagri_current_user", JSON.stringify(userData))
    Cookies.set("pujasamagri_current_user", JSON.stringify(userData), { expires: 7 }) // Example cookie
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      // localStorage.setItem("pujasamagri_current_user", JSON.stringify(updatedUser))
      Cookies.set("pujasamagri_current_user", JSON.stringify(updatedUser), { expires: 7 }) // Example cookie
    }
  }

  const addOrder = (order: Order) => {
    if (user) {
      const updatedUser = {
        ...user,
        orders: [order, ...user.orders],
      }
      setUser(updatedUser)
      // localStorage.setItem("pujasamagri_current_user", JSON.stringify(updatedUser))
      Cookies.set("pujasamagri_current_user", JSON.stringify(updatedUser), { expires: 7 }) // Example cookie
    }
  }

  const updateOrderStatus = (orderId: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => {
    if (user) {
      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status, ...(paymentStatus && { paymentStatus }) } : order,
      )
      const updatedUser = { ...user, orders: updatedOrders }
      setUser(updatedUser)
      // localStorage.setItem("pujasamagri_current_user", JSON.stringify(updatedUser))
      Cookies.set("pujasamagri_current_user", JSON.stringify(updatedUser), { expires: 7 }) // Example cookie
    }
  }

  useEffect(() => {
    // const savedUser = localStorage.getItem("pujasamagri_current_user")
    const savedUser = Cookies.get("pujasamagri_current_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        register,
        logout,
        createUser,
        updateUser,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
