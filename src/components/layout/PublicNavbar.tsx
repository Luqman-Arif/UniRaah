import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, Menu, X, ArrowRight, Sparkles, LogOut, Compass, BotMessageSquare, UserCheck, Sliders, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserProfileMenu } from '@/components/layout/UserProfileMenu'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  isAnchor?: boolean
}

// Logically and professionally organized navigation items
const navItems: NavItem[] = [
  { label: 'Explore Programmes', href: '/discover', isAnchor: false },
  { label: 'AI Advisor', href: '/advisor', isAnchor: false },
  { label: 'How It Works', href: '#how-it-works', isAnchor: true },
  { label: 'Features', href: '#features', isAnchor: true },
  { label: 'About', href: '#about', isAnchor: true },
  { label: 'FAQ', href: '#faq', isAnchor: true },
]

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()

  // Track scroll and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      if (location.pathname === '/') {
        const sections = ['features', 'how-it-works', 'about', 'faq']
        const scrollPosition = window.scrollY + 120

        let current = ''
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId)
          if (el) {
            const top = el.offsetTop
            const height = el.offsetHeight
            if (scrollPosition >= top && scrollPosition < top + height) {
              current = `#${sectionId}`
              break
            }
          }
        }
        setActiveSection(current)
      } else {
        setActiveSection(location.pathname)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  // Handle cross-page anchor scrolling (e.g. from /recommendations back to /#how-it-works)
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.replace('#', '')
      const attemptScroll = () => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
            block: 'start',
          })
          return true
        }
        return false
      }

      if (!attemptScroll()) {
        const t1 = setTimeout(attemptScroll, 100)
        const t2 = setTimeout(attemptScroll, 350)
        return () => {
          clearTimeout(t1)
          clearTimeout(t2)
        }
      }
    }
  }, [location.pathname, location.hash])

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Determine if a nav item is currently active
  const isItemActive = (item: NavItem): boolean => {
    if (item.isAnchor) {
      return location.pathname === '/' && activeSection === item.href
    }
    if (item.href === '/discover' || item.href === '/recommendations') {
      return (
        location.pathname.startsWith('/discover') ||
        location.pathname.startsWith('/recommendations') ||
        location.pathname.startsWith('/programmes')
      )
    }
    if (item.href === '/advisor') {
      return location.pathname.startsWith('/advisor')
    }
    return location.pathname === item.href
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (item.isAnchor) {
      e.preventDefault()
      setIsMobileMenuOpen(false)

      if (location.pathname !== '/') {
        navigate(`/${item.href}`)
        return
      }

      const targetId = item.href.replace('#', '')
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        })
      }
    } else {
      setIsMobileMenuOpen(false)

      // Guard discovery & recommendations features if guest
      if (!isAuthenticated) {
        if (item.href === '/discover' || item.href === '/recommendations') {
          e.preventDefault()
          openAuthModal(
            'signin',
            '/discover',
            'Please sign in or create an account to start your personalized Karachi university degree discovery.'
          )
        }
      }
    }
  }

  const handleMobileSignOut = () => {
    setIsMobileMenuOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled
          ? 'border-b border-border bg-white/95 backdrop-blur-md shadow-xs'
          : 'border-b border-slate-200/50 bg-white/80 backdrop-blur-xs'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand rounded-lg shrink-0"
            aria-label="UniRaah homepage"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-xs group-hover:bg-brand-700 transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-navy">
                  Uni<span className="text-brand">Raah</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded hidden sm:inline">
                  Karachi HSC
                </span>
              </div>
            </div>
          </Link>

          {/* Unified Center Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-1.5"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const active = isItemActive(item)
              if (item.isAnchor) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand',
                      active
                        ? 'text-brand font-bold bg-brand-50/80 shadow-2xs'
                        : 'text-slate-600 hover:text-navy hover:bg-slate-100/70'
                    )}
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand flex items-center gap-1.5',
                    active
                      ? 'text-brand font-bold bg-brand-50/90 shadow-2xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-100/70'
                  )}
                >
                  {item.href === '/advisor' && (
                    <BotMessageSquare className={cn('h-3.5 w-3.5', active ? 'text-brand' : 'text-slate-400')} />
                  )}
                  {(item.href === '/discover' || item.href === '/recommendations') && (
                    <Compass className={cn('h-3.5 w-3.5', active ? 'text-brand' : 'text-slate-400')} />
                  )}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Action Cluster (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {isAuthenticated && user ? (
              /* When Authenticated: Sleek Executive Profile Menu & Direct Dashboard Link */
              <div className="flex items-center gap-2">
                <Link to="/student">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-bold text-brand border-brand-200 bg-brand-50/70 hover:bg-brand-100/70 min-h-[36px] cursor-pointer"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <UserProfileMenu />
              </div>
            ) : (
              /* When Guest: Get Started */
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => openAuthModal('signup', '/discover')}
                  className="gap-1.5 text-xs font-bold shadow-xs hover:shadow-sm px-4 bg-brand hover:bg-brand-700 text-white min-h-[36px] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle & User Profile Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <UserProfileMenu />}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-navy transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-navy/30 backdrop-blur-2xs z-40 md:hidden animate-in fade-in-50"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="relative z-50 border-t border-border bg-white px-4 py-5 space-y-4 md:hidden shadow-modal animate-in slide-in-from-top-2"
        >
          {/* If Authenticated: Mobile User Profile Card */}
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-brand text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-xs text-navy">{user.fullName}</p>
                  <p className="text-[11px] text-slate-500">
                    {user.hscGroup} • {user.hscTotalPredictedPercentage}%
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleMobileSignOut}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1.5 rounded-lg hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <nav className="space-y-1" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const active = isItemActive(item)
              if (item.isAnchor) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors min-h-[44px]',
                      active
                        ? 'bg-brand-50 text-brand font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-navy'
                    )}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className={cn('h-4 w-4', active ? 'text-brand' : 'opacity-40')} />
                  </a>
                )
              }
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors min-h-[44px]',
                    active
                      ? 'bg-brand-50 text-brand font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-navy'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.href === '/advisor' && <BotMessageSquare className="h-4 w-4 text-brand" />}
                    {(item.href === '/discover' || item.href === '/recommendations') && <Compass className="h-4 w-4 text-brand" />}
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className={cn('h-4 w-4', active ? 'text-brand' : 'opacity-40')} />
                </Link>
              )
            })}

            {/* Authenticated Links in Mobile Drawer */}
            {isAuthenticated && (
              <>
                <Link
                  to="/student"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold text-brand bg-brand-50/70 hover:bg-brand-100/70 min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-brand" />
                    <span>Student Dashboard</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand" />
                </Link>

                <Link
                  to="/discover"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-brand" />
                    <span>Academic Information (Marks)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </Link>

                <Link
                  to="/discover/preferences"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-brand" />
                    <span>Preferences & Budget</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </Link>
              </>
            )}
          </nav>

          {/* Guest Actions in Mobile Drawer */}
          {!isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openAuthModal('signup', '/discover')
                }}
                className="w-full block cursor-pointer"
              >
                <Button className="w-full h-11 gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs">
                  <Sparkles className="h-4 w-4" />
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={handleMobileSignOut}
                className="w-full gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
