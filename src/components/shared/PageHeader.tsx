import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description?: string
  badge?: ReactNode
  actions?: ReactNode
  breadcrumbs?: ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-5 border-b border-border mb-6',
        className
      )}
    >
      {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-navy">{title}</h1>
            {badge}
          </div>
          {description && <p className="text-xs sm:text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">{actions}</div>}
      </div>
    </div>
  )
}
