import React, { useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/marketing/PublicFooter'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, LogIn, Sparkles } from 'lucide-react'

export const StudentLayout: React.FC = () => {
  const { isAuthenticated, openAuthModal, loginWithPersona } = useAuth()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-page text-navy flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Unified Professional Navigation Bar (Identical across the entire application) */}
      <PublicNavbar />

      {/* Main Content Area: Authenticated Records vs Sign-In Gate */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isAuthenticated ? (
          <Outlet />
        ) : (
          /* Authentication Gate for Guests trying to access main features directly */
          <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand border border-brand-200 shadow-sm">
              <Lock className="h-8 w-8 text-brand-600" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-xs text-brand-700 bg-brand-50 border-brand-200">
                Authentication Required
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
                Sign In to Explore Degree Records
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Personalized Karachi degree recommendations, multi-year cutoff forecasts, and eligibility checks are grounded in your student profile. Please sign in or create an account to view your records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => openAuthModal('signin', '/discover')}
                className="w-full sm:w-auto h-12 px-6 gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In to Student Account</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => openAuthModal('signup', '/discover')}
                className="w-full sm:w-auto h-12 px-6 gap-2 font-semibold border-slate-300 hover:bg-slate-50 text-navy cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-brand" />
                <span>Create Student Account</span>
              </Button>
            </div>

            {/* Instant Demo Personas for Quick Evaluation */}
            <div className="pt-8 border-t border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Or Instant 1-Click Evaluation Personas
              </p>
              <div className="grid gap-2 sm:grid-cols-3 text-left">
                <button
                  type="button"
                  onClick={() => loginWithPersona('hamza')}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/40 transition-all cursor-pointer shadow-2xs group"
                >
                  <p className="text-xs font-bold text-navy group-hover:text-brand">
                    Muhammad Hamza
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pre-Engineering</p>
                  <span className="text-[10px] font-bold text-brand bg-brand-50 px-1.5 py-0.2 rounded mt-1.5 inline-block">
                    82.5% Predicted
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithPersona('aisha')}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/40 transition-all cursor-pointer shadow-2xs group"
                >
                  <p className="text-xs font-bold text-navy group-hover:text-brand">
                    Aisha Fatima
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Computer Science</p>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded mt-1.5 inline-block">
                    86.8% Predicted
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithPersona('bilal')}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/40 transition-all cursor-pointer shadow-2xs group"
                >
                  <p className="text-xs font-bold text-navy group-hover:text-brand">
                    Bilal Tariq
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pre-Medical</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1.5 inline-block">
                    89.2% Predicted
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/" className="text-xs text-muted hover:text-navy hover:underline">
                ← Return to UniRaah Public Homepage
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Global Interactive Auth Modal */}
      <AuthModal />

      {/* Unified Institutional Footer */}
      <PublicFooter />
    </div>
  )
}
