/**
 * WishlistContext.jsx
 *
 * Same pattern as CartContext but simpler — wishlist is just a set of product IDs.
 * Notice how we reuse the same Context + useReducer + localStorage pattern.
 * This is what "scalable" code looks like — consistent patterns across features.
 */

import { createContext, useContext, useReducer, useEffect } from 'react'

const WishlistContext = createContext(null)

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state.includes(action.payload)
        ? state.filter(id => id !== action.payload)   // remove if exists
        : [...state, action.payload]                   // add if not exists
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(
    wishlistReducer,
    [],
    () => {
      try {
        const stored = localStorage.getItem('luxe-wishlist')
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
  )

  useEffect(() => {
    localStorage.setItem('luxe-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist  = (id) => dispatch({ type: 'TOGGLE', payload: id })
  const isWishlisted    = (id) => wishlist.includes(id)
  const wishlistCount   = wishlist.length

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}
