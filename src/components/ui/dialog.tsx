import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  // Close on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      const originalPaddingRight = document.body.style.paddingRight
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

      document.body.style.overflow = 'hidden'
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }

      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.paddingRight = originalPaddingRight
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  const dialogContent = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        {/* Dialog Surface */}
        <div
          className={cn(
            'relative z-10 w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xl transition-all my-auto animate-in zoom-in-95 duration-200',
            maxWidthClasses[maxWidth]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between pb-3">
            <div>
              {title && (
                <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(dialogContent, document.body)
    : null
}

