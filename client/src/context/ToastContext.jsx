import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

// ── Toast Container ────────────────────────────
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

// ── Single Toast ───────────────────────────────
const Toast = ({ toast, onRemove }) => {
  const colors = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '✓' },
    error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', icon: '✕' },
    info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', icon: 'ℹ' },
  }

  const style = colors[toast.type] || colors.success

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '10px',
        border: `1px solid ${style.border}`,
        backgroundColor: style.bg,
        color: style.text,
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        minWidth: '260px',
        maxWidth: '380px',
        animation: 'toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <span style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: style.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '700',
        flexShrink: 0,
      }}>
        {style.icon}
      </span>
      {toast.message}
    </div>
  )
}