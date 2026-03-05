# 🛍️ Shopilo — Professional React E-Commerce

A full-featured e-commerce app built with **React 18**, **React Router v6**, and the free **DummyJSON API**. No backend  — everything runs in the browser.

## ✨ Features

| Feature | Technical Skill |
|---|---|
| Multi-page navigation | React Router v6, `useNavigate`, `useParams` |
| Global cart with persistence | Context API + `useReducer` + `localStorage` |
| Wishlist | Context API (same pattern, reusable) |
| Real product data | `fetch`, custom hooks, async/await |
| Search with debounce | `useDebounce` hook, prevents API spam |
| Filter by category | URL Search Params (shareable URLs) |
| Sort products | `useMemo` for performance |
| Pagination | Client-side derived state |
| Loading skeletons | CSS shimmer animation |
| Toast notifications | Custom Context + auto-dismiss |
| Coupon codes | Local state logic |
| Responsive design | CSS Grid, media queries |

## 🗂️ Project Structure

```
src/
├── components/       # Reusable UI (Navbar, ProductCard, etc.)
├── pages/            # Full pages (Home, Shop, ProductDetail, Cart, Wishlist)
├── context/          # Global state (CartContext, WishlistContext)
├── hooks/            # Custom hooks (useProducts, useDebounce)
└── utils/            # Pure helper functions
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
```

```

## 🔌 API

Uses [DummyJSON](https://dummyjson.com/docs/products) — completely free, no API key required.

Key endpoints used:
- `GET /products` — all products
- `GET /products/{id}` — single product with reviews
- `GET /products/search?q=` — search
- `GET /products/categories` — category list
- `GET /products/category/{name}` — filter by category



## 🎨 Tech Stack

- **React 18** + Vite
- **React Router v6**
- **CSS Modules** (scoped styles, no clashes)
- **Google Fonts** (Cormorant Garamond + Syne)
- Zero external UI libraries — built from scratch
