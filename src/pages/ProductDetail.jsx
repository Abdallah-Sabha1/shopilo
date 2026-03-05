import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../components/Toast/Toast'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import ProductCard from '../components/ProductCard/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard'
import { formatPrice, getRatingStars } from '../utils/helpers'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const { addToCart, isInCart }          = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { addToast } = useToast()
  // Fix #9 — track recently viewed
  const { viewed, addViewed } = useRecentlyViewed()
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)

  const { products: related } = useProducts({ category: product?.category, limit: 5 })
  const relatedFiltered = related.filter(p => p.id !== product?.id).slice(0, 4)

  // Fix #9 — add to recently viewed when product loads
  useEffect(() => {
    if (product) {
      addViewed({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, brand: product.brand, rating: product.rating, discountPercentage: product.discountPercentage, stock: product.stock, category: product.category })
    }
  }, [product, addViewed])

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, brand: product.brand, stock: product.stock })
    addToast(`${product.title} added to cart (x${qty})`)
  }

  if (loading) return (
    <main className="pt-[72px] min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square shimmer" />
          <div className="flex flex-col gap-5 pt-4">
            {[80, 55, 100, 65, 40].map((w, i) => <div key={i} className="shimmer h-4 rounded" style={{width:`${w}%`}} />)}
          </div>
        </div>
      </div>
    </main>
  )

  if (error || !product) return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[40px] font-bold mb-4">Product Not Found</h2>
        <p className="text-[#8a8a8a] mb-8">This product may have been removed.</p>
        <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200">
          Back to Shop
        </button>
      </div>
    </main>
  )

  const stars    = getRatingStars(product.rating)
  const images   = product.images?.length ? product.images : [product.thumbnail]
  const inCart   = isInCart(product.id)
  const wishlisted = isWishlisted(product.id)
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : null

  // Fix #9 — recently viewed excluding current product
  const recentlyViewed = viewed.filter(p => p.id !== product.id).slice(0, 4)

  return (
    <main className="pt-[72px] bg-[#FAFAF8]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-[#8a8a8a] mb-10 flex-wrap">
          {[['/', 'Home'], ['/shop', 'Shop'], [`/shop?category=${product.category}`, product.category]].map(([href, label]) => (
            <span key={href} className="flex items-center gap-2">
              <Link to={href} className="hover:text-[#E8521A] transition-colors capitalize">{label}</Link>
              <span className="text-[#E0D9D2]">/</span>
            </span>
          ))}
          <span className="text-[#141414] font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-20">

          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden bg-[#F2EDE8] group">
              <img src={images[selectedImg]} alt={product.title}
                onError={e => { e.target.src = product.thumbnail }}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {discount && <span className="absolute top-4 left-4 px-3 py-1 bg-[#141414] text-white text-[11px] font-bold tracking-[1.5px] uppercase">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2.5 flex-wrap">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`w-[72px] h-[72px] overflow-hidden border-2 transition-colors duration-200 ${i === selectedImg ? 'border-[#E8521A]' : 'border-transparent hover:border-[#141414]'}`}>
                    <img src={img} alt="" onError={e => { e.target.src = product.thumbnail }} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5 lg:pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#E8521A]">{product.brand}</span>
              <span className={`text-[11px] font-semibold px-3 py-1 ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </div>

            <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(28px,3vw,44px)] font-bold leading-tight tracking-tight">{product.title}</h1>

            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {stars.map((s, i) => <span key={i} className={`text-base ${s !== 'empty' ? 'text-amber-400' : 'text-gray-300'}`}>★</span>)}
              </div>
              <span className="text-[15px] font-bold">{product.rating}</span>
              <span className="text-[12px] text-[#8a8a8a]">{product.reviews?.length || 0} reviews</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[32px] font-bold">{formatPrice(product.price)}</span>
              {discount && <>
                <span className="text-[18px] text-[#8a8a8a] line-through">{formatPrice(product.price / (1 - discount/100))}</span>
                <span className="px-3 py-1 bg-[#E8521A] text-white text-[11px] font-bold tracking-wide">Save {discount}%</span>
              </>}
            </div>

            <p className="text-[14px] text-[#8a8a8a] leading-[1.8]">{product.description}</p>

            {/* Fix #12 — clickable tags that filter the shop */}
            {product.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.tags.map(tag => (
                  <button key={tag}
                    onClick={() => navigate(`/shop?search=${encodeURIComponent(tag)}`)}
                    className="px-3 py-1 border border-[#E0D9D2] bg-[#F2EDE8] text-[10px] font-bold tracking-[1px] uppercase text-[#8a8a8a] hover:border-[#E8521A] hover:text-[#E8521A] hover:bg-white transition-all duration-150 cursor-pointer">
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            <hr className="border-[#E0D9D2]" />

            {/* Add to cart */}
            <div className="flex gap-2.5 items-stretch">
              <div className="flex items-center border border-[#E0D9D2]">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-10 h-12 bg-transparent border-none text-[18px] hover:bg-[#F2EDE8] transition-colors duration-200">-</button>
                <span className="w-11 text-center text-[14px] font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="w-10 h-12 bg-transparent border-none text-[18px] hover:bg-[#F2EDE8] transition-colors duration-200">+</button>
              </div>
              <button onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200">
                {inCart ? 'In Cart — Add More' : 'Add to Cart'}
              </button>
              <button onClick={() => { toggleWishlist(product.id); addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                className={`w-12 flex items-center justify-center border transition-colors duration-200
                  ${wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-[#E0D9D2] text-[#8a8a8a] hover:border-red-300 hover:text-red-500'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Trust */}
            <div className="bg-[#F2EDE8] p-4 flex flex-col gap-2.5">
              {[['🚚','Free shipping on orders over $50'],['↩️','30-day hassle-free returns'],['🔒','Secure SSL checkout']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-[13px] text-[#8a8a8a]">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="mb-20">
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[32px] font-bold mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.reviews.map((review, i) => (
                <div key={i} className="bg-white border border-[#E0D9D2] p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8521A] text-white flex items-center justify-center font-bold text-[16px] shrink-0">
                      {review.reviewerName?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate">{review.reviewerName}</div>
                      <div className="flex gap-px mt-0.5">
                        {getRatingStars(review.rating).map((s, j) => <span key={j} className={`text-[11px] ${s !== 'empty' ? 'text-amber-400' : 'text-gray-300'}`}>★</span>)}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8a8a8a] shrink-0">{new Date(review.date).toLocaleDateString('en-US', {month:'short', year:'numeric'})}</span>
                  </div>
                  <p className="text-[13px] text-[#8a8a8a] leading-[1.7]">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fix #9 — Recently Viewed section */}
        {recentlyViewed.length > 0 && (
          <section className="mb-20">
            <p className="text-[11px] font-semibold tracking-[4px] uppercase text-[#E8521A] mb-3">Your History</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[32px] font-bold mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {recentlyViewed.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Related */}
        {relatedFiltered.length > 0 && (
          <section className="mb-10">
            <p className="text-[11px] font-semibold tracking-[4px] uppercase text-[#E8521A] mb-3">You May Also Like</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[32px] font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedFiltered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
