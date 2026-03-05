import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white mt-auto">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-16">
          {/* Brand */}
          <div className="max-w-[280px]">
            <div className="flex items-baseline gap-0 mb-4">
              <span style={{fontFamily:"'Cormorant Garamond',serif", letterSpacing:'3px'}} className="text-[20px] font-bold text-white">Shop</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif", letterSpacing:'3px'}} className="text-[20px] font-bold text-[#E8521A] italic">lio</span>
            </div>
            <p className="text-[13px] text-[#888] leading-relaxed">Premium products, curated for the discerning buyer. Free shipping over $50.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold tracking-[3px] uppercase text-[#555] mb-1">Shop</h4>
              <Link to="/shop" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">All Products</Link>
              <Link to="/shop?category=smartphones" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">Electronics</Link>
              <Link to="/shop?category=fragrances" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">Fragrances</Link>
              <Link to="/shop?category=skincare" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">Skincare</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold tracking-[3px] uppercase text-[#555] mb-1">Help</h4>
              <a href="#" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">FAQ</a>
              <a href="#" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">Shipping</a>
              <a href="#" className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200">Returns</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#222] py-5 px-4 text-center text-[12px] text-[#555] tracking-wide">
        © 2025 Shoplio — Built with React + DummyJSON API
      </div>
    </footer>
  )
}
