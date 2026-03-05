import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useSearch } from '../../hooks/useProducts'
import { useDebounce } from '../../hooks/useDebounce'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/cart', label: 'Cart' },
]

const QUICK_CATEGORIES = [
  { slug: 'womens-dresses', label: "Women's" },
  { slug: 'mens-shirts',    label: "Men's" },
  { slug: 'smartphones',    label: 'Electronics' },
  { slug: 'beauty',         label: 'Beauty' },
  { slug: 'mens-watches',   label: 'Watches' },
]

export default function Navbar() {
  const { cartCount }     = useCart()
  const { wishlistCount } = useWishlist()
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const navigate  = useNavigate()
  const location  = useLocation()
  const searchRef = useRef(null)
  const inputRef  = useRef(null)

  const debouncedQ = useDebounce(searchInput, 350)
  const { results, loading: searchLoading } = useSearch(debouncedQ)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchInput('')
  }, [location])

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus()
  }, [searchOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSearchSubmit = (e) => {
    e && e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`)
      setSearchOpen(false)
      setSearchInput('')
    }
  }

  const navBase = 'text-[11px] font-semibold tracking-[2.5px] uppercase transition-colors duration-200'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300
        ${scrolled
          ? 'h-[64px] bg-white/98 backdrop-blur-md border-b border-[#E0D9D2] shadow-sm'
          : 'h-[72px] bg-[#FAFAF8]/95 backdrop-blur-md border-b border-transparent'
        }`}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-baseline shrink-0 group">
            <span style={{fontFamily:"'Cormorant Garamond', serif", letterSpacing:'3px'}}
              className="text-[20px] sm:text-[22px] font-bold text-[#141414] group-hover:text-[#141414] transition-colors">Shop</span>
            <span style={{fontFamily:"'Cormorant Garamond', serif", letterSpacing:'3px'}}
              className="text-[20px] sm:text-[22px] font-bold text-[#E8521A] italic">lio</span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={({ isActive }) =>
              `${navBase} ${isActive ? 'text-[#141414]' : 'text-[#8a8a8a] hover:text-[#141414]'}`}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) =>
              `${navBase} ${isActive ? 'text-[#141414]' : 'text-[#8a8a8a] hover:text-[#141414]'}`}>
              Shop
            </NavLink>
            {/* Desktop category dropdown hint */}
            <div className="hidden lg:flex items-center gap-5 border-l border-[#E0D9D2] pl-6 ml-1">
              {QUICK_CATEGORIES.map(c => (
                <Link key={c.slug} to={`/shop?category=${c.slug}`}
                  className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#8a8a8a] hover:text-[#E8521A] transition-colors duration-150">
                  {c.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* ── ICONS ── */}
          <div className="flex items-center gap-0.5 sm:gap-1">

            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(p => !p)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#141414] hover:text-[#E8521A] transition-colors duration-200 rounded-sm hover:bg-[#F2EDE8]"
                aria-label="Search"
              >
                {searchOpen
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                }
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-[min(340px,calc(100vw-2rem))] bg-white border border-[#E0D9D2] shadow-2xl z-50 rounded-sm">
                  <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[#E0D9D2]">
                    <svg className="ml-3.5 shrink-0 text-[#8a8a8a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 px-3 py-3 text-[13px] outline-none bg-transparent"
                    />
                    {searchInput && (
                      <button type="button" onClick={() => setSearchInput('')} className="px-3 text-[#8a8a8a] hover:text-[#141414]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                  </form>

                  {/* Live results */}
                  {debouncedQ.length >= 2 && (
                    <div className="max-h-[280px] overflow-y-auto">
                      {searchLoading ? (
                        <div className="px-4 py-5 text-center text-[12px] text-[#8a8a8a]">Searching...</div>
                      ) : results.length === 0 ? (
                        <div className="px-4 py-5 text-center text-[12px] text-[#8a8a8a]">No results for "{debouncedQ}"</div>
                      ) : (
                        <>
                          {results.slice(0, 5).map(p => (
                            <button key={p.id}
                              onClick={() => { navigate(`/product/${p.id}`); setSearchOpen(false); setSearchInput('') }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F2EDE8] transition-colors duration-150 text-left border-b border-[#F8F5F2] last:border-0">
                              <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-cover shrink-0 rounded-sm" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold truncate text-[#141414]">{p.title}</div>
                                <div className="text-[11px] text-[#E8521A] font-semibold">${p.price}</div>
                              </div>
                            </button>
                          ))}
                          {results.length > 5 && (
                            <button onClick={handleSearchSubmit}
                              className="w-full py-3 text-[11px] font-semibold tracking-[1.5px] uppercase text-[#E8521A] hover:bg-[#F2EDE8] transition-colors">
                              View all {results.length} results →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Quick browse (shown when no query) */}
                  {debouncedQ.length < 2 && (
                    <div className="p-3">
                      <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#8a8a8a] px-1 mb-2">Quick Browse</p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_CATEGORIES.map(c => (
                          <button key={c.slug} onClick={() => { navigate(`/shop?category=${c.slug}`); setSearchOpen(false) }}
                            className="px-3 py-1.5 border border-[#E0D9D2] text-[11px] font-semibold text-[#141414] hover:border-[#E8521A] hover:text-[#E8521A] transition-colors duration-150 rounded-sm">
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist"
              className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#141414] hover:text-[#E8521A] transition-colors duration-200 rounded-sm hover:bg-[#F2EDE8]">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#E8521A] text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart"
              className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#141414] hover:text-[#E8521A] transition-colors duration-200 rounded-sm hover:bg-[#F2EDE8]">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#E8521A] text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 items-center bg-transparent ml-0.5"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block w-[20px] h-[1.5px] bg-[#141414] transition-all duration-250 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-[20px] h-[1.5px] bg-[#141414] transition-all duration-250 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-[20px] h-[1.5px] bg-[#141414] transition-all duration-250 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[98] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-[99] w-[min(320px,85vw)] bg-[#FAFAF8] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#E0D9D2] shrink-0">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-baseline">
            <span style={{fontFamily:"'Cormorant Garamond', serif", letterSpacing:'3px'}} className="text-[20px] font-bold text-[#141414]">Shop</span>
            <span style={{fontFamily:"'Cormorant Garamond', serif", letterSpacing:'3px'}} className="text-[20px] font-bold text-[#E8521A] italic">lio</span>
          </Link>
          <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center text-[#8a8a8a] hover:text-[#141414] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">

          {/* Main nav links */}
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center justify-between py-3.5 border-b border-[#F0EBE5] text-[12px] font-semibold tracking-[2px] uppercase transition-colors duration-150
                ${isActive ? 'text-[#E8521A]' : 'text-[#141414] hover:text-[#E8521A]'}`
              }>
              {label === 'Wishlist' ? `${label} ${wishlistCount > 0 ? `(${wishlistCount})` : ''}` :
               label === 'Cart'     ? `${label} ${cartCount > 0 ? `(${cartCount})` : ''}` : label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </NavLink>
          ))}

          {/* Categories section */}
          <div className="mt-6">
            <p className="text-[10px] font-bold tracking-[3px] uppercase text-[#8a8a8a] mb-4">Browse Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_CATEGORIES.map(c => (
                <Link key={c.slug} to={`/shop?category=${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 border border-[#E0D9D2] text-[11px] font-semibold text-[#141414] hover:border-[#E8521A] hover:text-[#E8521A] hover:bg-white transition-all duration-150 text-center">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-[#E0D9D2] shrink-0">
          <p className="text-[11px] text-[#8a8a8a] text-center">🚚 Free shipping over $50 &nbsp;·&nbsp; ↩️ 30-day returns</p>
        </div>
      </div>
    </>
  )
}
