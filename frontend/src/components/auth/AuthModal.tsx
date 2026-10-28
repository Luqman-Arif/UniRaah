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
    signUp,
    checkEmailStatus,
    isEmailRegistered,
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

  // Sign Up Email Validation State
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

  // Sync mode when modal opens
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode)
    }
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
      setErrorMessage(emailCheck.error || 'Please enter a valid email address.')
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
      const res = await signUp({
        fullName: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        hscGroup: signUpGroup,
        board: signUpBoard,
        hscTotalPredictedPercentage: 80.0,
      })

      if (res.success && res.user) {
        setSuccessMessage(`Account created successfully! Welcome, ${res.user.fullName}!`)
        setTimeout(() => {
          handlePostAuthRedirect()
        }, 500)
      } else {
        setErrorMessage(res.error || 'Failed to create student account.')
      }
    } catch {
      setErrorMessage('Unable to create account. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // -------------------------------------------------------------
  // FORGOT / RESET PASSWORD SUBMISSION
  // -------------------------------------------------------------
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const cleanEmail = forgotEmail.trim()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.')
      return
    }

    if (!isEmailRegistered(cleanEmail)) {
      setErrorMessage(`No account found registered under ${cleanEmail}. Please check the email or sign up.`)
      return
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.')
      return
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both passwords match.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await resetPassword(cleanEmail, forgotNewPassword)
      if (res.success) {
        setSuccessMessage('Password reset successfully! You can now sign in with your new password.')
        setSignInEmail(cleanEmail)
        setSignInPassword(forgotNewPassword)
        setTimeout(() => {
          setActiveTab('signin')
          setForgotNewPassword('')
          setForgotConfirmPassword('')
        }, 1200)
      } else {
        setErrorMessage(res.error || 'Failed to reset password.')
      }
    } catch {
      setErrorMessage('Failed to reset password. Please try again.')
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
        {activeTab !== 'forgot' && (
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
                placeholder="name@email.com"
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

            {/* Professional Sign-In Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Don't have a student account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup')
                    setErrorMessage(null)
                    setSuccessMessage(null)
                  }}
                  className="font-bold text-brand hover:text-brand-800 hover:underline cursor-pointer"
                >
                  Create Student Account →
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Protected by SSL encryption & candidate privacy standards</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SIGN UP VIEW                                                 */}
        {/* ============================================================ */}
        {activeTab === 'signup' && (
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
                    <span>Valid student email format</span>
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
                  <span>Creating Student Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Create Student Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="pt-1 text-center text-xs text-slate-500">
              <span>Already have a student account? </span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin')
                  setErrorMessage(null)
                }}
                className="font-bold text-brand hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </form>
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

            <form onSubmit={handleResetSubmit} className="space-y-3" noValidate>
              <div>
                <h4 className="text-sm font-extrabold text-navy">Reset Your Student Password</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your registered student email and choose a new password.
                </p>
              </div>

              <Input
                label="Registered Student Email"
                type="email"
                placeholder="name@email.com"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value)
                  setErrorMessage(null)
                }}
                disabled={isSubmitting}
                autoFocus
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
                    <KeyRound className="h-4 w-4" />
                    <span>Reset Password & Sign In</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </Dialog>
  )
}
