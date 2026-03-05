import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories, useSearch } from '../hooks/useProducts'
import { useDebounce } from '../hooks/useDebounce'
import ProductCard from '../components/ProductCard/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard'
import { titleCase } from '../utils/helpers'

const SORT_OPTIONS = [
  { value: '',           label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low-High' },
  { value: 'price-desc', label: 'Price: High-Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name',       label: 'Name A-Z' },
]
const PAGE_SIZE = 12

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const sort     = searchParams.get('sort')     || ''
  // Fix #1 — support ?search= param from navbar global search
  const urlSearch = searchParams.get('search') || ''

  const [searchInput,  setSearchInput]  = useState(urlSearch)
  const [page,         setPage]         = useState(1)
  // Fix #4 — price range filter state
  const [priceMin,     setPriceMin]     = useState('')
  const [priceMax,     setPriceMax]     = useState('')
  const [showPriceFilter, setShowPriceFilter] = useState(false)

  // Sync searchInput when url param changes (e.g. from navbar search)
  useEffect(() => { setSearchInput(urlSearch); setPage(1) }, [urlSearch])

  const debouncedSearch = useDebounce(searchInput, 400)
  const { products, loading } = useProducts({ category, limit: 100 })
  const { results: searchResults, loading: searchLoading } = useSearch(debouncedSearch)
  const { categories } = useCategories()

  const baseProducts = debouncedSearch ? searchResults : products

  // Fix #4 — apply price range on top of everything else
  const sortedProducts = useMemo(() => {
    let list = [...baseProducts]

    // Price range filter
    if (priceMin !== '') list = list.filter(p => p.price >= Number(priceMin))
    if (priceMax !== '') list = list.filter(p => p.price <= Number(priceMax))

    switch (sort) {
      case 'price-asc':  return list.sort((a, b) => a.price  - b.price)
      case 'price-desc': return list.sort((a, b) => b.price  - a.price)
      case 'rating':     return list.sort((a, b) => b.rating - a.rating)
      case 'name':       return list.sort((a, b) => a.title.localeCompare(b.title))
      default:           return list
    }
  }, [baseProducts, sort, priceMin, priceMax])

  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE)
  const paginated  = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const isLoading  = loading || searchLoading

  const setFilter = (key, value) => {
    setSearchParams(prev => { value ? prev.set(key, value) : prev.delete(key); return prev })
    setPage(1)
  }

  const clearAll = () => {
    setSearchParams({})
    setSearchInput('')
    setPriceMin('')
    setPriceMax('')
    setPage(1)
  }

  const hasFilters = category || sort || debouncedSearch || priceMin !== '' || priceMax !== ''

  // Compute price bounds for hint text
  const allPrices = baseProducts.map(p => p.price)
  const minPrice  = allPrices.length ? Math.floor(Math.min(...allPrices)) : 0
  const maxPrice  = allPrices.length ? Math.ceil(Math.max(...allPrices))  : 9999

  return (
    <main className="pt-[72px] min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-[#E8521A] mb-3">Our Collection</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-tight">
            {category ? titleCase(category) : debouncedSearch ? `Search: "${debouncedSearch}"` : 'All Products'}
          </h1>
          {!isLoading && (
            <p className="text-[13px] text-[#8a8a8a] mt-2">
              {sortedProducts.length} products{debouncedSearch && ` for "${debouncedSearch}"`}
            </p>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center p-4 bg-white border border-[#E0D9D2]">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="search" placeholder="Search products..."
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); setPage(1) }}
                className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#E0D9D2] focus:border-[#141414] outline-none bg-[#FAFAF8] font-[Syne,sans-serif]"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Category */}
              <select value={category} onChange={e => setFilter('category', e.target.value)}
                className="px-3 py-2.5 text-[12px] border border-[#E0D9D2] focus:border-[#141414] outline-none bg-[#FAFAF8] font-[Syne,sans-serif] cursor-pointer min-w-[150px]">
                <option value="">All Categories</option>
                {categories
                  .filter(cat => cat.slug !== 'fragrances')
                  .map(cat => <option key={cat.slug} value={cat.slug === 'skincare' ? 'beauty' : cat.slug}>{cat.name || titleCase(cat.slug)}</option>)}
              </select>

              {/* Sort */}
              <select value={sort} onChange={e => setFilter('sort', e.target.value)}
                className="px-3 py-2.5 text-[12px] border border-[#E0D9D2] focus:border-[#141414] outline-none bg-[#FAFAF8] font-[Syne,sans-serif] cursor-pointer min-w-[150px]">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              {/* Fix #4 — Price filter toggle */}
              <button onClick={() => setShowPriceFilter(p => !p)}
                className={`px-4 py-2.5 border text-[11px] font-semibold tracking-wide transition-colors duration-200 flex items-center gap-2
                  ${showPriceFilter || priceMin !== '' || priceMax !== '' ? 'border-[#E8521A] text-[#E8521A] bg-orange-50' : 'border-[#E0D9D2] text-[#8a8a8a] hover:border-[#141414] hover:text-[#141414]'}`}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Price
                {(priceMin !== '' || priceMax !== '') && <span className="w-1.5 h-1.5 rounded-full bg-[#E8521A]" />}
              </button>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearAll}
                  className="px-4 py-2.5 border border-[#E0D9D2] text-[11px] font-semibold tracking-wide text-[#8a8a8a] bg-transparent hover:border-[#E8521A] hover:text-[#E8521A] transition-colors duration-200">
                  x Clear
                </button>
              )}
            </div>
          </div>

          {/* Fix #4 — Price range panel */}
          {showPriceFilter && (
            <div className="p-4 bg-white border border-[#E0D9D2] flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#8a8a8a]">Min Price ($)</label>
                <input
                  type="number" min="0" max={priceMax || maxPrice} placeholder={`${minPrice}`}
                  value={priceMin}
                  onChange={e => { setPriceMin(e.target.value); setPage(1) }}
                  className="w-28 px-3 py-2 text-[13px] border border-[#E0D9D2] focus:border-[#141414] outline-none bg-[#FAFAF8] font-[Syne,sans-serif]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#8a8a8a]">Max Price ($)</label>
                <input
                  type="number" min={priceMin || 0} placeholder={`${maxPrice}`}
                  value={priceMax}
                  onChange={e => { setPriceMax(e.target.value); setPage(1) }}
                  className="w-28 px-3 py-2 text-[13px] border border-[#E0D9D2] focus:border-[#141414] outline-none bg-[#FAFAF8] font-[Syne,sans-serif]"
                />
              </div>
              {/* Quick ranges */}
              <div className="flex gap-2 flex-wrap">
                {[['Under $25', '', '25'], ['$25-$100', '25', '100'], ['$100-$500', '100', '500'], ['Over $500', '500', '']].map(([label, mn, mx]) => (
                  <button key={label}
                    onClick={() => { setPriceMin(mn); setPriceMax(mx); setPage(1) }}
                    className={`px-3 py-2 text-[11px] font-semibold border transition-colors duration-150
                      ${priceMin === mn && priceMax === mx ? 'border-[#E8521A] text-[#E8521A] bg-orange-50' : 'border-[#E0D9D2] text-[#141414] hover:border-[#E8521A] hover:text-[#E8521A]'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {(priceMin !== '' || priceMax !== '') && (
                <button onClick={() => { setPriceMin(''); setPriceMax('') }}
                  className="px-3 py-2 text-[11px] font-semibold text-[#8a8a8a] hover:text-red-500 transition-colors duration-150">
                  Clear Price
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {category && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] text-white text-[11px] font-semibold">
                {titleCase(category)}
                <button onClick={() => setFilter('category', '')} className="hover:text-[#E8521A] transition-colors">x</button>
              </span>
            )}
            {debouncedSearch && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] text-white text-[11px] font-semibold">
                "{debouncedSearch}"
                <button onClick={() => { setSearchInput(''); setSearchParams(p => { p.delete('search'); return p }) }} className="hover:text-[#E8521A] transition-colors">x</button>
              </span>
            )}
            {(priceMin !== '' || priceMax !== '') && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] text-white text-[11px] font-semibold">
                ${priceMin || '0'} – ${priceMax || '...'}
                <button onClick={() => { setPriceMin(''); setPriceMax('') }} className="hover:text-[#E8521A] transition-colors">x</button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {isLoading ? (
            <SkeletonGrid count={PAGE_SIZE} />
          ) : paginated.length === 0 ? (
            <div className="col-span-full text-center py-20 text-[#8a8a8a]">
              <p className="text-[28px] mb-3">😕</p>
              <p className="font-semibold text-[15px] mb-1">No products found</p>
              <p className="text-[13px]">Try adjusting your search, filters, or price range</p>
              <button onClick={clearAll} className="mt-6 px-6 py-2.5 bg-[#141414] text-white text-[11px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200">
                Clear All Filters
              </button>
            </div>
          ) : (
            paginated.map(p => <ProductCard key={p.id} product={p} />)
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-1.5 mt-14">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-5 h-10 border border-[#E0D9D2] text-[12px] font-semibold bg-white hover:border-[#141414] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200">
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i-1] > 1) acc.push('...'); acc.push(p); return acc }, [])
              .map((p, i) => p === '...'
                ? <span key={`d${i}`} className="w-10 text-center text-[#8a8a8a]">...</span>
                : <button key={p} onClick={() => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}) }}
                    className={`w-10 h-10 text-[13px] font-semibold border transition-colors duration-200
                      ${page === p ? 'bg-[#141414] text-white border-[#141414]' : 'bg-white text-[#141414] border-[#E0D9D2] hover:border-[#141414]'}`}>
                    {p}
                  </button>
              )
            }
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-5 h-10 border border-[#E0D9D2] text-[12px] font-semibold bg-white hover:border-[#141414] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200">
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
