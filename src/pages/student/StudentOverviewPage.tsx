import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useRecommendations } from '@/hooks/useRecommendations'
import { useProgrammes } from '@/hooks/useProgrammes'
import { mockAdmissionDeadlines } from '@/data/mock/deadlines'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MatchBadge } from '@/components/shared/MatchBadge'
import { formatPKR } from '@/lib/utils'
import {
  Sparkles,
  Bookmark,
  Building2,
  Scale,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Edit3,
  BotMessageSquare,
  ChevronRight,
  History,
  RefreshCw,
  Info,
} from 'lucide-react'

export const StudentOverviewPage: React.FC = () => {
  const { user } = useAuth()
  const { profile } = useStudentProfile()
  const {
    savedProgrammeIds,
    savedUniversityIds,
    compareProgrammeIds,
    history,
    toggleSaveProgramme,
    isProgrammeSaved,
    toggleCompareProgramme,
    isInCompare,
    sessions,
    refreshRecommendationSession,
  } = useStudentDashboard()

  const { recommendations, categorized, isLoading: isRecsLoading } = useRecommendations()
  const { programmes } = useProgrammes()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isGeneratingFirstSession, setIsGeneratingFirstSession] = useState(false)
  const [isRecalculating, setIsRecalculating] = useState(false)

  const latestSession = sessions.length > 0 ? sessions[0] : null

  const handleGenerateFirstSession = async () => {
    setIsGeneratingFirstSession(true)
    await refreshRecommendationSession()
    setIsGeneratingFirstSession(false)
  }

  const handleRecalculateSession = async () => {
    setIsRecalculating(true)
    await refreshRecommendationSession()
    setIsRecalculating(false)
  }

  const firstName = (user?.fullName || profile.fullName).split(' ')[0] || 'Student'
  const predictedAggregate = profile.hscTotalPredictedPercentage || user?.hscTotalPredictedPercentage || 82.5

  // Calculate profile completion percentage
  const calculateProfileMetrics = () => {
    const checks = [
      { label: 'Basic Info & Email', done: Boolean(profile.fullName && profile.email) },
      { label: 'Board & HSC Intermediate Group', done: Boolean(profile.board && profile.hscGroup) },
      { label: 'SSC & HSC Part-1 Scores', done: profile.sscPercentage > 0 && profile.hscPart1Percentage > 0 },
      {
        label: 'Discipline Subject Marks',
        done: Boolean(
          profile.subjectMarks?.mathematics ||
            profile.subjectMarks?.physics ||
            profile.subjectMarks?.chemistry ||
            profile.subjectMarks?.computerScience ||
            profile.subjectMarks?.biology
        ),
      },
      {
        label: 'Budget & Area Preferences',
        done: Boolean(
          profile.preferences?.disciplines?.length > 0 &&
            profile.preferences?.maxAnnualBudgetPKR > 0 &&
            profile.preferences?.homeLocation
        ),
      },
    ]
    const completedCount = checks.filter((c) => c.done).length
    const percentage = Math.round((completedCount / checks.length) * 100)
    return { percentage, checks }
  }

  const { percentage: profileCompletion, checks: completionChecks } = calculateProfileMetrics()

  // Top 3 recommendations for quick highlight
  const topRecommendations = recommendations.slice(0, 3)

  // Saved programmes preview (up to 3)
  const savedProgrammesPreview = programmes.filter((p) => savedProgrammeIds.includes(p.id)).slice(0, 3)

  // Recently viewed programmes from history
  const recentlyViewed = history.filter((h) => h.type === 'programme').slice(0, 3)

  return (
    <div className="space-y-8 pb-12">
      {/* ========================================================= */}
      {/* 1. PERSONALIZED WELCOME BANNER                            */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        {/* Soft Indigo and Purple Ambient Lighting Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-50/70 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 right-1/3 -mb-12 h-48 w-48 rounded-full bg-violet-50/50 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/60 px-3 py-1 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                Karachi Admission Cycle 2025–26
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Welcome back, {firstName}!
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              Your profile is calibrated for{' '}
              <strong className="text-navy">{user?.hscGroup || profile.hscGroup}</strong> under{' '}
              <strong className="text-navy">{profile.board}</strong> with a target closing aggregate of{' '}
              <span className="font-extrabold text-brand bg-brand-50 px-2 py-0.5 rounded border border-brand-200/70">
                {predictedAggregate}%
              </span>
              . We found{' '}
              <strong className="text-slate-900">{recommendations.length} matching degree programmes</strong>{' '}
              across Karachi institutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs px-5 cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              <span>Update Credentials</span>
            </Button>

            <Link to="/student/recommendations">
              <Button
                variant="outline"
                className="gap-2 font-semibold border-slate-300 hover:bg-slate-50 text-navy cursor-pointer"
              >
                <Compass className="h-4 w-4 text-brand" />
                <span>View All Matches</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SUMMARY KPI STAT CARDS                                 */}
      {/* ========================================================= */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Recommendation Matches */}
        <Link to="/student/recommendations" className="block group">
          <Card className="border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Matching Degrees</span>
                <div className="h-8 w-8 rounded-xl bg-brand-50 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                  <Compass className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">{recommendations.length}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold">
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    {categorized.safety.length} Safety
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    {categorized.target.length} Target
                  </span>
                  <span className="text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                    {categorized.reach.length} Reach
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Saved Programmes */}
        <Link to="/student/saved-programmes" className="block group">
          <Card className="border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Saved Shortlist</span>
                <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Bookmark className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">{savedProgrammeIds.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">Shortlisted degree options</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Saved Universities */}
        <Link to="/student/saved-universities" className="block group">
          <Card className="border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Bookmarked Unis</span>
                <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">{savedUniversityIds.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">Monitored Karachi campuses</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 4: Programme Comparison */}
        <Link to="/student/compare" className="block group">
          <Card className="border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Side-by-Side Compare</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Scale className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">{compareProgrammeIds.length}/4</p>
                <p className="text-[11px] text-slate-500 mt-1">Ready for matrix comparison</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 3. PROFILE COMPLETION & READINESS CHECKLIST               */}
      {/* ========================================================= */}
      <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <CardTitle className="text-base font-extrabold text-navy">
                  Academic Profile Readiness
                </CardTitle>
                <span className="text-xs font-bold text-brand bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  {profileCompletion}% Complete
                </span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Complete all academic details to unlock highest precision in merit eligibility calculations.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-1.5 text-xs font-semibold self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-brand" />
              <span>Edit Details</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand via-indigo-600 to-emerald-500 transition-all duration-700"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-xs">
            {completionChecks.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                  item.done
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-xs">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {item.done ? 'Verified in profile' : 'Required for precision'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* 4. MAIN TWO-COLUMN CONTENT GRID                          */}
      {/* ========================================================= */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: Top Recommendations & Shortlist Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section A: Top Recommendation Matches / Latest Session */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-navy tracking-tight flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  {latestSession ? 'Latest Recommendation Run' : 'Academic Degree Recommendations'}
                </h2>
                <p className="text-xs text-slate-500">
                  Calibrated to your {predictedAggregate}% target aggregate ({profile.hscGroup} • {profile.board}).
                </p>
              </div>

              <div className="flex items-center gap-2">
                {latestSession && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRecalculateSession}
                    disabled={isRecalculating}
                    className="h-8 px-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 text-brand mr-1.5 ${isRecalculating ? 'animate-spin' : ''}`} />
                    <span>Recalculate</span>
                  </Button>
                )}

                <Link
                  to="/student/recommendations"
                  className="text-xs font-bold text-brand hover:text-brand-800 transition-colors flex items-center gap-1"
                >
                  View all ({latestSession ? latestSession.resultsCount : recommendations.length})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* If a session exists, render the session metadata snapshot banner */}
            {latestSession && (
              <div className="rounded-2xl border border-brand-200/90 bg-gradient-to-r from-brand-50/70 via-white to-slate-50 p-4 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-brand-100/80 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <History className="h-3.5 w-3.5 text-brand shrink-0" />
                    <span className="font-extrabold text-xs text-navy">
                      Session #{latestSession.id.slice(-6)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      • Run on{' '}
                      {new Date(latestSession.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(latestSession.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-brand bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                    {latestSession.resultsCount} Ranked Matches
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Faculty Group</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {latestSession.profileSnapshot.hscGroup}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Target Aggregate</span>
                    <span className="font-extrabold text-brand block">
                      {latestSession.profileSnapshot.hscTotalPredictedPercentage}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Weights Applied</span>
                    <span className="font-semibold text-slate-700 block truncate">
                      {latestSession.criteriaWeights.merit}%M • {latestSession.criteriaWeights.affordability}%A •{' '}
                      {latestSession.criteriaWeights.distance}%D
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Top Match</span>
                    <span className="font-semibold text-navy truncate block">
                      {latestSession.topRecommendationTitle || 'Top Fit'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isRecsLoading ? (
              <div className="space-y-3">
                <div className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                <div className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
              </div>
            ) : topRecommendations.length > 0 ? (
              <div className="space-y-3">
                {topRecommendations.map((rec) => {
                  const isSaved = isProgrammeSaved(rec.programme.id)
                  const inCompare = isInCompare(rec.programme.id)
                  const isEligible = rec.meetsMinimumEligibility

                  return (
                    <div
                      key={rec.programme.id}
                      className={`rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        isEligible
                          ? 'border-slate-200/90 bg-white hover:border-brand-300'
                          : 'border-rose-200/90 bg-rose-50/20 hover:border-rose-300'
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            {rec.programme.universityShortName}
                          </span>
                          <span className="text-slate-300">•</span>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-slate-600">
                            {rec.programme.universitySector}
                          </Badge>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 font-medium">{rec.programme.degreeType}</span>
                          {!isEligible && (
                            <>
                              <span className="text-slate-300">•</span>
                              <Badge
                                variant="destructive"
                                className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] py-0 px-1.5 font-bold"
                              >
                                Criteria Deficit
                              </Badge>
                            </>
                          )}
                        </div>

                        <Link
                          to={`/student/programmes/${rec.programme.id}`}
                          className="text-base font-extrabold text-navy hover:text-brand transition-colors block truncate"
                        >
                          {rec.programme.name}
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                          <span>
                            Fee: <strong className="text-slate-800">{formatPKR(rec.programme.annualTuitionFeePKR)}/yr</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Formula: <strong className="text-slate-800">{rec.programme.testWeightage.testName}</strong>
                          </span>
                          <span>•</span>
                          <span className="text-[11px]">
                            2024 Cutoff: <strong className="text-slate-700">{rec.targetClosingCutoff}%</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center sm:flex-col sm:items-end gap-2.5 shrink-0">
                        <MatchBadge category={rec.matchCategory} score={rec.recommendationScore} />

                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSaveProgramme(rec.programme.id)}
                            className={`h-8 px-2.5 text-xs gap-1 cursor-pointer ${
                              isSaved ? 'border-brand-300 bg-brand-50 text-brand' : 'text-slate-600'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Save programme'}
                          >
                            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-brand text-brand' : ''}`} />
                            <span className="hidden xs:inline">{isSaved ? 'Saved' : 'Save'}</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCompareProgramme(rec.programme.id)}
                            className={`h-8 px-2.5 text-xs gap-1 cursor-pointer ${
                              inCompare ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'text-slate-600'
                            }`}
                            title={inCompare ? 'In comparison' : 'Add to compare'}
                          >
                            <Scale className="h-3.5 w-3.5" />
                            <span className="hidden xs:inline">{inCompare ? 'Comparing' : 'Compare'}</span>
                          </Button>

                          <Link to={`/student/programmes/${rec.programme.id}`}>
                            <Button size="sm" className="h-8 px-3 text-xs gap-1 bg-navy hover:bg-slate-800 text-white cursor-pointer">
                              <span>Details</span>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* First-Time Student Experience: Actionable Pathway Generator */
              <div className="rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-brand-100 text-brand flex items-center justify-center mx-auto shadow-2xs">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-extrabold text-navy">
                    Generate Your First Recommendation Analysis
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    UniRaah will calibrate your {profile.hscGroup} credentials ({predictedAggregate}% target aggregate) against official published closing gazettes (2021–2024), tuition schedules, and transit zones across Karachi universities.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Button
                    onClick={handleGenerateFirstSession}
                    disabled={isGeneratingFirstSession}
                    className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs px-5 cursor-pointer text-xs"
                  >
                    <Sparkles className={`h-4 w-4 ${isGeneratingFirstSession ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingFirstSession ? 'Calculating Pathways...' : 'Run First Recommendation Analysis'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="gap-2 font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer text-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Verify Profile Data First</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Non-Guarantee Statistical Aid Disclaimer Banner */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p>
                <strong>Statistical Advisory Notice:</strong> All admission fit indices, match categories (Safety, Target, Reach), and cutoff predictions are statistical estimates calibrated against historical merit gazettes (2021–2024). They serve solely as an academic planning aid and do not constitute an admission guarantee.
              </p>
            </div>
          </div>

          {/* Section B: Saved Shortlist Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-navy tracking-tight flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-600" />
                  Saved Shortlist ({savedProgrammeIds.length})
                </h2>
                <p className="text-xs text-slate-500">Your quick-access shortlisted degree options.</p>
              </div>

              <Link
                to="/student/saved-programmes"
                className="text-xs font-bold text-brand hover:text-brand-800 transition-colors flex items-center gap-1"
              >
                View all saved
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {savedProgrammesPreview.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {savedProgrammesPreview.map((prog) => (
                  <div
                    key={prog.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 hover:border-brand-300 transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {prog.universityShortName}
                      </span>
                      <h4 className="text-sm font-extrabold text-navy line-clamp-1">{prog.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{formatPKR(prog.annualTuitionFeePKR)}/yr</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <Link
                        to={`/student/programmes/${prog.id}`}
                        className="text-xs font-bold text-brand hover:text-brand-800 flex items-center gap-0.5"
                      >
                        Details <ChevronRight className="h-3 w-3" />
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveProgramme(prog.id)}
                        className="h-7 text-[11px] text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from shortlist"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center space-y-2">
                <Bookmark className="h-6 w-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No programmes in your shortlist yet</p>
                <p className="text-[11px] text-slate-500">
                  Bookmark degree programmes from recommendations to quickly compare and track them here.
                </p>
                <Link to="/student/recommendations">
                  <Button variant="outline" size="sm" className="text-xs mt-1">
                    Explore Recommendations
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Deadlines & Recent Activity (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Verified Karachi Admission Deadlines */}
          <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-navy">
                    Upcoming Admission Deadlines
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] bg-white font-bold text-slate-600">
                  Verified Cycle
                </Badge>
              </div>
              <CardDescription className="text-[11px] text-slate-500 mt-1">
                Grounded in official Karachi university syndicate notifications.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-3">
              {mockAdmissionDeadlines.slice(0, 4).map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-navy truncate max-w-[170px]">
                      {deadline.universityShortName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        deadline.status === 'closing_soon'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {deadline.deadlineDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                    {deadline.programmeOrEvent}
                  </p>

                  <p className="text-[10px] text-slate-400 truncate" title={deadline.sourceCitation}>
                    Ref: {deadline.officialSource}
                  </p>
                </div>
              ))}

              <div className="pt-2 text-center">
                <p className="text-[10px] text-slate-400">
                  Dates reflect published university prospectuses. Always cross-verify with registrar gazettes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Admission Advisor Quick Widget */}
          <Card className="border-brand-200 bg-gradient-to-br from-brand-50/60 via-white to-slate-50 shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
                  <BotMessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy">AI Admission Advisor</h4>
                  <p className="text-[10px] text-brand-700 font-semibold">HEC & Prospectus Grounded</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Have questions regarding intermediate conversion, deficiency math courses, or NED aggregate formulas?
              </p>

              <Link to="/student/advisor" className="block">
                <Button size="sm" className="w-full gap-2 text-xs font-bold bg-brand hover:bg-brand-700 text-white cursor-pointer">
                  <span>Ask Admission Advisor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recently Viewed Programmes */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recently Explored
                  </CardTitle>
                </div>
                <Link to="/student/history" className="text-[11px] font-bold text-brand hover:underline">
                  Full Log
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5">
              {recentlyViewed.length > 0 ? (
                <div className="space-y-2.5">
                  {recentlyViewed.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <p className="text-xs font-bold text-navy group-hover:text-brand truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                        <span className="truncate max-w-[160px]">{item.subtitle}</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  <p>No recent activity logged yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  )
}
