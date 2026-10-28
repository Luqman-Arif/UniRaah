import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  helperText?: string
  error?: string
  id?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-rose-500 focus-visible:ring-rose-500',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden p-1 rounded transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-desc`} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
