"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  quantity: number
  stock: number
  brand: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE_CART"; payload: CartState } // 👈 restore from cookies

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item,
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, Math.min(action.payload.quantity, item.stock)) }
            : item,
        )
        .filter((item) => item.quantity > 0)

      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return initialState

    case "HYDRATE_CART":
      return action.payload

    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // ✅ Load cart from cookies when app loads
  useEffect(() => {
    const cookieCart = Cookies.get("cart")
    if (cookieCart) {
      try {
        const parsed = JSON.parse(cookieCart) as CartState
        dispatch({ type: "HYDRATE_CART", payload: parsed })
      } catch (e) {
        console.error("Invalid cart cookie:", e)
      }
    }
  }, [])

  // ✅ Save cart to cookies whenever it changes
  useEffect(() => {
    Cookies.set("cart", JSON.stringify(state), { expires: 7 }) // 7 days expiry
  }, [state])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
