/**
 * CartContext.jsx
 *
 * WHY CONTEXT API?
 * Cart data needs to be accessible from many components (Navbar shows count,
 * ProductCard has "Add to Cart", Cart page shows all items).
 * Instead of prop-drilling through every component, we use React Context
 * to make cart state globally available.
 *
 * WHY localStorage?
 * Without it, refreshing the page empties the cart — terrible UX.
 * We sync every cart update to localStorage so it persists.
 */

import { createContext, useContext, useReducer, useEffect } from 'react'

// 1. Create the context object
const CartContext = createContext(null)

// 2. Reducer — a pure function that handles all cart operations
//    Pattern: (currentState, action) => newState
//    Actions describe WHAT happened, reducer decides HOW state changes
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const exists = state.find(item => item.id === action.payload.id)
      if (exists) {
        // Item already in cart → increase quantity
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // New item → add with quantity 1
      return [...state, { ...action.payload, quantity: 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload)

    case 'UPDATE_QTY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      )

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

// 3. Provider — wraps the app and makes cart state available everywhere
export function CartProvider({ children }) {
  // Initialize from localStorage so cart persists on refresh
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    (initial) => {
      try {
        const stored = localStorage.getItem('luxe-cart')
        return stored ? JSON.parse(stored) : initial
      } catch {
        return initial
      }
    }
  )

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('luxe-cart', JSON.stringify(cart))
  }, [cart])

  // Derived values (computed from state, no need to store separately)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Action creators — cleaner than calling dispatch directly in components
  const addToCart    = (product) => dispatch({ type: 'ADD_ITEM',    payload: product })
  const removeFromCart = (id)    => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty    = (id, qty) => dispatch({ type: 'UPDATE_QTY',  payload: { id, quantity: qty } })
  const clearCart    = ()        => dispatch({ type: 'CLEAR_CART' })

  const isInCart = (id) => cart.some(item => item.id === id)

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

// 4. Custom hook — components use this instead of useContext directly
//    Gives us a nicer API and prevents using context outside Provider
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
