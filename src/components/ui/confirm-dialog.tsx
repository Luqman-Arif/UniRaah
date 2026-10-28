import * as React from 'react'
import { Dialog } from './dialog'
import { Button } from './button'
import { AlertTriangle, Info } from 'lucide-react'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'default'
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}) => {
  const isDestructive = variant === 'destructive'

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start gap-4 pt-1">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isDestructive ? 'bg-error-50 text-error' : 'bg-brand-50 text-brand'
          }`}
        >
          {isDestructive ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="text-base font-semibold text-navy leading-none">{title}</h3>
          <p className="text-xs text-muted leading-relaxed pt-1">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={isDestructive ? 'destructive' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Dialog>
  )
}
