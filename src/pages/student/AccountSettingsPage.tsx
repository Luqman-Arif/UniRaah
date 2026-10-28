import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import {
  Settings,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Bell,
  Sliders,
  Database,
  Edit3,
} from 'lucide-react'

export const AccountSettingsPage: React.FC = () => {
  const { user, loginWithPersona, logout } = useAuth()
  const { profile, updateProfile, resetProfile } = useStudentProfile()
  const {
    clearAllSavedProgrammes,
    clearAllSavedUniversities,
    clearCompare,
    clearHistory,
    showToast,
  } = useStudentDashboard()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [notifyDeadlines, setNotifyDeadlines] = useState(true)
  const [notifyCutoffs, setNotifyCutoffs] = useState(true)
  const [budgetPeriod, setBudgetPeriod] = useState(profile.preferences.budgetPeriod || 'annual')

  const navigate = useNavigate()

  const handlePersonaSwitch = (persona: 'hamza' | 'aisha' | 'bilal') => {
    loginWithPersona(persona)
    showToast('Persona Switched', `Active student account switched to ${persona.toUpperCase()}.`, 'success')
  }

  const handleBudgetPeriodChange = (val: 'annual' | 'semester') => {
    setBudgetPeriod(val)
    updateProfile({
      preferences: {
        ...profile.preferences,
        budgetPeriod: val,
      },
    })
    showToast('Display Preference Updated', `Tuition display set to ${val} view.`, 'info')
  }

  const handleResetAllData = () => {
    if (confirm('Reset all demo state back to standard Karachi intermediate profile?')) {
      resetProfile()
      clearAllSavedProgrammes()
      clearAllSavedUniversities()
      clearCompare()
      clearHistory()
      showToast('Session Reset', 'All local preferences and shortlists reset to factory state.', 'info')
    }
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-brand" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
            Account & Decision Settings
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your student persona, display preferences, alert notifications, and local session data.
        </p>
      </div>

      {/* 1. Active Persona & Profile Card */}
      <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-extrabold text-navy">
                Active Student Persona
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Switch instantly between pre-calibrated Karachi student profiles to test different admission scenarios.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-1.5 text-xs font-semibold self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-brand" />
              <span>Edit Credentials</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Hamza Persona */}
            <button
              type="button"
              onClick={() => handlePersonaSwitch('hamza')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                user?.email.includes('hamza')
                  ? 'border-brand bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-navy">Muhammad Hamza</span>
                {user?.email.includes('hamza') && (
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Pre-Engineering • BIEK</p>
              <p className="text-xs font-black text-brand mt-2">82.5% Target</p>
            </button>

            {/* Aisha Persona */}
            <button
              type="button"
              onClick={() => handlePersonaSwitch('aisha')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                user?.email.includes('aisha')
                  ? 'border-brand bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-navy">Aisha Fatima</span>
                {user?.email.includes('aisha') && (
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Computer Science • FBISE</p>
              <p className="text-xs font-black text-brand mt-2">86.8% Target</p>
            </button>

            {/* Bilal Persona */}
            <button
              type="button"
              onClick={() => handlePersonaSwitch('bilal')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                user?.email.includes('bilal')
                  ? 'border-brand bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-navy">Bilal Tariq</span>
                {user?.email.includes('bilal') && (
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Pre-Medical • BIEK</p>
              <p className="text-xs font-black text-brand mt-2">89.2% Target</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Display & Calculation Preferences */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-brand" />
            <CardTitle className="text-sm font-extrabold text-navy">
              Display & Calculation Preferences
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Configure how tuition fee comparisons and recommendation weights are displayed.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Tuition Period
              </label>
              <Select
                value={budgetPeriod}
                onChange={(e) => handleBudgetPeriodChange(e.target.value as 'annual' | 'semester')}
                className="text-xs"
              >
                <option value="annual">Annual Tuition Fee (PKR/Year)</option>
                <option value="semester">Semester Tuition Fee (PKR/Semester)</option>
              </Select>
              <p className="text-[10px] text-slate-400 mt-1">
                Affects fee calculations in recommendations and comparison matrix.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Transit Distance Metric
              </label>
              <Select defaultValue="km" disabled className="text-xs bg-slate-50">
                <option value="km">Kilometres (~Transit Matrix)</option>
              </Select>
              <p className="text-[10px] text-slate-400 mt-1">
                Transit distance calculated from {profile.preferences.homeLocation}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Alerts & Notification Toggles */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand" />
            <CardTitle className="text-sm font-extrabold text-navy">
              Admission Cycle Notifications (Simulation)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Simulate proactive browser notifications for Karachi university deadlines and official gazettes.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={notifyDeadlines}
              onChange={(e) => setNotifyDeadlines(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <div>
              <p className="text-xs font-bold text-navy">Admission Deadline Reminders</p>
              <p className="text-[11px] text-slate-500">
                Receive reminders 7 days before university entry test registration closes.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={notifyCutoffs}
              onChange={(e) => setNotifyCutoffs(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <div>
              <p className="text-xs font-bold text-navy">Merit List & Gazette Updates</p>
              <p className="text-[11px] text-slate-500">
                Alerts when universities publish official closing aggregate gazettes.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* 4. Session & Local Storage Data Management */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-slate-600" />
            <CardTitle className="text-sm font-extrabold text-navy">
              Local Session & Storage Management
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            UniRaah runs client-side with safe local browser storage. You can purge or reset your session at any time.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
            <div>
              <p className="text-xs font-bold text-navy">Reset Factory Demo State</p>
              <p className="text-[11px] text-slate-500">
                Resets academic credentials, removes all shortlisted programmes, and clears activity logs.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAllData}
              className="text-xs gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All State</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
            <div>
              <p className="text-xs font-bold text-navy">Sign Out of Student Account</p>
              <p className="text-[11px] text-slate-500">
                End the active session and return to the public homepage.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-xs gap-1.5 text-slate-700 hover:bg-slate-100 border-slate-300 cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  )
}
