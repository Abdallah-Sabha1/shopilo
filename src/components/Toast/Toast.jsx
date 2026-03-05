import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)
let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{ animation: 'fadeUp 0.3s ease' }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 shadow-xl cursor-pointer text-[13px] font-semibold min-w-[220px] max-w-[360px]
              ${toast.type === 'success' ? 'bg-[#141414] text-white' : 'bg-[#E8521A] text-white'}`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0
              ${toast.type === 'success' ? 'border-white' : 'border-white'}`}>
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be inside ToastProvider')
  return context
}
