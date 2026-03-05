/**
 * utils/helpers.js
 * Small pure functions — easy to unit test, easy to reuse.
 */

// Format price to USD currency string
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

// Render star rating as an array of 'filled' | 'half' | 'empty'
export const getRatingStars = (rating, max = 5) => {
  return Array.from({ length: max }, (_, i) => {
    if (i < Math.floor(rating)) return 'filled'
    if (i < rating) return 'half'
    return 'empty'
  })
}

// Truncate a string to a max length
export const truncate = (str, length = 80) =>
  str?.length > length ? str.slice(0, length) + '…' : str

// Capitalize first letter of each word
export const titleCase = (str) =>
  str?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? ''
