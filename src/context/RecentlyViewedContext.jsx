// Fix #9 — Recently Viewed context
import { createContext, useContext, useState, useCallback } from 'react'

const RecentlyViewedContext = createContext()

export function RecentlyViewedProvider({ children }) {
  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('rv') || '[]') } catch { return [] }
  })

  const addViewed = useCallback((product) => {
    setViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      const next = [product, ...filtered].slice(0, 8)
      try { sessionStorage.setItem('rv', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearViewed = useCallback(() => {
    setViewed([])
    try { sessionStorage.removeItem('rv') } catch {}
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ viewed, addViewed, clearViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext)
}
