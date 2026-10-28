import React, { useEffect } from 'react'
import { useRole } from '@/hooks/useRole'
import { User, ShieldCheck, ArrowRightLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useRole()
  const navigate = useNavigate()
  const location = useLocation()

  // Sync role with active route shell
  useEffect(() => {
    if (location.pathname.startsWith('/admin') && role !== 'admin') {
      setRole('admin')
    } else if (!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/auth') && role !== 'student') {
      setRole('student')
    }
  }, [location.pathname, role, setRole])

  const handleRoleToggle = () => {
    const nextRole = role === 'student' ? 'admin' : 'student'
    setRole(nextRole)

    if (nextRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/student/recommendations')
    }
  }

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-page p-1">
      <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted">
        <span className="hidden sm:inline">Role:</span>
        <span className="font-semibold text-navy flex items-center gap-1">
          {role === 'student' ? (
            <>
              <User className="h-3.5 w-3.5 text-brand" />
              Student
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Admin
            </>
          )}
        </span>
      </div>

      <button
        type="button"
        onClick={handleRoleToggle}
        className="flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 text-xs font-semibold text-brand shadow-xs hover:bg-brand-50 transition-colors border border-border cursor-pointer select-none"
        title={`Switch to ${role === 'student' ? 'Administrator' : 'Student'} mode`}
        aria-label={`Switch to ${role === 'student' ? 'Administrator' : 'Student'} layout`}
      >
        <ArrowRightLeft className="h-3 w-3" />
        <span className="hidden xs:inline">Switch</span>
      </button>
    </div>
  )
}
