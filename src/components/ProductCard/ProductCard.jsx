import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useToast } from '../Toast/Toast'
import { formatPrice, getRatingStars, truncate } from '../../utils/helpers'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart, isInCart }          = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { addToast }   = useToast()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered]     = useState(false)

  const inCart     = isInCart(product.id)
  const wishlisted = isWishlisted(product.id)
  const stars      = getRatingStars(product.rating)
  const discount   = product.discountPercentage ? Math.round(product.discountPercentage) : null

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, brand: product.brand })
    addToast(`${truncate(product.title, 28)} added to cart`)
  }

  const handleWish = (e) => {
    e.stopPropagation()
    toggleWishlist(product.id)
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', wishlisted ? 'error' : 'success')
  }

  return (
    <article
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white border border-[#E0D9D2] cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-[#F2EDE8]">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={product.thumbnail} alt={product.title}
          className={`w-full h-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount && <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-[1.5px] uppercase bg-[#141414] text-white">-{discount}%</span>}
          {product.stock < 10 && <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-[1.5px] uppercase bg-amber-400 text-[#141414]">Low Stock</span>}
        </div>

        {/* Wishlist btn */}
        <button
          onClick={handleWish}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200
            ${wishlisted ? 'opacity-100 scale-100 text-red-500' : 'opacity-0 scale-75 text-[#8a8a8a] group-hover:opacity-100 group-hover:scale-100'}
            hover:text-red-500`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick view overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-[#141414]/85 flex items-center justify-center py-3 transition-transform duration-300 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white">View Details</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#8a8a8a]">{product.brand || product.category}</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {stars.map((s, i) => (
                <span key={i} className={`text-[11px] ${s !== 'empty' ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-[10px] text-[#8a8a8a]">({product.stock})</span>
          </div>
        </div>

        <h3 style={{fontFamily:"'Cormorant Garamond', serif"}} className="text-[17px] font-semibold leading-snug text-[#141414] flex-1">
          {truncate(product.title, 50)}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-[#E0D9D2] mt-auto gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#141414]">{formatPrice(product.price)}</span>
            {discount && <span className="text-[11px] text-[#8a8a8a] line-through">{formatPrice(product.price / (1 - discount / 100))}</span>}
          </div>
          <button
            onClick={handleAdd}
            className={`px-3 py-2 text-[11px] font-semibold tracking-[1px] uppercase border-none transition-colors duration-200
              ${inCart ? 'bg-[#E8521A] text-white' : 'bg-[#141414] text-white hover:bg-[#E8521A]'}`}
          >
            {inCart ? '✓ In Cart' : '+ Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
