import React from 'react'
import { GraduationCap, Menu } from 'lucide-react'
import { RoleSwitcher } from './RoleSwitcher'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useRole } from '@/hooks/useRole'
import { Link } from 'react-router-dom'

interface HeaderProps {
  onToggleMobileNav: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { profile } = useStudentProfile()
  const { role } = useRole()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs group-hover:bg-brand-700 transition-colors">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Uni<span className="text-brand-600">Raah</span>
              </span>
              <span className="rounded-sm bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 uppercase tracking-wider">
                Karachi
              </span>
            </div>
            <p className="hidden text-[10px] text-slate-400 sm:block -mt-0.5 font-medium">
              Higher Secondary Decision Support
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {role === 'student' && (
          <Link
            to="/student/profile"
            className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-900">{profile.fullName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{profile.hscGroup}</span>
            <span className="text-slate-400">•</span>
            <span className="font-medium text-brand-700">{profile.hscTotalPredictedPercentage}%</span>
          </Link>
        )}

        <RoleSwitcher />
      </div>
    </header>
  )
}
