import React, { useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { RoleSwitcher } from '@/components/shared/RoleSwitcher'
import {
  BarChart2,
  Building2,
  BookOpen,
  TrendingUp,
  FileText,
  ShieldCheck,
  Menu,
  X,
  GraduationCap,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const AdminLayout: React.FC = () => {
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)
  const location = useLocation()

  const adminNavItems = [
    {
      to: '/admin',
      label: 'Overview & Metrics',
      icon: <BarChart2 className="h-4 w-4" />,
      exact: true,
    },
    {
      to: '/admin/universities',
      label: 'University Directory',
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      to: '/admin/programmes',
      label: 'Programme Catalog',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      to: '/admin/cutoffs',
      label: 'Cutoffs & Calibration',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      to: '/admin/documents',
      label: 'Official Documents',
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Overview & System Health'
      case '/admin/universities':
        return 'University Directory'
      case '/admin/programmes':
        return 'Degree Programme Catalog'
      case '/admin/cutoffs':
        return 'Admission Cutoffs & Aggregate Calibration'
      case '/admin/documents':
        return 'Official Document & Gazette Archive'
      default:
        return 'Administration Console'
    }
  }

  const sidebarNavContent = (
    <div className="flex h-full flex-col justify-between bg-surface border-r border-border p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white shadow-xs">
              <ShieldCheck className="h-4 w-4 text-brand-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-navy">
                  Uni<span className="text-brand">Raah</span>
                </span>
                <span className="rounded bg-navy text-white px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-muted -mt-0.5">Control Center</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setIsSidebarOpenMobile(false)}
            className="rounded-lg p-1 text-muted hover:bg-slate-100 md:hidden"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section title */}
        <div>
          <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
            Admissions Infrastructure
          </p>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSidebarOpenMobile(false)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-muted hover:bg-slate-100 hover:text-navy'
                  )}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Quick Link to Student View */}
        <div className="pt-2 border-t border-border px-2">
          <Link
            to="/student/recommendations"
            className="flex items-center justify-between text-xs font-medium text-brand hover:text-brand-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              Open Student Portal
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Sidebar Footer with Role Switcher */}
      <div className="border-t border-border pt-4 px-2 space-y-3">
        <div className="rounded-lg bg-page p-2.5 text-[11px] text-muted space-y-1 border border-slate-200">
          <p className="font-semibold text-navy">Karachi District Desk</p>
          <p>Intermediate Admission Cycle 2025–2026</p>
        </div>
        <RoleSwitcher />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-page text-navy flex">
      {/* Persistent Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarNavContent}
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-navy/40 backdrop-blur-xs"
            onClick={() => setIsSidebarOpenMobile(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 flex w-full max-w-xs flex-1 flex-col bg-surface">
            {sidebarNavContent}
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Administrator Topbar */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpenMobile(true)}
              className="rounded-lg p-2 text-muted hover:bg-slate-100 md:hidden"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Administrator
              </span>
              <h2 className="text-sm sm:text-base font-bold text-navy leading-none">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-page px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="font-medium text-navy">Audit Log Live</span>
            </div>
            <RoleSwitcher />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
