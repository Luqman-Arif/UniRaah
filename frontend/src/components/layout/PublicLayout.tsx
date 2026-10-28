import React from 'react'
import { Outlet } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'
import { PublicFooter } from '@/components/marketing/PublicFooter'
import { AuthModal } from '@/components/auth/AuthModal'

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-page text-navy flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Sticky Public Header */}
      <PublicNavbar />

      {/* Main Full-Width Content Viewport */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Dynamic Institutional Public Footer */}
      <PublicFooter />

      {/* Global Interactive Auth Modal */}
      <AuthModal />
    </div>
  )
}

