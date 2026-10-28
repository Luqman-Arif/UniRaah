import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
  htmlFor?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  error,
  required,
  htmlFor,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold uppercase tracking-wider text-navy"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-error leading-tight">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted leading-tight">{helperText}</p>
      ) : null}
    </div>
  )
}
