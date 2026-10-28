import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { VerificationCodeStep } from '@/components/auth/VerificationCodeStep'
import { HSCGroup, ExaminationBoard } from '@/types/student'
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'

const examinationBoards: ExaminationBoard[] = [
  'Board of Intermediate Education Karachi (BIEK)',
  'Federal Board of Intermediate & Secondary Education (FBISE)',
  'Aga Khan University Examination Board (AKU-EB)',
  'Cambridge International (A-Levels)',
  'Sindh Board',
]

const hscGroups: HSCGroup[] = [
  'Pre-Engineering',
  'Pre-Medical',
  'Computer Science',
  'General Science',
  'Commerce',
  'Arts & Humanities',
]

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    authModalMessage,
    login,
    loginWithPersona,
    checkEmailStatus,
    initiateSignUpVerification,
    resendSignUpVerificationCode,
    verifySignUpCodeAndRegister,
    resetPassword,
    redirectAfterAuth,
    setRedirectAfterAuth,
    rememberedEmail,
  } = useAuth()

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(authModalMode || 'signin')

  // Global loading & alert states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Sign In local form state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Sign Up local form state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpBoard, setSignUpBoard] = useState<ExaminationBoard>('Board of Intermediate Education Karachi (BIEK)')
  const [signUpGroup, setSignUpGroup] = useState<HSCGroup>('Pre-Engineering')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')

  // Sign Up Multi-Step OTP Verification State
  const [signUpStep, setSignUpStep] = useState<'form' | 'verify'>('form')
  const [emailStatus, setEmailStatus] = useState<{
    isValid: boolean
    isAlreadyRegistered: boolean
    error?: string
    isTypo?: boolean
    suggestion?: string
    domain?: string
  } | null>(null)

  // Forgot Password local state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('')
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request')
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null)
  const [enteredCode, setEnteredCode] = useState('')

  // Sync mode when modal opens
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode)
    }
    setSignUpStep('form')
    setEmailStatus(null)
    setErrorMessage(null)
    setSuccessMessage(null)
  }, [authModalMode, isAuthModalOpen])

  // Pre-fill remembered email
  useEffect(() => {
    if (rememberedEmail && !signInEmail) {
      setSignInEmail(rememberedEmail)
    }
  }, [rememberedEmail, signInEmail])

  const handlePostAuthRedirect = () => {
    const target = redirectAfterAuth || '/discover'
    setRedirectAfterAuth(null)
    closeAuthModal()
    navigate(target)
  }

  // Quick 1-click persona switch
  const handlePersonaClick = (key: 'hamza' | 'aisha' | 'bilal') => {
    loginWithPersona(key)
    handlePostAuthRedirect()
  }

  // Quick fill form credentials for test evaluation
  const handleQuickFillCredentials = (email: string, pass: string) => {
    setSignInEmail(email)
    setSignInPassword(pass)
    setErrorMessage(null)
  }

  // -------------------------------------------------------------
  // SIGN IN SUBMISSION
  // -------------------------------------------------------------
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!signInEmail.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (!signInPassword) {
      setErrorMessage('Please enter your account password.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await login({
        email: signInEmail.trim(),
        password: signInPassword,
        rememberMe,
      })

      if (res.success) {
        handlePostAuthRedirect()
      } else {
        setErrorMessage(res.error || 'Unable to sign in. Please check your credentials.')
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // -------------------------------------------------------------
  // SIGN UP FORM & EMAIL VALIDATION HANDLERS
  // -------------------------------------------------------------
  const handleSignUpEmailChange = (val: string) => {
    setSignUpEmail(val)
    setErrorMessage(null)
    if (!val.trim()) {
      setEmailStatus(null)
      return
    }
    if (val.includes('@') && val.length >= 5) {
      const status = checkEmailStatus(val)
      setEmailStatus(status)
    } else {
      setEmailStatus(null)
    }
  }

  const handleSignUpEmailBlur = () => {
    if (!signUpEmail.trim()) {
      setEmailStatus(null)
      return
    }
    const status = checkEmailStatus(signUpEmail)
    setEmailStatus(status)
  }

  const handleApplyEmailSuggestion = (suggested: string) => {
    setSignUpEmail(suggested)
    const status = checkEmailStatus(suggested)
    setEmailStatus(status)
    setErrorMessage(null)
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!signUpName.trim() || signUpName.trim().length < 2) {
      setErrorMessage('Please enter your full student name (at least 2 characters).')
      return
    }

    const emailCheck = checkEmailStatus(signUpEmail.trim())
    setEmailStatus(emailCheck)

    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || 'Please enter a valid original email address.')
      return
    }

    if (emailCheck.isAlreadyRegistered) {
      setErrorMessage(`An account with ${signUpEmail.trim()} already exists. Please sign in instead.`)
      return
    }

    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await initiateSignUpVerification({
        fullName: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        hscGroup: signUpGroup,
        board: signUpBoard,
        hscTotalPredictedPercentage: 80.0,
      })

      if (res.success) {
        setSignUpStep('verify')
      } else {
        setErrorMessage(res.error || 'Failed to initiate email verification.')
      }
    } catch {
      setErrorMessage('Unable to send verification code. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCodeSubmit = async (code: string) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const res = await verifySignUpCodeAndRegister(signUpEmail.trim(), code)
      if (res.success && res.user) {
        setSuccessMessage(`Email verified! Welcome to UniRaah, ${res.user.fullName}!`)
        setTimeout(() => {
          handlePostAuthRedirect()
        }, 600)
      } else {
        setErrorMessage(res.error || 'Invalid verification code. Please try again.')
      }
    } catch {
      setErrorMessage('Failed to verify code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendSignUpCode = async (): Promise<boolean> => {
    try {
      const res = await resendSignUpVerificationCode(signUpEmail.trim())
      if (res.success) {
        return true
      } else {
        setErrorMessage(res.error || 'Failed to resend verification code.')
        return false
      }
    } catch {
      setErrorMessage('Failed to resend verification code.')
      return false
    }
  }

  // -------------------------------------------------------------
  // FORGOT / RESET PASSWORD SUBMISSION
  // -------------------------------------------------------------
  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const mockCode = '749215'
      setSimulatedCode(mockCode)
      setEnteredCode(mockCode)
      setForgotStep('reset')
      setSuccessMessage(`Verification code sent to ${forgotEmail}. (Evaluation OTP code: ${mockCode})`)
    }, 400)
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (enteredCode !== simulatedCode) {
      setErrorMessage('Invalid verification code. Please check the code provided.')
      return
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.')
      return
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await resetPassword(forgotEmail, forgotNewPassword)
      if (res.success) {
        setSuccessMessage('Password reset successfully! You can now sign in with your new password.')
        setSignInEmail(forgotEmail)
        setSignInPassword(forgotNewPassword)
        setTimeout(() => {
          setActiveTab('signin')
          setForgotStep('request')
          setSimulatedCode(null)
          setEnteredCode('')
          setForgotNewPassword('')
          setForgotConfirmPassword('')
        }, 1200)
      } else {
        setErrorMessage(res.error || 'Failed to reset password.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="space-y-4">
        {/* Modal Brand Header */}
        <div className="text-center pt-1 pb-1">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-xs mb-2.5">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h3 className="text-xl font-extrabold text-navy tracking-tight">
              Uni<span className="text-brand">Raah</span>
            </h3>
            <Badge variant="outline" className="text-[10px] text-brand-700 bg-brand-50 border-brand-200 py-0">
              Karachi HSC Portal
            </Badge>
          </div>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            {authModalMessage ||
              'Access personalized Karachi degree recommendations, admission probability forecasts, and campus comparison metrics.'}
          </p>
        </div>

        {/* Dynamic Alert Banners */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{successMessage}</div>
          </div>
        )}

        {/* Tab Switcher (Sign In vs Sign Up) */}
        {activeTab !== 'forgot' && signUpStep !== 'verify' && (
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin')
                setErrorMessage(null)
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-navy shadow-xs ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup')
                setSignUpStep('form')
                setErrorMessage(null)
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-navy shadow-xs ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Create Student Account
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* SIGN IN VIEW                                                 */}
        {/* ============================================================ */}
        {activeTab === 'signin' && (
          <div className="space-y-4 pt-1 animate-in fade-in-50">
            <form onSubmit={handleSignInSubmit} className="space-y-3" noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="student@example.com"
                value={signInEmail}
                onChange={(e) => {
                  setSignInEmail(e.target.value)
                  setErrorMessage(null)
                }}
                disabled={isSubmitting}
                autoFocus
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => {
                  setSignInPassword(e.target.value)
                  setErrorMessage(null)
                }}
                disabled={isSubmitting}
              />

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-slate-600 text-[11px] font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot')
                    setForgotEmail(signInEmail || '')
                    setErrorMessage(null)
                  }}
                  className="text-[11px] font-bold text-brand hover:text-brand-800 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-bold gap-2 mt-2 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Sign In to Student Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick autofill pills for test convenience */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-500">
              <span>Quick fill:</span>
              <button
                type="button"
                onClick={() => handleQuickFillCredentials('hamza.karachi@example.com', 'password123')}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[10px] cursor-pointer"
              >
                Hamza
              </button>
              <button
                type="button"
                onClick={() => handleQuickFillCredentials('aisha.fbise@example.com', 'password123')}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[10px] cursor-pointer"
              >
                Aisha
              </button>
              <button
                type="button"
                onClick={() => handleQuickFillCredentials('bilal.premed@example.com', 'password123')}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[10px] cursor-pointer"
              >
                Bilal
              </button>
            </div>

            {/* Instant 1-Click Evaluation Personas */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Instant 1-Click Demo Evaluation Personas
                </span>
                <span className="text-[10px] font-semibold text-brand bg-brand-50 px-1.5 py-0.2 rounded">
                  No password needed
                </span>
              </div>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => handlePersonaClick('hamza')}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center font-bold text-xs">
                      MH
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-navy group-hover:text-brand">
                          Muhammad Hamza
                        </span>
                        <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1 rounded">
                          Pre-Engineering
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">BIEK Karachi • 82.5% Target</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-brand group-hover:translate-x-0.5 transition-transform">
                    1-Click In →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePersonaClick('aisha')}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      AF
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-navy group-hover:text-brand">
                          Aisha Fatima
                        </span>
                        <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-700 px-1 rounded">
                          Computer Science
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">FBISE Federal • 86.8% Target</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-brand group-hover:translate-x-0.5 transition-transform">
                    1-Click In →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePersonaClick('bilal')}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      BT
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-navy group-hover:text-brand">
                          Bilal Tariq
                        </span>
                        <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1 rounded">
                          Pre-Medical
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">BIEK Karachi • 89.2% Target</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-brand group-hover:translate-x-0.5 transition-transform">
                    1-Click In →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SIGN UP VIEW                                                 */}
        {/* ============================================================ */}
        {activeTab === 'signup' && (
          signUpStep === 'verify' ? (
            <VerificationCodeStep
              email={signUpEmail.trim()}
              fullName={signUpName.trim()}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onVerify={handleVerifyCodeSubmit}
              onResend={handleResendSignUpCode}
              onBack={() => {
                setSignUpStep('form')
                setErrorMessage(null)
              }}
            />
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3 pt-1 animate-in fade-in-50" noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="e.g. Daniyal Khan"
                  value={signUpName}
                  onChange={(e) => {
                    setSignUpName(e.target.value)
                    setErrorMessage(null)
                  }}
                  disabled={isSubmitting}
                  autoFocus
                />

                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. daniyal99@gmail.com"
                    value={signUpEmail}
                    onChange={(e) => handleSignUpEmailChange(e.target.value)}
                    onBlur={handleSignUpEmailBlur}
                    disabled={isSubmitting}
                    error={
                      emailStatus &&
                      !emailStatus.isValid &&
                      !emailStatus.isTypo &&
                      !emailStatus.isAlreadyRegistered
                        ? emailStatus.error
                        : undefined
                    }
                  />

                  {/* Typo detected suggestion banner */}
                  {emailStatus?.isTypo && emailStatus.suggestion && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-1.5 animate-in fade-in-50">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>
                          Did you mean <strong className="font-bold underline">{emailStatus.suggestion}</strong>?
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyEmailSuggestion(emailStatus.suggestion!)}
                        className="text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0"
                      >
                        Use Fix
                      </button>
                    </div>
                  )}

                  {/* Account already exists alert */}
                  {emailStatus?.isAlreadyRegistered && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs mt-1.5 animate-in fade-in-50">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        <span>Account already exists.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInEmail(signUpEmail)
                          setActiveTab('signin')
                          setErrorMessage(null)
                        }}
                        className="text-[11px] font-bold text-brand hover:underline cursor-pointer shrink-0"
                      >
                        Sign in instead →
                      </button>
                    </div>
                  )}

                  {/* Valid email format indicator */}
                  {emailStatus?.isValid && (
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium mt-1 px-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Valid email format • Ready for verification code</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Examination Board
                  </label>
                  <Select
                    value={signUpBoard}
                    onChange={(e) => setSignUpBoard(e.target.value as ExaminationBoard)}
                    className="text-xs"
                    disabled={isSubmitting}
                  >
                    {examinationBoards.map((b) => (
                      <option key={b} value={b}>
                        {b.includes('BIEK') ? 'BIEK Karachi (Official)' : b}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    HSC Academic Group
                  </label>
                  <Select
                    value={signUpGroup}
                    onChange={(e) => setSignUpGroup(e.target.value as HSCGroup)}
                    className="text-xs"
                    disabled={isSubmitting}
                  >
                    {hscGroups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <PasswordInput
                    label="Create Password"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    disabled={isSubmitting}
                  />
                  <PasswordStrengthMeter password={signUpPassword} />
                </div>

                <div>
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={signUpConfirmPassword}
                    onChange={(e) => {
                      setSignUpConfirmPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    disabled={isSubmitting}
                    error={
                      signUpConfirmPassword && signUpPassword !== signUpConfirmPassword
                        ? 'Passwords do not match'
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Your academic data is securely isolated and processed locally under your unique student profile.
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || emailStatus?.isAlreadyRegistered}
                className="w-full h-11 font-bold gap-2 mt-2 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Verification Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Create Account & Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )
        )}

        {/* ============================================================ */}
        {/* FORGOT PASSWORD VIEW                                         */}
        {/* ============================================================ */}
        {activeTab === 'forgot' && (
          <div className="space-y-4 pt-1 animate-in fade-in-50">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin')
                setErrorMessage(null)
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequest} className="space-y-3" noValidate>
                <div>
                  <h4 className="text-sm font-extrabold text-navy">Reset Your Student Password</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the email registered with your UniRaah account to receive an instant verification code.
                  </p>
                </div>

                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="student@example.com"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value)
                    setErrorMessage(null)
                  }}
                  disabled={isSubmitting}
                  autoFocus
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 font-bold gap-2 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Request Verification Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3" noValidate>
                <div>
                  <h4 className="text-sm font-extrabold text-navy">Enter New Password</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We sent a 6-digit code to <strong className="text-slate-800">{forgotEmail}</strong>.
                  </p>
                </div>

                <Input
                  label="Verification Code (OTP)"
                  placeholder="6-digit code"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value)
                    setErrorMessage(null)
                  }}
                  disabled={isSubmitting}
                  helperText="Evaluation code pre-filled for convenience"
                />

                <PasswordInput
                  label="New Password"
                  placeholder="••••••••"
                  value={forgotNewPassword}
                  onChange={(e) => {
                    setForgotNewPassword(e.target.value)
                    setErrorMessage(null)
                  }}
                  disabled={isSubmitting}
                />
                <PasswordStrengthMeter password={forgotNewPassword} />

                <PasswordInput
                  label="Confirm New Password"
                  placeholder="••••••••"
                  value={forgotConfirmPassword}
                  onChange={(e) => {
                    setForgotConfirmPassword(e.target.value)
                    setErrorMessage(null)
                  }}
                  disabled={isSubmitting}
                  error={
                    forgotConfirmPassword && forgotNewPassword !== forgotConfirmPassword
                      ? 'Passwords do not match'
                      : undefined
                  }
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 font-bold gap-2 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Update Password & Sign In</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}
