import React from 'react'
import { Check, X } from 'lucide-react'

interface PasswordStrengthMeterProps {
  password: string
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null

  const hasMinLength = password.length >= 6
  const hasStrongLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)

  let score = 0
  if (hasMinLength) score += 1
  if (hasNumber && hasLetter) score += 1
  if (hasStrongLength || hasSpecial) score += 1

  const getStrengthLabel = () => {
    if (score === 0 || !hasMinLength) return { text: 'Too Weak', color: 'bg-rose-500', textClass: 'text-rose-600' }
    if (score === 1) return { text: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-600' }
    if (score === 2) return { text: 'Good', color: 'bg-blue-500', textClass: 'text-blue-600' }
    return { text: 'Strong', color: 'bg-emerald-500', textClass: 'text-emerald-600' }
  }

  const { text, color, textClass } = getStrengthLabel()

  return (
    <div className="space-y-1.5 pt-1">
      {/* 3-segment Progress Bar */}
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              score >= 1 ? color : 'w-0'
            }`}
            style={{ width: score >= 1 ? '100%' : '0%' }}
          />
        </div>
        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              score >= 2 ? color : 'w-0'
            }`}
            style={{ width: score >= 2 ? '100%' : '0%' }}
          />
        </div>
        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              score >= 3 ? color : 'w-0'
            }`}
            style={{ width: score >= 3 ? '100%' : '0%' }}
          />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${textClass}`}>
          {text}
        </span>
      </div>

      {/* Rules Indicator Checklist */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 pt-0.5">
        <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
          {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          Min 6 characters
        </span>
        <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
          {hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          Includes number
        </span>
        <span className={`inline-flex items-center gap-1 ${hasLetter ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
          {hasLetter ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          Includes letter
        </span>
      </div>
    </div>
  )
}
