import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    isPositive?: boolean
  }
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden transition-all hover:border-slate-300', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
          {trend && (
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
