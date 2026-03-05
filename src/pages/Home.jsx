import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard'
import { titleCase } from '../utils/helpers'

// Separate component so each tile has its own imgError state
// This is the correct React pattern — onError on img tag alone can't
// re-render to show the fallback emoji because the parent doesn't re-render
function CategoryTile({ cat, data, targetSlug, navigate }) {
  const [imgError, setImgError] = useState(false)
  const showImg = data?.img && !imgError
  return (
    <button
      onClick={() => navigate(`/shop?category=${targetSlug}`)}
      className="group bg-white border border-[#E8E3DD] overflow-hidden flex flex-col
                 hover:border-[#E8521A] hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      <div className="w-full aspect-square overflow-hidden bg-[#EDE8E3] relative">
        {showImg ? (
          <img
            src={data.img}
            alt={cat.name || cat.slug}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[30px] bg-gradient-to-br from-[#F2EDE8] to-[#E0D9D2]">
            {data?.emoji || '🛍️'}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[1px] uppercase text-[#141414] leading-tight text-left">
          {cat.name || titleCase(cat.slug)}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="2.5" className="shrink-0">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </button>
  )
}

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=95&auto=format&fit=crop',
    label: 'New Season — SS 2025',
    heading: ['Style', 'Meets', 'Purpose.'],
    sub: 'Thousands of premium products handpicked for quality, style, and value.',
    cta: { label: 'Shop Men', href: '/shop?category=mens-shirts' },
  },
  {
    src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=95&auto=format&fit=crop',
    label: "Women's Collection",
    heading: ['Wear', 'Your', 'Story.'],
    sub: 'New arrivals every week. Be the first to discover what\'s trending.',
    cta: { label: 'Shop Women', href: '/shop?category=womens-dresses' },
  },
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=95&auto=format&fit=crop',
    label: 'Premium Accessories',
    heading: ['Bold.', 'Sharp.', 'Refined.'],
    sub: 'Curated essentials for the modern lifestyle. Free shipping on every order.',
    cta: { label: 'Shop Accessories', href: '/shop?category=mens-watches' },
  },
]

const CATEGORY_DATA = {
  smartphones:           { emoji: '📱', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85' },
  laptops:               { emoji: '💻', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=85' },
  'womens-jewellery':    { emoji: '💍', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=85' },
  groceries:             { emoji: '🛒', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=85' },
  'home-decoration':     { emoji: '🏠', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=85' },
  furniture:             { emoji: '🪑', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=85' },
  tops:                  { emoji: '👕', img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=85' },
  'womens-dresses':      { emoji: '👗', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=85' },
  'womens-shoes':        { emoji: '👠', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=85' },
  'mens-shoes':          { emoji: '👟', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=85' },
  'mens-shirts':         { emoji: '👔', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=85' },
  'mens-watches':        { emoji: '⌚', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=85' },
  'womens-watches':      { emoji: '⌚', img: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=85' },
  sunglasses:            { emoji: '🕶️', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=85' },
  automotive:            { emoji: '🚗', img: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&q=85' },
  motorcycle:            { emoji: '🏍️', img: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&q=85' },
  lighting:              { emoji: '💡', img: 'https://images.unsplash.com/photo-1513506003901-1e6a35eb35d7?w=400&q=85' },
  beauty:                { emoji: '💄', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=85' },
  'kitchen-accessories': { emoji: '🍳', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=85' },
  'mobile-accessories':  { emoji: '🎧', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=85' },
  'sports-accessories':  { emoji: '🏋️', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=85' },
  tablets:               { emoji: '📱', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=85' },
  'womens-bags':         { emoji: '👜', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=85' },
}

// Inline SVG icons for the trust/value bar — more professional than emojis
const VALUE_PROPS = [
  {
    title: 'Free Shipping',
    desc: 'On all orders over $50',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.6">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    title: 'Easy Returns',
    desc: '30-day hassle-free policy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.6">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.89"/>
      </svg>
    ),
  },
  {
    title: 'Secure Payments',
    desc: 'SSL encrypted checkout',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.6">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    title: 'Quality Guarantee',
    desc: 'Only curated premium brands',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.6">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
]

export default function Home() {
  const { products, loading } = useProducts({ limit: 8 })
  const { categories }        = useCategories()
  const navigate = useNavigate()

  const [heroIdx,  setHeroIdx]  = useState(0)
  const [heroFade, setHeroFade] = useState(true)

  const goTo = (i) => {
    setHeroFade(false)
    setTimeout(() => { setHeroIdx(i); setHeroFade(true) }, 280)
  }

  useEffect(() => {
    const t = setInterval(() => {
      setHeroFade(false)
      setTimeout(() => { setHeroIdx(p => (p + 1) % HERO_IMAGES.length); setHeroFade(true) }, 280)
    }, 5500)
    return () => clearInterval(t)
  }, [])

  const hero = HERO_IMAGES[heroIdx]

  return (
    <main className="pt-[72px]">

      {/* ══════════════════════════════════════
          HERO — full-height split carousel
      ══════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-72px)]">

        {/* ── LEFT: text ── */}
        <div className="flex flex-col justify-center order-2 lg:order-1
                        px-6 sm:px-10 lg:px-14 xl:px-20 py-14 lg:py-0 bg-[#FAFAF8]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6" style={{ opacity: heroFade ? 1 : 0, transition: 'opacity 0.3s' }}>
            <span className="w-8 h-px bg-[#E8521A]" />
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-[#E8521A]">{hero.label}</span>
          </div>

          {/* Headline */}
          <h1
            style={{ fontFamily:"'Cormorant Garamond', serif", opacity: heroFade ? 1 : 0, transition: 'opacity 0.3s' }}
            className="text-[clamp(52px,6vw,90px)] font-bold leading-[0.92] tracking-[-2px] mb-7 text-[#141414]"
          >
            {hero.heading[0]}<br />
            <em className="text-[#E8521A] not-italic">{hero.heading[1]}</em><br />
            {hero.heading[2]}
          </h1>

          {/* Sub */}
          <p
            className="text-[14px] sm:text-[15px] text-[#6b6b6b] leading-[1.85] max-w-[380px] mb-10"
            style={{ opacity: heroFade ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            {hero.sub}
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap mb-12">
            <Link to={hero.cta.href}
              className="px-8 py-3.5 bg-[#141414] text-white text-[11px] font-bold tracking-[2.5px] uppercase
                         hover:bg-[#E8521A] transition-colors duration-200">
              {hero.cta.label}
            </Link>
            <Link to="/shop"
              className="px-8 py-3.5 border-[1.5px] border-[#141414] text-[#141414] text-[11px] font-bold tracking-[2.5px] uppercase
                         hover:bg-[#141414] hover:text-white transition-colors duration-200">
              All Products
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 sm:gap-12 pt-8 border-t border-[#E0D9D2]">
            {[['500+', 'Products'], ['50+', 'Brands'], ['4.8', 'Avg Rating']].map(([n, l]) => (
              <div key={l}>
                <div style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[26px] sm:text-[30px] font-bold text-[#141414] leading-none mb-1">{n}</div>
                <div className="text-[10px] tracking-[1.5px] uppercase text-[#aaa] font-semibold">{l}</div>
              </div>
            ))}
          </div>

          {/* Slide dots */}
          <div className="flex gap-2 mt-8">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i+1}`}
                className={`rounded-full transition-all duration-300 ${i === heroIdx ? 'w-7 h-1.5 bg-[#E8521A]' : 'w-2 h-1.5 bg-[#D4CFC9] hover:bg-[#aaa]'}`} />
            ))}
          </div>
        </div>

        {/* ── RIGHT: image ── */}
        <div className="relative overflow-hidden order-1 lg:order-2 h-[56vw] sm:h-[62vw] lg:h-auto bg-[#EDE8E3]">
          <img
            key={heroIdx}
            src={hero.src}
            alt="Fashion editorial"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ opacity: heroFade ? 1 : 0, transition: 'opacity 0.4s' }}
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-[#FAFAF8]/15" />

          {/* Floating pill — product count */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E8521A] animate-pulse" />
            <div>
              <div className="text-[10px] tracking-[2px] uppercase text-[#8a8a8a] font-semibold">Trending Now</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[17px] font-bold text-[#141414]">500+ New Items</div>
            </div>
          </div>

          {/* Slide counter pill (top right) */}
          <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-sm px-3 py-1.5 text-white text-[11px] font-semibold tracking-wide">
            {String(heroIdx + 1).padStart(2,'0')} / {String(HERO_IMAGES.length).padStart(2,'0')}
          </div>

          {/* Prev / Next arrows */}
          {['prev','next'].map(dir => (
            <button key={dir}
              onClick={() => goTo(dir === 'prev' ? (heroIdx - 1 + HERO_IMAGES.length) % HERO_IMAGES.length : (heroIdx + 1) % HERO_IMAGES.length)}
              className={`absolute top-1/2 -translate-y-1/2 ${dir === 'prev' ? 'left-3' : 'right-3'}
                         w-9 h-9 bg-white/85 hover:bg-white shadow flex items-center justify-center transition-colors duration-200`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.5">
                {dir === 'prev' ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <section className="bg-[#141414] py-[14px] overflow-hidden select-none">
        <div className="flex gap-14 animate-marquee whitespace-nowrap">
          {Array.from({length:4},(_,i)=>(
            <div key={i} className="flex gap-14 shrink-0">
              {['Free Shipping Over $50','New Season Arrivals','30-Day Returns','Secure Checkout','Premium Quality','4.8 ★ Rated'].map(t=>(
                <span key={t} className="text-[10px] font-bold tracking-[3px] uppercase text-white/50 flex items-center gap-4">
                  <span className="text-[#E8521A] text-[8px]">◆</span>{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 lg:py-28 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
            <div>
              <p className="text-[10px] font-bold tracking-[4px] uppercase text-[#E8521A] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#E8521A]"/>Hand-Picked For You
              </p>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(28px,4vw,52px)] font-bold leading-tight tracking-tight text-[#141414]">
                Featured Products
              </h2>
            </div>
            <Link to="/shop"
              className="self-start sm:self-auto flex items-center gap-2 px-6 py-2.5 border-[1.5px] border-[#141414]
                         text-[10px] font-bold tracking-[2px] uppercase text-[#141414] hover:bg-[#141414] hover:text-white transition-colors duration-200 shrink-0">
              View All <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {loading ? <SkeletonGrid count={8}/> : products.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SPLIT EDITORIAL — Women's & Men's
          Both use object-position: top so the
          person's face is always visible
      ══════════════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-2">

        {/* Women's Edit */}
        <div className="group relative overflow-hidden h-[340px] sm:h-[440px] md:h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=92&auto=format&fit=crop&crop=top"
            alt="Women's Edit"
            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
          />
          {/* Dark gradient from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
            <p className="text-[9px] tracking-[4px] uppercase text-white/60 font-bold mb-2">New Collection</p>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[32px] sm:text-[42px] font-bold text-white leading-tight mb-5">
              Women's Edit
            </h3>
            <button onClick={() => navigate('/shop?category=womens-dresses')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#141414] text-[10px] font-bold tracking-[2.5px] uppercase
                         hover:bg-[#E8521A] hover:text-white transition-colors duration-200">
              Shop Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* Men's Edit */}
        <div className="group relative overflow-hidden h-[340px] sm:h-[440px] md:h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=92&auto=format&fit=crop&crop=top"
            alt="Men's Edit"
            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
            <p className="text-[9px] tracking-[4px] uppercase text-white/60 font-bold mb-2">Best Sellers</p>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[32px] sm:text-[42px] font-bold text-white leading-tight mb-5">
              Men's Edit
            </h3>
            <button onClick={() => navigate('/shop?category=mens-shirts')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#141414] text-[10px] font-bold tracking-[2.5px] uppercase
                         hover:bg-[#E8521A] hover:text-white transition-colors duration-200">
              Shop Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 lg:py-28 bg-[#F7F3EF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
            <div>
              <p className="text-[10px] font-bold tracking-[4px] uppercase text-[#E8521A] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#E8521A]"/>Browse By
              </p>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(28px,4vw,52px)] font-bold leading-tight text-[#141414]">
                Categories
              </h2>
            </div>
            <Link to="/shop" className="self-start sm:self-auto text-[10px] font-bold tracking-[2px] uppercase text-[#8a8a8a] hover:text-[#E8521A] transition-colors flex items-center gap-1.5">
              View All
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              ...categories.filter(cat =>
                !['fragrances', 'skincare', 'skin-care'].includes(cat.slug) &&
                !cat.slug.toLowerCase().includes('skin')
              ).slice(0, 11),
              { slug: 'smartphones', name: 'Electronics' }
            ].map(cat => {
                const data = CATEGORY_DATA[cat.slug]
                return (
                  <CategoryTile
                    key={cat.slug}
                    cat={cat}
                    data={data}
                    targetSlug={cat.slug}
                    navigate={navigate}
                  />
                )
              })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROMO BANNER — full-width editorial
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden h-[240px] sm:h-[300px] bg-[#141414]">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85&auto=format&fit=crop"
          alt="Store interior"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] font-bold tracking-[4px] uppercase text-[#E8521A] mb-4">Limited Time</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(28px,5vw,60px)] font-bold text-white leading-tight mb-6">
            Up to 40% Off — New Arrivals
          </h2>
          <Link to="/shop"
            className="px-10 py-3.5 bg-[#E8521A] text-white text-[11px] font-bold tracking-[2.5px] uppercase
                       hover:bg-white hover:text-[#141414] transition-colors duration-200">
            Explore The Sale
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST BAR — SVG icons, professional
      ══════════════════════════════════════ */}
      <section className="bg-white border-y border-[#EDE8E3] py-10 sm:py-12">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {VALUE_PROPS.map(p => (
              <div key={p.title} className="flex items-start sm:items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#FFF2EC] flex items-center justify-center">
                  {p.icon}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#141414] mb-0.5">{p.title}</div>
                  <div className="text-[12px] text-[#8a8a8a] leading-snug">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
