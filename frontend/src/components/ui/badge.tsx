/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default: 'bg-brand-50 text-brand-700 border border-brand-200',
        secondary: 'bg-slate-100 text-slate-800 border border-slate-200',
        outline: 'border border-border text-navy bg-surface',
        success: 'bg-success-50 text-success-700 border border-success-200',
        warning: 'bg-warning-50 text-warning-700 border border-warning-200',
        error: 'bg-error-50 text-error-700 border border-error-200',
        destructive: 'bg-error-50 text-error-700 border border-error-200',
        info: 'bg-sky-50 text-sky-700 border border-sky-200',
        // Eligibility match tiers
        safety: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
        target: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
        reach: 'bg-red-50 text-red-900 border border-red-300 font-bold',
        // Operational / Data status
        verified: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        pending: 'bg-amber-50 text-amber-800 border border-amber-200',
        open: 'bg-brand-50 text-brand-700 border border-brand-200',
        closed: 'bg-slate-100 text-slate-700 border border-slate-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
