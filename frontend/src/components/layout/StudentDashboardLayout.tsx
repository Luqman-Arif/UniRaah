import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { UserProfileMenu } from '@/components/layout/UserProfileMenu'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  Bookmark,
  Building2,
  Scale,
  TrendingUp,
  BotMessageSquare,
  History,
  Settings,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Info,
  Edit3,
} from 'lucide-react'

export const StudentDashboardLayout: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const { profile } = useStudentProfile()
  const {
    savedProgrammeIds,
    savedUniversityIds,
    compareProgrammeIds,
    toasts,
    dismissToast,
  } = useStudentDashboard()

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false)
  }, [location.pathname])

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileDrawerOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Calculate profile completion percentage (0 - 100)
  const calculateProfileCompletion = () => {
    let score = 0
    if (profile.fullName && profile.email) score += 20
    if (profile.hscGroup && profile.board) score += 20
    if (profile.sscPercentage > 0 && profile.hscPart1Percentage > 0) score += 20
    if (
      profile.subjectMarks?.mathematics ||
      profile.subjectMarks?.physics ||
      profile.subjectMarks?.chemistry ||
      profile.subjectMarks?.biology ||
      profile.subjectMarks?.computerScience
    ) {
      score += 20
    }
    if (
      profile.preferences?.disciplines?.length > 0 &&
      profile.preferences?.maxAnnualBudgetPKR > 0 &&
      profile.preferences?.homeLocation
    ) {
      score += 20
    }
    return score
  }

  const completionPercentage = calculateProfileCompletion()

interface NavItem {
  to: string
  exact?: boolean
  label: string
  icon: React.ReactNode
  badge?: string
  badgeVariant?: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

  // Navigation Items
  const navGroups: NavGroup[] = [
    {
      group: 'Decision Cockpit',
      items: [
        {
          to: '/student',
          exact: true,
          label: 'Overview',
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          to: '/student/profile',
          label: 'My Academic Profile',
          icon: <UserCheck className="h-4 w-4" />,
        },
        {
          to: '/student/recommendations',
          label: 'My Recommendations',
          icon: <Compass className="h-4 w-4" />,
          badge: 'Live Match',
          badgeVariant: 'brand',
        },
      ],
    },
    {
      group: 'Shortlists & Analysis',
      items: [
        {
          to: '/student/saved-programmes',
          label: 'Saved Programmes',
          icon: <Bookmark className="h-4 w-4" />,
          badge: savedProgrammeIds.length > 0 ? String(savedProgrammeIds.length) : undefined,
          badgeVariant: 'neutral',
        },
        {
          to: '/student/saved-universities',
          label: 'Saved Universities',
          icon: <Building2 className="h-4 w-4" />,
          badge: savedUniversityIds.length > 0 ? String(savedUniversityIds.length) : undefined,
          badgeVariant: 'neutral',
        },
        {
          to: '/student/compare',
          label: 'Compare Programmes',
          icon: <Scale className="h-4 w-4" />,
          badge: compareProgrammeIds.length > 0 ? `${compareProgrammeIds.length}/4` : undefined,
          badgeVariant: 'emerald',
        },
      ],
    },
    {
      group: 'Intelligence & Discovery',
      items: [
        {
          to: '/student/predictions',
          label: 'Merit Predictions',
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          to: '/student/advisor',
          label: 'AI Admission Advisor',
          icon: <BotMessageSquare className="h-4 w-4" />,
          badge: 'Verified AI',
          badgeVariant: 'brand',
        },
        {
          to: '/student/history',
          label: 'Search History',
          icon: <History className="h-4 w-4" />,
        },
      ],
    },
    {
      group: 'Account',
      items: [
        {
          to: '/student/settings',
          label: 'Account Settings',
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
  ]

  // Get active page title for header
  const getPageTitle = () => {
    const p = location.pathname
    if (p === '/student' || p === '/student/overview') return 'Student Decision Cockpit'
    if (p === '/student/profile') return 'My Academic Credentials & Background'
    if (p === '/student/recommendations') return 'Personalized Degree Recommendations'
    if (p === '/student/saved-programmes') return 'Saved Degree Programmes'
    if (p === '/student/saved-universities') return 'Saved Karachi Universities'
    if (p === '/student/compare') return 'Side-by-Side Programme Comparison'
    if (p === '/student/predictions') return 'Multi-Year Cutoff Trends & Forecasts'
    if (p === '/student/advisor') return 'AI Admission Advisor'
    if (p === '/student/history') return 'Activity & Search History'
    if (p === '/student/settings') return 'Student Account Settings'
    if (p.includes('/student/programmes/')) return 'Degree Programme Details'
    return 'Student Dashboard'
  }

  // Sidebar navigation JSX reusable for desktop and mobile drawer
  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between overflow-y-auto p-4 select-none">
      <div className="space-y-6">
        {/* Brand & Portal Label */}
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-xs group-hover:bg-brand-700 transition-colors ring-2 ring-brand-100">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-navy">
                  Uni<span className="text-brand">Raah</span>
                </span>
                <span className="rounded bg-brand-50 text-brand-700 px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase border border-brand-200">
                  Student
                </span>
              </div>
              <p className="text-[10px] text-muted -mt-0.5 font-medium">Karachi Decision Support</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(false)}
            className="rounded-lg p-1.5 text-muted hover:bg-slate-100 md:hidden cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student Quick Profile Card with completion status */}
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/70 via-white to-slate-50 p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand to-indigo-600 text-white font-bold text-xs shadow-xs ring-2 ring-white">
              {user?.fullName
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('') || 'ST'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-navy truncate">
                {user?.fullName || profile.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-slate-500 truncate">
                  {user?.hscGroup || profile.hscGroup}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-brand">
                  {profile.hscTotalPredictedPercentage}% Agg.
                </span>
              </div>
            </div>
          </div>

          {/* Completion Progress Bar */}
          <div className="space-y-1.5 pt-1 border-t border-brand-100/60">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-600">Profile Readiness</span>
              <span className="font-bold text-brand-700">{completionPercentage}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-indigo-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {completionPercentage < 100 && (
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-brand hover:text-brand-800 transition-colors pt-0.5 cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>Complete missing credentials</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Group Links */}
        <nav className="space-y-5" aria-label="Student dashboard navigation">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="block px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all group cursor-pointer',
                        isActive
                          ? 'bg-brand text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-navy'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              'transition-colors',
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand'
                            )}
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[9px] font-bold leading-none',
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.badgeVariant === 'brand'
                                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                                : item.badgeVariant === 'emerald'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="pt-4 mt-6 border-t border-slate-200/80 space-y-2">
        {/* Quick Return to Public Website */}
        <Link
          to="/"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-navy transition-colors group"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand" />
            Public Website
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-page text-navy flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Toast Notification Container (Floating Top-Right) */}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-3 flex items-start gap-3',
              toast.type === 'success' && 'bg-white/95 border-emerald-200 text-slate-800',
              toast.type === 'warning' && 'bg-white/95 border-amber-200 text-slate-800',
              toast.type === 'error' && 'bg-white/95 border-rose-200 text-slate-800',
              toast.type === 'info' && 'bg-white/95 border-brand-200 text-slate-800'
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-navy">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Dashboard Layout Shell */}
      <div className="flex min-h-screen">
        {/* ========================================================= */}
        {/* DESKTOP PERSISTENT SIDEBAR                                */}
        {/* ========================================================= */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 z-30 bg-surface border-r border-border">
          {renderSidebarContent()}
        </aside>

        {/* ========================================================= */}
        {/* MOBILE SLIDE-OVER DRAWER                                  */}
        {/* ========================================================= */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-navy/60 backdrop-blur-xs transition-opacity animate-in fade-in-50"
              onClick={() => setIsMobileDrawerOpen(false)}
            />

            {/* Slide-out Panel */}
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-surface shadow-2xl transition-all animate-in slide-in-from-left duration-300">
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN APPLICATION VIEWPORT                                 */}
        {/* ========================================================= */}
        <div className="flex flex-1 flex-col md:pl-64 lg:pl-72 w-full min-w-0">
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 sm:px-6 lg:px-8 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="rounded-xl p-2 text-muted hover:bg-slate-100 md:hidden cursor-pointer"
                aria-label="Open sidebar navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-navy tracking-tight truncate max-w-[220px] sm:max-w-md">
                  {getPageTitle()}
                </h1>
                <p className="hidden sm:block text-[10px] text-muted -mt-0.5 font-medium">
                  Karachi Higher Secondary Admission Platform
                </p>
              </div>
            </div>

            {/* Right Action Icons & User Account */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Profile Edit Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="hidden sm:flex gap-1.5 text-xs font-semibold border-slate-200 hover:bg-brand-50 hover:text-brand hover:border-brand-300 text-slate-700 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-brand" />
                <span>Update Marks</span>
              </Button>

              {/* User Profile Menu */}
              <UserProfileMenu />
            </div>
          </header>

          {/* Content Area or Auth Gate */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            {isAuthenticated ? (
              <Outlet />
            ) : (
              /* Authentication Gate for Guests */
              <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in-50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand border border-brand-200 shadow-sm">
                  <Lock className="h-8 w-8 text-brand" />
                </div>

                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs text-brand-700 bg-brand-50 border-brand-200">
                    Student Authentication Required
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
                    Sign In to Access Your Decision Cockpit
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Personalized Karachi degree recommendations, multi-year cutoff forecasts, and saved shortlists are strictly calibrated to your academic marks.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={() => openAuthModal('signin', '/student')}
                    className="w-full sm:w-auto h-12 px-6 gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In to Student Account</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => openAuthModal('signup', '/student')}
                    className="w-full sm:w-auto h-12 px-6 gap-2 font-semibold border-slate-300 hover:bg-slate-50 text-navy cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-brand" />
                    <span>Create Student Account</span>
                  </Button>
                </div>


              </div>
            )}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      />
      <AuthModal />
    </div>
  )
}
