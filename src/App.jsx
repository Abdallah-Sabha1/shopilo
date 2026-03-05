import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider }           from './context/CartContext'
import { WishlistProvider }       from './context/WishlistContext'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext'
import { ToastProvider }          from './components/Toast/Toast'
import Navbar        from './components/Navbar/Navbar'
import Footer        from './components/Footer/Footer'
import BackToTop     from './components/BackToTop/BackToTop'
import Home          from './pages/Home'
import Shop          from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart          from './pages/Cart'
import Wishlist      from './pages/Wishlist'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/"            element={<Home />} />
                    <Route path="/shop"        element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart"        element={<Cart />} />
                    <Route path="/wishlist"    element={<Wishlist />} />
                    <Route path="*" element={
                      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[72px]">
                        <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[96px] font-bold text-[#E0D9D2]">404</span>
                        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-[32px] font-bold mb-3 -mt-4">Page Not Found</h2>
                        <p className="text-[#8a8a8a] mb-8">The page you're looking for doesn't exist.</p>
                        <a href="/" className="px-8 py-3 bg-[#141414] text-white text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#E8521A] transition-colors duration-200">
                          Go Home
                        </a>
                      </div>
                    } />
                  </Routes>
                </div>
                <Footer />
                {/* Fix #2 — Back to top with scroll progress */}
                <BackToTop />
              </div>
            </ToastProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
