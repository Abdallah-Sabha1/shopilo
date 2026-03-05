// Fix #5 — Efficient wishlist: fetch only wishlisted product IDs, not all 100
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard'

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); return }

    let cancelled = false
    setLoading(true)

    // Fetch only the specific products in the wishlist — no more loading 100 products
    Promise.all(
      wishlist.map(id =>
        fetch(`https://dummyjson.com/products/${id}`).then(r => r.ok ? r.json() : null)
      )
    ).then(results => {
      if (!cancelled) {
        setProducts(results.filter(Boolean))
        setLoading(false)
      }
    }).catch(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [wishlist])

  if (wishlist.length === 0) return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-[56px] mb-5">🤍</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[36px] font-bold mb-3">Your wishlist is empty</h2>
        <p className="text-[#8a8a8a] text-[14px] mb-8">Save products you love for later.</p>
        <Link to="/shop" className="px-8 py-3 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200 inline-block">
          Browse Products
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-[72px] bg-[#FAFAF8] min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-[#E8521A] mb-3">Saved Items</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(32px,4vw,52px)] font-bold">Wishlist</h1>
          <p className="text-[13px] text-[#8a8a8a] mt-2">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {loading ? <SkeletonGrid count={wishlist.length} /> : products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </main>
  )
}
