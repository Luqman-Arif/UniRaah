import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { VerificationCodeStep } from '@/components/auth/VerificationCodeStep'
import { HSCGroup, ExaminationBoard } from '@/types/student'
import {
  ArrowRight,
  Lock,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
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

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTarget = searchParams.get('redirect') || '/discover'

  const {
    login,
    loginWithPersona,
    checkEmailStatus,
    initiateSignUpVerification,
    resendSignUpVerificationCode,
    verifySignUpCodeAndRegister,
    resetPassword,
    rememberedEmail,
  } = useAuth()
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'forgot'>('signin')

  // Global submission & alert states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Sign In local state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Sign Up local state
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

  // Forgot password local state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('')
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request')
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null)
  const [enteredCode, setEnteredCode] = useState('')

  // Initialize remembered email
  useEffect(() => {
    if (rememberedEmail && !signInEmail) {
      setSignInEmail(rememberedEmail)
    }
  }, [rememberedEmail, signInEmail])

  // Pre-configured Student Personas for Demo Mode
  const handleLoadPersona = (persona: 'hamza' | 'aisha' | 'bilal') => {
    loginWithPersona(persona)
    setTimeout(() => {
      navigate(redirectTarget)
    }, 150)
  }

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
      setErrorMessage('Please enter your password.')
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
        navigate(redirectTarget)
      } else {
        setErrorMessage(res.error || 'Unable to sign in. Please verify your credentials.')
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in. Please try again.')
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
      setErrorMessage('Please enter your full student name (minimum 2 characters).')
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
      setErrorMessage('Passwords do not match. Please re-enter.')
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
          navigate(redirectTarget)
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
      const mockCode = '839104'
      setSimulatedCode(mockCode)
      setEnteredCode(mockCode)
      setForgotStep('reset')
      setSuccessMessage(`Reset code sent to ${forgotEmail}. (OTP: ${mockCode})`)
    }, 350)
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (enteredCode !== simulatedCode) {
      setErrorMessage('Invalid verification code.')
      return
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
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
        setSuccessMessage('Password reset successfully! Redirecting to sign in...')
        setSignInEmail(forgotEmail)
        setSignInPassword(forgotNewPassword)
        setTimeout(() => {
          setAuthTab('signin')
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
    <div className="space-y-6">
      {/* Return to website breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to UniRaah Website</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] font-bold text-brand-700 bg-brand-50 border-brand-200">
            Karachi Student Portal
          </Badge>
          <span className="text-[11px] text-slate-400">• BIEK & Federal Board</span>
        </div>
        <h2 className="text-xl font-extrabold text-navy sm:text-2xl tracking-tight">
          {authTab === 'signin'
            ? 'Sign In to UniRaah'
            : authTab === 'signup'
            ? 'Create Your Student Account'
            : 'Reset Account Password'}
        </h2>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Access your intermediate academic profile, saved priorities, and personalized Karachi university recommendations.
        </p>
      </div>

      {/* Feedback Alerts */}
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

      {/* Tabs Switcher: Sign In vs Sign Up */}
      {authTab !== 'forgot' && signUpStep !== 'verify' && (
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthTab('signin')
              setErrorMessage(null)
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              authTab === 'signin'
                ? 'bg-white text-navy shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('signup')
              setSignUpStep('form')
              setErrorMessage(null)
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              authTab === 'signup'
                ? 'bg-white text-navy shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* =============================================================== */}
      {/* SIGN IN TAB                                                     */}
      {/* =============================================================== */}
      {authTab === 'signin' && (
        <div className="space-y-4">
          <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand"
                />
                <span className="text-slate-600 text-xs font-medium">Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('forgot')
                  setForgotEmail(signInEmail || '')
                  setErrorMessage(null)
                }}
                className="text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 font-bold h-11 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer"
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

          {/* Quick test credentials autofill */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-500">
            <span>Quick fill:</span>
            <button
              type="button"
              onClick={() => handleQuickFillCredentials('hamza.karachi@example.com', 'password123')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[11px] cursor-pointer"
            >
              Hamza
            </button>
            <button
              type="button"
              onClick={() => handleQuickFillCredentials('aisha.fbise@example.com', 'password123')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[11px] cursor-pointer"
            >
              Aisha
            </button>
            <button
              type="button"
              onClick={() => handleQuickFillCredentials('bilal.premed@example.com', 'password123')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[11px] cursor-pointer"
            >
              Bilal
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-muted">
              <span className="bg-surface px-3">Instant 1-Click Evaluation Personas</span>
            </div>
          </div>

          {/* Pre-configured Demo Student Personas */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleLoadPersona('hamza')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-brand transition-colors">
                    Muhammad Hamza
                  </span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 font-semibold">
                    BIEK Karachi
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pre-Engineering • 82.5% Target • Gulshan-e-Iqbal
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => handleLoadPersona('aisha')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-brand transition-colors">
                    Aisha Fatima
                  </span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 font-semibold text-indigo-700 bg-indigo-50 border-indigo-200">
                    FBISE Federal
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Computer Science (ICS) • 86.8% Target • North Nazimabad
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => handleLoadPersona('bilal')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-brand transition-colors">
                    Bilal Tariq
                  </span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
                    Pre-Medical
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pre-Medical • 89.2% Target • Saddar
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* SIGN UP TAB                                                     */}
      {/* =============================================================== */}
      {authTab === 'signup' && (
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
          <form onSubmit={handleSignUpSubmit} className="space-y-4" noValidate>
            <div className="space-y-3">
              <Input
                label="Student Full Name"
                placeholder="e.g. Daniyal Ahmed"
                value={signUpName}
                onChange={(e) => {
                  setSignUpName(e.target.value)
                  setErrorMessage(null)
                }}
                helperText="As printed on your BIEK / Federal intermediate registration card"
                disabled={isSubmitting}
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

                {/* Typo suggestion banner */}
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
                      <span>Account already exists with this email.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail(signUpEmail)
                        setAuthTab('signin')
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
                    label="Password"
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

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Your academic profile is securely isolated with multi-tenant data protection under your private ID.
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || emailStatus?.isAlreadyRegistered}
              className="w-full h-11 font-bold gap-2 bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
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

      {/* =============================================================== */}
      {/* FORGOT PASSWORD TAB                                             */}
      {/* =============================================================== */}
      {authTab === 'forgot' && (
        <div className="space-y-4 pt-1 animate-in fade-in-50">
          <button
            type="button"
            onClick={() => {
              setAuthTab('signin')
              setErrorMessage(null)
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </button>

          {forgotStep === 'request' ? (
            <form onSubmit={handleForgotRequest} className="space-y-4" noValidate>
              <div>
                <h4 className="text-sm font-extrabold text-navy">Reset Your Student Password</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your registered UniRaah email to receive an instant verification code.
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
            <form onSubmit={handleResetSubmit} className="space-y-4" noValidate>
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

      {/* Footer Navigation Link */}
      <div className="pt-2 text-center text-xs text-muted border-t border-slate-100">
        <Link to="/" className="font-semibold text-brand hover:underline">
          ← Return to UniRaah Public Homepage
        </Link>
      </div>
    </div>
  )
}
