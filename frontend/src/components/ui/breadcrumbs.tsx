import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  homeHref?: string
  className?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  homeHref = '/',
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-muted', className)}>
      <ol className="flex items-center flex-wrap gap-1.5">
        {showHome && (
          <li className="flex items-center">
            <Link
              to={homeHref}
              className="flex items-center gap-1 hover:text-navy transition-colors"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              {(showHome || index > 0) && (
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                </li>
              )}
              <li className="flex items-center">
                {isLast || !item.href ? (
                  <span
                    className="font-medium text-navy truncate max-w-[200px]"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-navy transition-colors truncate max-w-[200px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
