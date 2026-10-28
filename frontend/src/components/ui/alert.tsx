import * as React from 'react'
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertType = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType
  title?: string
  children: React.ReactNode
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className,
  ...props
}) => {
  const styles = {
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-900',
      icon: <Info className="h-5 w-5 text-sky-600 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    },
    danger: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
    },
  }

  const current = styles[type]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 text-sm transition-all',
        current.container,
        className
      )}
      {...props}
    >
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold leading-none">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  )
}
