import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible,   setVisible]   = useState(false)
  const [progress,  setProgress]  = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPct)
      setVisible(scrollTop > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  const r = 18
  const circ = 2 * Math.PI * r
  const dash = circ - (progress / 100) * circ

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white border border-[#E0D9D2] shadow-lg hover:border-[#E8521A] hover:text-[#E8521A] text-[#141414] transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#E0D9D2" strokeWidth="2" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke="#E8521A" strokeWidth="2"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  )
}
