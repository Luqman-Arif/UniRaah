import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-xs">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-navy">
            Uni<span className="text-brand">Raah</span>
          </span>
        </Link>
        <p className="mt-2 text-xs text-muted">
          Higher Secondary University Admission Decision Support
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-subtle">
          <Outlet />
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Karachi HSC Admission Desk • BIEK & Federal Board Integrated
        </p>
      </div>
    </div>
  )
}
