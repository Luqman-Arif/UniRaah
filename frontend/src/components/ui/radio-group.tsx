import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupContextValue {
  name: string
  value?: string
  onChange?: (val: string) => void
  disabled?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  error?: string
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      name,
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled,
      error,
      children,
      ...props
    },
    ref
  ) => {
    const generatedName = React.useId()
    const groupName = name || generatedName

    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue)
    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : uncontrolledValue

    const handleValueChange = (val: string) => {
      if (!isControlled) {
        setUncontrolledValue(val)
      }
      onValueChange?.(val)
    }

    return (
      <RadioGroupContext.Provider
        value={{
          name: groupName,
          value: currentValue,
          onChange: handleValueChange,
          disabled,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-invalid={!!error}
          className={cn('space-y-2', className)}
          {...props}
        >
          {children}
        </div>
        {error && <p className="text-xs font-medium text-error mt-1">{error}</p>}
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  label?: React.ReactNode
  description?: React.ReactNode
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, description, id, disabled: itemDisabled, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    const generatedId = React.useId()
    const itemId = id || generatedId

    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup')
    }

    const isChecked = context.value === value
    const isDisabled = context.disabled || itemDisabled

    return (
      <div className="flex items-start space-x-2.5 select-none">
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            type="radio"
            id={itemId}
            name={context.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            ref={ref}
            onChange={() => context.onChange?.(value)}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-4 w-4 rounded-full border border-border bg-surface transition-all flex items-center justify-center cursor-pointer',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
              'peer-checked:border-brand',
              isDisabled && 'cursor-not-allowed opacity-50 bg-slate-100',
              className
            )}
            onClick={() => {
              if (!isDisabled) {
                context.onChange?.(value)
              }
            }}
          >
            {isChecked && <div className="h-2 w-2 rounded-full bg-brand" />}
          </div>
        </div>

        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <label
                htmlFor={itemId}
                className={cn(
                  'text-sm font-medium text-navy cursor-pointer leading-none',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${itemId}-desc`}
                className={cn('text-xs text-muted leading-tight', isDisabled && 'opacity-50')}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'
