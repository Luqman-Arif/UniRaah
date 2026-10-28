import React from 'react'
import { NavLink } from 'react-router-dom'
import { useRole } from '@/hooks/useRole'
import {
  Compass,
  UserCheck,
  TrendingUp,
  BotMessageSquare,
  Building2,
  BookOpen,
  FileText,
  BarChart2,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  badge?: string
  highlight?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { role } = useRole()

  const studentNavItems: NavItem[] = [
    {
      to: '/student/recommendations',
      label: 'Recommendations',
      icon: <Compass className="h-4 w-4" />,
      badge: 'Live',
    },
    {
      to: '/student/profile',
      label: 'Academic Profile',
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      to: '/student/predictions',
      label: 'Admission Cutoffs',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      to: '/student/advisor',
      label: 'AI Admission Advisor',
      icon: <BotMessageSquare className="h-4 w-4" />,
      highlight: true,
    },
  ]

  const adminNavItems: NavItem[] = [
    {
      to: '/admin',
      label: 'Dashboard Overview',
      icon: <BarChart2 className="h-4 w-4" />,
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
      label: 'Admission Cutoffs',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      to: '/admin/documents',
      label: 'Official Documents',
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const navItems = role === 'student' ? studentNavItems : adminNavItems

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white px-3 py-4 border-r border-slate-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 md:hidden">
          <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {role === 'student' ? 'Student Portal' : 'Admin Portal'}
          </span>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {role === 'student' ? 'Student Workspace' : 'Administration'}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'text-slate-400 group-hover:text-slate-700',
                      item.highlight && 'text-brand-600'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-brand-700 font-bold text-[11px]">
            HSC
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-800">Karachi Admissions</p>
            <p className="text-[11px] text-slate-500">Academic Year 2025–26</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
          Cutoff projections are calibrated against BIEK and Federal Board score trends.
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-50 flex w-full max-w-xs flex-1 flex-col bg-white">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
