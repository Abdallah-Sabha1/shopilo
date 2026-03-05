/**
 * useDebounce.js
 *
 * WHY DEBOUNCE?
 * If we called the search API on every single keystroke, we'd fire 10+ requests
 * while the user types "smartphone". Debouncing waits until the user STOPS
 * typing for `delay` ms before firing the request.
 *
 * This is a very common interview question and shows you think about performance.
 */

import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: if value changes before the delay, cancel the previous timer
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
