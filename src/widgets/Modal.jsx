import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ show, onClose, children }) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 350)
      return () => clearTimeout(t)
    }
  }, [show])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{
        background: `rgba(0,0,0,${visible ? 0.6 : 0})`,
        zIndex: 99999,
        transition: 'background 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-6 pb-10"
        style={{
          background: '#fffaf7',
          maxHeight: '90vh',
          overflowY: 'auto',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.25, 0, 0, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  )
}
