import * as React from 'react'
import { FolderSearch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-3">
        {icon || <FolderSearch className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
