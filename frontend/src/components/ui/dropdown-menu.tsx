import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DropdownMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
}

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
  className?: string
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            'absolute z-50 mt-1.5 w-56 rounded-lg border border-border bg-surface p-1 shadow-dropdown transition-all animate-in fade-in-0 zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={`div-${idx}`} className="my-1 h-px bg-slate-100" />
            }
            return (
              <button
                key={item.id}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.()
                    setIsOpen(false)
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer select-none text-left',
                  item.destructive
                    ? 'text-error hover:bg-red-50 hover:text-red-700'
                    : 'text-navy hover:bg-slate-100 hover:text-navy',
                  item.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
