import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  if (totalPages <= 1) return null

  // Generate pagination range with ellipses
  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, 'dots-right', totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [1, 'dots-left', ...rightRange]
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [1, 'dots-left', ...middleRange, 'dots-right', totalPages]
  }

  const pages = getPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn('flex items-center justify-center space-x-1 select-none', className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 px-2.5 gap-1 text-xs"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center space-x-1">
        {pages.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span
                key={`${page}-${index}`}
                className="flex h-8 w-8 items-center justify-center text-muted"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )
          }

          const isCurrent = page === currentPage

          return (
            <Button
              key={page}
              variant={isCurrent ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className={cn(
                'h-8 w-8 p-0 text-xs font-semibold',
                isCurrent && 'pointer-events-none'
              )}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 px-2.5 gap-1 text-xs"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
