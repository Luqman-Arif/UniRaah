import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const tooltipId = React.useId()

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-navy px-2.5 py-1 text-[11px] font-medium text-white shadow-elevated pointer-events-none select-none transition-opacity',
            sideClasses[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
