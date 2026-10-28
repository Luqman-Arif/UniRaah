import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Award,
  BookOpen,
  MapPin,
  TrendingUp,
  Sliders,
  Sparkles,
  Edit3,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EditProfileModal } from '@/components/profile/EditProfileModal'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const { profile } = useStudentProfile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const activeName = user?.fullName || profile.fullName || 'Student'
  const activeEmail = user?.email || profile.email || 'student@example.com'
  const activeBoard = user?.board || profile.board || 'Board of Intermediate Education Karachi (BIEK)'
  const activeGroup = user?.hscGroup || profile.hscGroup || 'Pre-Engineering'
  const activeAggregate = user?.hscTotalPredictedPercentage || profile.hscTotalPredictedPercentage || 82.5

  const initials = activeName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header Hero Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-50/50 pointer-events-none blur-2xl" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-700 via-brand to-indigo-600 text-white font-extrabold text-2xl shadow-md ring-4 ring-white">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
                  {activeName}
                </h1>
                <Badge variant="outline" className="text-xs text-emerald-700 bg-emerald-50 border-emerald-200">
                  Active Student
                </Badge>
              </div>

              <p className="text-sm text-slate-500 font-medium">{activeEmail}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {activeGroup}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 truncate max-w-xs">{activeBoard}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs px-5 cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            <span>Update Profile</span>
          </Button>
        </div>
      </div>

      {/* Grid of Key Academic & Admission Credentials */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Predicted Aggregate</span>
              <TrendingUp className="h-4 w-4 text-brand-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-brand-900">{activeAggregate}%</p>
            <p className="text-[11px] text-slate-500 mt-1">Closing merit benchmark</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">HSC Part-1 Result</span>
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{profile.hscPart1Percentage}%</p>
            <p className="text-[11px] text-slate-500 mt-1">First year college score</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">SSC Matric Record</span>
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{profile.sscPercentage}%</p>
            <p className="text-[11px] text-slate-500 mt-1">Secondary school certificate</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Transit Corridor</span>
              <MapPin className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {profile.preferences?.homeLocation || 'Gulshan-e-Iqbal'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Karachi residential anchor</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Subject Marks & Preferences */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subject Marks Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Intermediate Subject Marks (Out of 100)
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs text-brand font-semibold hover:bg-brand-50 cursor-pointer"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">Mathematics</span>
              <strong className="text-slate-900 font-bold">
                {profile.subjectMarks?.mathematics !== undefined ? `${profile.subjectMarks.mathematics} / 100` : 'Not Specified'}
              </strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">Physics</span>
              <strong className="text-slate-900 font-bold">
                {profile.subjectMarks?.physics !== undefined ? `${profile.subjectMarks.physics} / 100` : 'Not Specified'}
              </strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">Chemistry</span>
              <strong className="text-slate-900 font-bold">
                {profile.subjectMarks?.chemistry !== undefined ? `${profile.subjectMarks.chemistry} / 100` : 'Not Specified'}
              </strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">Computer Science</span>
              <strong className="text-slate-900 font-bold">
                {profile.subjectMarks?.computerScience !== undefined ? `${profile.subjectMarks.computerScience} / 100` : '—'}
              </strong>
            </div>

            <div className="flex items-center justify-between py-1.5 text-xs">
              <span className="font-semibold text-slate-700">Biology</span>
              <strong className="text-slate-900 font-bold">
                {profile.subjectMarks?.biology !== undefined ? `${profile.subjectMarks.biology} / 100` : '—'}
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* Financial & Priority Calibration */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Budget & Recommendation Priorities
              </CardTitle>
            </div>
            <Link to="/discover/preferences">
              <Button variant="ghost" size="sm" className="text-xs text-brand font-semibold hover:bg-brand-50 cursor-pointer">
                Tune
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Annual Fee Ceiling:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                PKR {profile.preferences?.maxAnnualBudgetPKR?.toLocaleString()} / {profile.preferences?.budgetPeriod || 'annual'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Selected Disciplines:</span>
              <span className="font-bold text-brand truncate max-w-[200px]">
                {profile.preferences?.disciplines?.join(', ') || 'Computer Science & AI'}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Active Ranking Priorities</span>
                <span>
                  Merit ({profile.preferences?.priorities?.merit}%) • Fees ({profile.preferences?.priorities?.affordability}%) • Distance ({profile.preferences?.priorities?.distance}%)
                </span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="bg-brand transition-all"
                  style={{ width: `${profile.preferences?.priorities?.merit || 50}%` }}
                />
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${profile.preferences?.priorities?.affordability || 30}%` }}
                />
                <div
                  className="bg-amber-500 transition-all"
                  style={{ width: `${profile.preferences?.priorities?.distance || 20}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <Link to="/recommendations">
                <Button className="w-full gap-2 font-bold bg-brand hover:bg-brand-700 text-white cursor-pointer shadow-xs">
                  <Sparkles className="h-4 w-4" />
                  <span>View Ranked Recommendations</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal Component */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  )
}
