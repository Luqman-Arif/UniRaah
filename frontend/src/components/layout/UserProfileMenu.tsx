import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { cn } from '@/lib/utils'
import {
  LogOut,
  ChevronDown,
  User,
  TrendingUp,
  Edit3,
  ArrowRight,
  Settings,
  LayoutDashboard,
  Globe,
} from 'lucide-react'

export const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth()
  const { profile } = useStudentProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/student')

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!user) return null

  // Get user initials
  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST'

  const firstName = user.fullName.split(' ')[0]

  const handleSignOut = () => {
    setIsOpen(false)
    logout()
    navigate('/')
  }

  const handleOpenEditModal = () => {
    setIsOpen(false)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <div className="relative inline-block text-left" ref={menuRef}>
        {/* Profile Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'flex items-center gap-2 rounded-xl p-1.5 transition-all cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand',
            isOpen
              ? 'bg-slate-100 ring-2 ring-brand-500/30'
              : 'hover:bg-slate-100/80 active:scale-[0.98]'
          )}
          aria-label="User account menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Avatar with gradient background & online indicator */}
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand to-indigo-600 text-white font-bold text-xs shadow-xs ring-1 ring-white">
              {initials}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Online session active"
            />
          </div>

          {/* User preview label */}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-navy leading-none truncate max-w-[110px]">
              {firstName}
            </span>
            <span className="text-[10px] text-muted font-medium mt-0.5 leading-none">
              {profile.hscTotalPredictedPercentage || user.hscTotalPredictedPercentage}% Agg.
            </span>
          </div>

          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ml-0.5',
              isOpen && 'rotate-180 text-brand'
            )}
          />
        </button>

        {/* Profile Dropdown Panel */}
        {isOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl transition-all animate-in fade-in-50 zoom-in-95 ring-1 ring-black/5"
          >
            {/* Top User Card with Quick Edit Trigger */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-brand-50/70 via-slate-50 to-white border border-brand-100 mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-600 text-white font-bold text-sm shadow-xs">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-navy truncate">
                      {user.fullName}
                    </h4>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Academic Tags & Quick Edit Button */}
              <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-brand-100/80 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                    {user.hscGroup}
                  </span>
                  <span className="font-bold text-brand bg-white px-1.5 py-0.5 rounded border border-brand-200/70 shadow-2xs flex items-center gap-1 text-[10px]">
                    <TrendingUp className="h-3 w-3 text-brand" />
                    {profile.hscTotalPredictedPercentage || user.hscTotalPredictedPercentage}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-800 bg-white hover:bg-brand-50 px-2 py-1 rounded-lg border border-brand-200/80 shadow-2xs transition-all cursor-pointer"
                  title="Update your student profile"
                >
                  <Edit3 className="h-3 w-3 text-brand" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Clean Professional Navigation Items */}
            <div className="space-y-0.5" role="none">
              {/* 1. Dashboard Overview or Public Homepage */}
              {isDashboard ? (
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-navy transition-colors group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-brand">
                        Public Website
                      </span>
                      <p className="text-[10px] text-slate-500">Return to UniRaah homepage</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand transition-colors" />
                </Link>
              ) : (
                <Link
                  to="/student"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-navy transition-colors group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-brand">
                        Dashboard Cockpit
                      </span>
                      <p className="text-[10px] text-slate-500">Overview, metrics & shortlists</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand transition-colors" />
                </Link>
              )}

              {/* 2. My Profile & Credentials */}
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-navy transition-colors group cursor-pointer text-left"
                role="menuitem"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-brand">
                      My Profile & Marks
                    </span>
                    <p className="text-[10px] text-slate-500">Edit board, marks & personal details</p>
                  </div>
                </div>
                <Edit3 className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand transition-colors" />
              </button>

              {/* 3. Account Settings */}
              <Link
                to="/student/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-navy transition-colors group"
                role="menuitem"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-brand">
                      Account Settings
                    </span>
                    <p className="text-[10px] text-slate-500">Preferences, password & security</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand transition-colors" />
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="pt-1.5 mt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer select-none"
                role="menuitem"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal Triggered from Header or Menu Item */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  )
}
