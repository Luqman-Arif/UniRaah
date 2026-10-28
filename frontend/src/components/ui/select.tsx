import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
  options?: SelectOption[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, children, id, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || generatedId

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-rose-500 focus-visible:ring-rose-500',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-desc` : undefined}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${selectId}-desc`} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
