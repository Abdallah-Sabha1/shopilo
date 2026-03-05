/**
 * useProducts.js — Custom Hook
 *
 * WHY CUSTOM HOOKS?
 * This hook handles all the logic for fetching products from the API.
 * By extracting it from the component, our Shop page stays clean and readable.
 * The component just calls: const { products, loading, error } = useProducts()
 *
 * API: https://dummyjson.com/docs/products
 * Free, no API key, real product data with images.
 */

import { useState, useEffect } from 'react'

const BASE_URL = 'https://dummyjson.com'

// ---------- fetch all products (with optional category filter) ----------
export function useProducts({ category = '', limit = 30, skip = 0 } = {}) {
  const [products, setProducts] = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let cancelled = false   // prevents setting state after component unmounts

    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        // Build the URL depending on whether a category filter is active
        const url = category
          ? `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
          : `${BASE_URL}/products?limit=${limit}&skip=${skip}`

        const res  = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data = await res.json()

        if (!cancelled) {
          setProducts(data.products)
          setTotal(data.total)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()
    return () => { cancelled = true }  // cleanup on unmount or dependency change
  }, [category, limit, skip])

  return { products, total, loading, error }
}

// ---------- fetch a single product by ID ----------
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        const res  = await fetch(`${BASE_URL}/products/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProduct()
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}

// ---------- fetch all categories ----------
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/products/categories`)
      .then(r => r.json())
      .then(data => {
        // API returns array of {slug, name, url} objects
        setCategories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { categories, loading }
}

// ---------- search products ----------
export function useSearch(query) {
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    let cancelled = false

    async function search() {
      try {
        setLoading(true)
        const res  = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (!cancelled) setResults(data.products)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    search()
    return () => { cancelled = true }
  }, [query])

  return { results, loading, error }
}
