import * as React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
  icon?: React.ReactNode
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'We encountered an error loading this data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className,
  icon,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-error-200 bg-error-50/50 p-8 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 text-error mb-3">
        {icon || <AlertCircle className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-navy">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted leading-relaxed">{description}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 border-error-200 text-error hover:bg-error-50">
            <RotateCcw className="h-3.5 w-3.5" />
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
