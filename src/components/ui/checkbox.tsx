import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, disabled, checked, defaultChecked, onChange, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    const [isChecked, setIsChecked] = React.useState<boolean>(
      checked !== undefined ? !!checked : !!defaultChecked
    )

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(!!checked)
      }
    }, [checked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked)
      }
      onChange?.(e)
    }

    return (
      <div className="flex items-start space-x-2.5 select-none">
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${checkboxId}-error`
                : description
                ? `${checkboxId}-desc`
                : undefined
            }
            {...props}
          />
          <div
            className={cn(
              'h-4 w-4 rounded border border-border bg-surface transition-all flex items-center justify-center cursor-pointer',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
              'peer-checked:bg-brand peer-checked:border-brand peer-checked:text-white',
              disabled && 'cursor-not-allowed opacity-50 bg-slate-100',
              error && 'border-error',
              className
            )}
            onClick={() => {
              if (!disabled) {
                const input = document.getElementById(checkboxId) as HTMLInputElement
                if (input) input.click()
              }
            }}
          >
            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </div>

        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium text-navy cursor-pointer leading-none',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${checkboxId}-desc`}
                className={cn('text-xs text-muted leading-tight', disabled && 'opacity-50')}
              >
                {description}
              </p>
            )}
            {error && (
              <p id={`${checkboxId}-error`} className="text-xs font-medium text-error">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
