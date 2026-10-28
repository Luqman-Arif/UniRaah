import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Inbox,
  AlertTriangle,
} from 'lucide-react'

interface VerificationCodeStepProps {
  email: string
  fullName: string
  isSubmitting: boolean
  errorMessage: string | null
  onVerify: (code: string) => Promise<void>
  onResend: () => Promise<boolean | string | null>
  onBack: () => void
}

export const VerificationCodeStep: React.FC<VerificationCodeStepProps> = ({
  email,
  fullName,
  isSubmitting,
  errorMessage,
  onVerify,
  onResend,
  onBack,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [resendCooldown, setResendCooldown] = useState(45)
  const [isResending, setIsResending] = useState(false)
  const [localFeedback, setLocalFeedback] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const fullCode = digits.join('')
  const isComplete = fullCode.length === 6

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric characters
    const clean = val.replace(/\D/g, '')
    if (!clean) {
      const newDigits = [...digits]
      newDigits[index] = ''
      setDigits(newDigits)
      return
    }

    // If typing single digit
    const char = clean[clean.length - 1]
    const newDigits = [...digits]
    newDigits[index] = char
    setDigits(newDigits)
    setLocalFeedback(null)

    // Automatically advance focus to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const newDigits = ['', '', '', '', '', '']
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)
    setLocalFeedback(null)

    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()

    if (pasted.length === 6) {
      onVerify(pasted)
    }
  }

  const handleResendClick = async () => {
    if (resendCooldown > 0 || isResending) return
    setIsResending(true)
    setLocalFeedback(null)
    try {
      await onResend()
      setDigits(['', '', '', '', '', ''])
      setResendCooldown(45)
      setLocalFeedback(`A fresh verification code has been dispatched to ${email}. Check your Inbox and Spam folder.`)
      inputRefs.current[0]?.focus()
    } catch {
      setLocalFeedback(null)
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete) return
    onVerify(fullCode)
  }

  // Detect domain for smart webmail button
  const emailDomain = email.split('@')[1]?.toLowerCase() || ''
  const isGmail = emailDomain === 'gmail.com' || emailDomain.includes('google')
  const isOutlook =
    emailDomain.includes('outlook') ||
    emailDomain.includes('hotmail') ||
    emailDomain.includes('live') ||
    emailDomain.includes('msn')
  const isYahoo = emailDomain.includes('yahoo') || emailDomain.includes('ymail')
  const isEdu = emailDomain.includes('edu') || emailDomain.includes('umt') || emailDomain.includes('pk')

  return (
    <div className="space-y-3.5 pt-1 animate-in fade-in-50">
      {/* Step Header */}
      <div className="text-center space-y-1">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 text-brand shadow-xs mb-1.5">
          <Mail className="h-6 w-6 text-brand" />
        </div>
        <h4 className="text-base font-extrabold text-navy tracking-tight">
          Verify Your Student Email
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Hello <span className="font-semibold text-slate-800">{fullName}</span>, we sent a 6-digit confirmation code to:
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 px-3 py-1.5 rounded-lg text-xs font-semibold text-navy">
          <span>{email}</span>
          <button
            type="button"
            onClick={onBack}
            className="text-[11px] text-brand hover:text-brand-800 hover:underline cursor-pointer font-bold ml-0.5"
          >
            Edit Email
          </button>
        </div>
      </div>

      {/* Smart Email Inbox Shortcut */}
      <div className="space-y-2">
        {isGmail ? (
          <a
            href="https://mail.google.com/mail/u/0/#search/UniRaah"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-gradient-to-r from-red-50/70 via-white to-red-50/40 border border-red-200/80 hover:border-red-300 text-xs text-slate-700 transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs shrink-0">
                M
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <span>Open Gmail Inbox</span>
                  <span className="text-[10px] text-red-700 font-semibold bg-red-100/80 px-1.5 py-0.2 rounded">
                    mail.google.com
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Go to Gmail to find your UniRaah code</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-red-600 transition-colors shrink-0 mr-1" />
          </a>
        ) : isEdu ? (
          <a
            href="https://mail.google.com/mail/u/0/#search/UniRaah"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-gradient-to-r from-brand-50/70 via-white to-blue-50/40 border border-brand-200/80 hover:border-brand-300 text-xs text-slate-700 transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand font-bold text-xs shrink-0">
                🎓
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <span>Open Student Webmail (Gmail / Portal)</span>
                  <span className="text-[10px] text-brand-700 font-semibold bg-brand-100/80 px-1.5 py-0.2 rounded">
                    mail.google.com
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Check your university student email inbox & spam</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-brand transition-colors shrink-0 mr-1" />
          </a>
        ) : isOutlook ? (
          <a
            href="https://outlook.live.com/mail/0/inbox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-gradient-to-r from-sky-50/70 via-white to-sky-50/40 border border-sky-200/80 hover:border-sky-300 text-xs text-slate-700 transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs shrink-0">
                O
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <span>Open Outlook Inbox</span>
                  <span className="text-[10px] text-sky-700 font-semibold bg-sky-100/80 px-1.5 py-0.2 rounded">
                    outlook.com
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Go to Outlook to find your UniRaah code</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0 mr-1" />
          </a>
        ) : isYahoo ? (
          <a
            href="https://mail.yahoo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-slate-700 transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                Y
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <span>Open Yahoo Mail</span>
                </div>
                <p className="text-[11px] text-slate-500">Check incoming emails or spam folder</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0 mr-1" />
          </a>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Inbox className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-semibold text-slate-800">Check your email client</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Look for an email from <strong>UniRaah</strong> containing your 6-digit confirmation code.
              </p>
            </div>
          </div>
        )}

        {/* Spam / Junk Notice */}
        <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold">Can&apos;t find the email in your Inbox?</span>
            <p className="text-[11px] text-amber-800/90 mt-0.5">
              Institutional filters often direct external confirmation emails to your <strong>Spam</strong> or <strong>Junk</strong> folder. Please open your Spam folder to view the code.
            </p>
          </div>
        </div>
      </div>

      {/* Local Feedback */}
      {localFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{localFeedback}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in-50">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* 6-Digit Segmented OTP Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-center text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Enter 6-Digit Verification Code
          </label>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting}
                className={`w-10 sm:w-12 h-12 sm:h-13 text-center text-lg sm:text-xl font-bold font-mono text-navy rounded-xl border transition-all outline-none ${
                  errorMessage
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-200'
                    : digit
                    ? 'border-brand bg-brand-50/30 ring-2 ring-brand/10 shadow-2xs'
                    : 'border-slate-300 bg-white hover:border-slate-400 focus:border-brand focus:ring-3 focus:ring-brand/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Resend Code Row */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <span className="text-slate-500">Didn&apos;t get the email?</span>
          {resendCooldown > 0 ? (
            <span className="font-semibold text-slate-400 text-[11px]">
              Resend in <span className="font-mono text-slate-600 font-bold">{resendCooldown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isResending}
              className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-800 hover:underline cursor-pointer text-xs"
            >
              <RotateCcw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={!isComplete || isSubmitting}
          className="w-full h-11 font-bold gap-2 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying Code & Creating Account...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              <span>Verify Code & Complete Sign Up</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Return to form link */}
        <div className="text-center pt-0.5">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to student details</span>
          </button>
        </div>
      </form>
    </div>
  )
}
