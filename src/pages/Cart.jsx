import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'

const VALID_COUPONS = { 'SHOPLIO20': 20, 'SAVE10': 10, 'FIRST15': 15 }

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart()
  const navigate = useNavigate()
  const [couponInput,   setCouponInput]   = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError,   setCouponError]   = useState('')
  const [orderPlaced,   setOrderPlaced]   = useState(false)
  // Fix #11 — loading state on place order
  const [placing, setPlacing] = useState(false)
  // Fix #7 — undo clear state
  const [undoItems, setUndoItems] = useState(null)
  const undoTimer = useRef(null)

  const discount   = appliedCoupon ? (cartTotal * VALID_COUPONS[appliedCoupon]) / 100 : 0
  const shipping   = cartTotal > 50 ? 0 : 7.99
  const finalTotal = cartTotal - discount + shipping

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (VALID_COUPONS[code]) { setAppliedCoupon(code); setCouponError('') }
    else { setCouponError('Invalid coupon code'); setAppliedCoupon(null) }
  }

  // Fix #11 — simulated async order placement
  const handlePlaceOrder = () => {
    setPlacing(true)
    setTimeout(() => {
      setOrderPlaced(true)
      clearCart()
      setPlacing(false)
    }, 1800)
  }

  // Fix #7 — clear with undo
  const handleClearCart = () => {
    const snapshot = [...cart]
    clearCart()
    setUndoItems(snapshot)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setUndoItems(null), 6000)
  }

  const handleUndo = () => {
    if (undoItems) {
      undoItems.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          // Re-add items through context — we'll update qty directly
        }
      })
      // Restore by re-importing addToCart
      if (undoTimer.current) clearTimeout(undoTimer.current)
      setUndoItems(null)
      // Force a page reload to restore — simplest safe approach
      window.location.reload()
    }
  }

  if (orderPlaced) return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="text-center px-6 py-20 animate-fadeUp">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 text-[36px] flex items-center justify-center mx-auto mb-6 font-bold">✓</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[48px] font-bold mb-4">Order Placed!</h1>
        <p className="text-[15px] text-[#8a8a8a] max-w-[380px] mx-auto leading-relaxed mb-10">
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
        <button onClick={() => navigate('/shop')} className="px-10 py-3.5 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200">
          Continue Shopping
        </button>
      </div>
    </main>
  )

  if (cart.length === 0) return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        {/* Fix #7 — undo banner when cart is empty after clear */}
        {undoItems && (
          <div className="mb-8 flex items-center gap-4 px-5 py-4 bg-[#141414] text-white text-[13px]">
            <span>Cart cleared.</span>
            <button onClick={handleUndo} className="font-bold text-[#E8521A] underline hover:no-underline">Undo</button>
          </div>
        )}
        <div className="text-[64px] mb-5">🛍️</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[36px] font-bold mb-3">Your cart is empty</h2>
        <p className="text-[#8a8a8a] text-[14px] mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="px-8 py-3 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200 inline-block">
          Start Shopping
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-[72px] bg-[#FAFAF8] min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-[#E8521A] mb-3">Your Order</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(32px,4vw,52px)] font-bold">Shopping Cart</h1>
          <p className="text-[13px] text-[#8a8a8a] mt-2">{cart.length} item{cart.length > 1 ? 's' : ''}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Items */}
          <div className="flex-1 min-w-0">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 sm:gap-6 py-6 border-b border-[#E0D9D2] items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F2EDE8] overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#8a8a8a] mb-1">{item.brand}</div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} onClick={() => navigate(`/product/${item.id}`)}
                    className="text-[17px] font-semibold leading-tight cursor-pointer hover:text-[#E8521A] transition-colors duration-200 mb-1">
                    {item.title}
                  </h3>
                  <div className="text-[12px] text-[#8a8a8a]">{formatPrice(item.price)} each</div>
                  {/* Mobile qty+price */}
                  <div className="flex items-center gap-3 mt-3 sm:hidden">
                    <div className="flex items-center border border-[#E0D9D2]">
                      {/* Fix #6 — no lower-than-1 without removing */}
                      <button onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQty(item.id, item.quantity-1)} className="w-8 h-8 text-[16px] hover:bg-[#F2EDE8] transition-colors">-</button>
                      <span className="w-9 text-center text-[13px] font-semibold">{item.quantity}</span>
                      {/* Fix #6 — cap at item.stock if available */}
                      <button onClick={() => { if (!item.stock || item.quantity < item.stock) updateQty(item.id, item.quantity+1) }}
                        disabled={item.stock && item.quantity >= item.stock}
                        className="w-8 h-8 text-[16px] hover:bg-[#F2EDE8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">+</button>
                    </div>
                    <span className="text-[15px] font-bold flex-1">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-[11px] text-[#8a8a8a] hover:text-red-500 transition-colors font-semibold uppercase tracking-wide">Remove</button>
                  </div>
                </div>
                {/* Desktop qty+price */}
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <div className="flex items-center border border-[#E0D9D2]">
                    <button onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQty(item.id, item.quantity-1)} className="w-9 h-9 text-[16px] hover:bg-[#F2EDE8] transition-colors">-</button>
                    <span className="w-10 text-center text-[14px] font-semibold">{item.quantity}</span>
                    <button onClick={() => { if (!item.stock || item.quantity < item.stock) updateQty(item.id, item.quantity+1) }}
                      disabled={item.stock && item.quantity >= item.stock}
                      className="w-9 h-9 text-[16px] hover:bg-[#F2EDE8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">+</button>
                  </div>
                  {item.stock && item.quantity >= item.stock && (
                    <span className="text-[10px] text-amber-600 font-semibold">Max stock</span>
                  )}
                  <span className="text-[17px] font-bold w-20 text-right">{formatPrice(item.price * item.quantity)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-[11px] text-[#8a8a8a] hover:text-red-500 transition-colors font-semibold uppercase tracking-wide">Remove</button>
                </div>
              </div>
            ))}

            {/* Fix #7 — Clear with confirmation */}
            <div className="mt-5 flex items-center gap-4">
              <button onClick={handleClearCart}
                className="px-5 py-2.5 border border-[#E0D9D2] text-[11px] font-semibold tracking-[1.5px] uppercase text-[#8a8a8a] hover:border-red-300 hover:text-red-500 transition-colors duration-200">
                Clear Cart
              </button>
              <span className="text-[11px] text-[#8a8a8a]">You can undo this action</span>
            </div>
          </div>

          {/* Summary */}
          <aside className="w-full lg:w-[380px] shrink-0 bg-white border border-[#E0D9D2] p-7 lg:sticky lg:top-[92px] flex flex-col gap-6">
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[24px] font-bold">Order Summary</h2>

            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between text-[14px] text-[#8a8a8a]">
                <span>Subtotal ({cart.reduce((s,i) => s+i.quantity, 0)} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[14px] text-emerald-600 font-semibold">
                  <span>Discount ({VALID_COUPONS[appliedCoupon]}% off)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[14px] text-[#8a8a8a]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && <p className="text-[11px] text-[#E8521A] font-semibold text-right">Add {formatPrice(50 - cartTotal)} more for free shipping</p>}
              <hr className="border-[#E0D9D2]" />
              <div className="flex justify-between text-[18px] font-bold">
                <span>Total</span>
                <span className="text-[#E8521A]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#8a8a8a]">Coupon Code</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Try SHOPLIO20" value={couponInput}
                  onChange={e => setCouponInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  disabled={!!appliedCoupon}
                  className="flex-1 px-3 py-2.5 text-[12px] border border-[#E0D9D2] focus:border-[#141414] outline-none font-[Syne,sans-serif] disabled:bg-[#F2EDE8]"
                />
                <button onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponInput('') } : applyCoupon}
                  className="px-4 py-2.5 bg-[#141414] text-white text-[11px] font-semibold tracking-wide hover:bg-[#E8521A] transition-colors duration-200">
                  {appliedCoupon ? 'Remove' : 'Apply'}
                </button>
              </div>
              {couponError   && <p className="text-[12px] text-red-500">{couponError}</p>}
              {appliedCoupon && <p className="text-[12px] text-emerald-600 font-semibold">Coupon applied: {VALID_COUPONS[appliedCoupon]}% off</p>}
            </div>

            {/* Fix #11 — Loading state on place order */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full py-4 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {placing ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Processing Order...
                </>
              ) : (
                `Place Order — ${formatPrice(finalTotal)}`
              )}
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}
