import React, { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRecommendations } from '@/hooks/useRecommendations'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { Programme } from '@/types/programme'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { RecommendationCard } from '@/features/recommendations/RecommendationCard'
import { ProgrammeDetailModal } from '@/features/programmes/ProgrammeDetailModal'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DiscoveryStepper } from '@/features/student/DiscoveryStepper'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { mockProgrammes } from '@/data/mock/programmes'
import { ProgrammeRecommendation } from '@/types/admission'
import {
  Compass,
  ShieldCheck,
  Target,
  TrendingUp,
  Sliders,
  RotateCcw,
  RefreshCw,
  Scale,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Filter,
  History,
  Edit3,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'

export const RecommendationsPage: React.FC = () => {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/student')
  const { profile, updateProfile } = useStudentProfile()
  const {
    compareProgrammeIds,
    savedProgrammeIds,
    recordHistory,
    showToast,
    sessions,
    activeSessionId,
    activeSession,
    loadSession,
    refreshRecommendationSession,
  } = useStudentDashboard()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Local state for interactive weight adjustments right on this page!
  const [livePriorities, setLivePriorities] = useState({
    merit: profile.preferences.priorities?.merit ?? 50,
    affordability: profile.preferences.priorities?.affordability ?? 30,
    distance: profile.preferences.priorities?.distance ?? 20,
  })

  const [isWeightPanelOpen, setIsWeightPanelOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use the live recommendations hook
  const { recommendations, isLoading, error } = useRecommendations({
    customPriorities: livePriorities,
  })

  // Reconstruct recommendations if viewing an archived session (Requirement D)
  const activeSessionRecommendations = useMemo<ProgrammeRecommendation[] | null>(() => {
    if (!activeSession) return null
    return activeSession.results
      .map((item) => {
        const prog = mockProgrammes.find((p) => p.id === item.programmeId)
        if (!prog) return null
        const rec: ProgrammeRecommendation = {
          programme: prog,
          matchCategory: item.matchCategory,
          recommendationScore: item.recommendationScore,
          scoreBreakdown: {
            meritScore: item.matchCategory === 'Safety' ? 95 : item.matchCategory === 'Target' ? 80 : 65,
            affordabilityScore: 85,
            distanceScore: item.distanceKm ? Math.max(20, Math.round(100 - item.distanceKm * 2)) : 50,
            explanation: `Score preserved from archived recommendation session (${item.matchCategory} match).`,
          },
          distanceKm: item.distanceKm,
          studentEstimatedAggregate: item.studentEstimatedAggregate,
          targetClosingCutoff: item.targetClosingCutoff,
          aggregateDelta: item.aggregateDelta,
          meetsMinimumEligibility: item.meetsMinimumEligibility,
          eligibilityNotes: item.eligibilityNotes,
        }
        return rec
      })
      .filter((r): r is ProgrammeRecommendation => r !== null)
  }, [activeSession])

  const displayedRecommendations = activeSessionRecommendations || recommendations

  const displayedCategorized = useMemo(() => {
    return {
      safety: displayedRecommendations.filter((r) => r.matchCategory === 'Safety'),
      target: displayedRecommendations.filter((r) => r.matchCategory === 'Target'),
      reach: displayedRecommendations.filter((r) => r.matchCategory === 'Reach'),
    }
  }, [displayedRecommendations])

  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedShift, setSelectedShift] = useState('all')
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'Safety' | 'Target' | 'Reach'>('all')
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'ineligible'>('all')

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return displayedRecommendations.filter((rec) => {
      // Eligibility status filter
      if (eligibilityFilter === 'eligible' && !rec.meetsMinimumEligibility) {
        return false
      }
      if (eligibilityFilter === 'ineligible' && rec.meetsMinimumEligibility) {
        return false
      }

      // Category Tab filter
      if (activeCategoryTab !== 'all' && rec.matchCategory !== activeCategoryTab) {
        return false
      }

      // Discipline filter
      if (
        selectedDiscipline !== 'all' &&
        rec.programme.discipline !== selectedDiscipline
      ) {
        return false
      }

      // Sector filter
      if (
        selectedSector !== 'all' &&
        rec.programme.universitySector !== selectedSector
      ) {
        return false
      }

      // Shift filter
      if (selectedShift !== 'all') {
        const hasShift = rec.programme.shifts.some(
          (s) => s.toLowerCase() === selectedShift.toLowerCase()
        )
        if (!hasShift) return false
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesName = rec.programme.name.toLowerCase().includes(query)
        const matchesUni =
          rec.programme.universityName.toLowerCase().includes(query) ||
          rec.programme.universityShortName.toLowerCase().includes(query)
        const matchesDiscipline = rec.programme.discipline.toLowerCase().includes(query)

        if (!matchesName && !matchesUni && !matchesDiscipline) {
          return false
        }
      }

      return true
    })
  }, [
    displayedRecommendations,
    eligibilityFilter,
    activeCategoryTab,
    selectedDiscipline,
    selectedSector,
    selectedShift,
    searchQuery,
  ])

  const categoryCounts = {
    all: displayedRecommendations.length,
    safety: displayedCategorized.safety.length,
    target: displayedCategorized.target.length,
    reach: displayedCategorized.reach.length,
    eligible: displayedRecommendations.filter((r) => r.meetsMinimumEligibility).length,
    ineligible: displayedRecommendations.filter((r) => !r.meetsMinimumEligibility).length,
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDiscipline('all')
    setSelectedSector('all')
    setSelectedShift('all')
    setActiveCategoryTab('all')
    setEligibilityFilter('all')
  }

  const handlePriorityChange = (key: 'merit' | 'affordability' | 'distance', value: number) => {
    const updated = { ...livePriorities, [key]: value }
    setLivePriorities(updated)
    updateProfile({
      preferences: {
        ...profile.preferences,
        priorities: updated,
      },
    })
  }

  const handleResetPriorities = () => {
    const defaultWeights = { merit: 50, affordability: 30, distance: 20 }
    setLivePriorities(defaultWeights)
    updateProfile({
      preferences: {
        ...profile.preferences,
        priorities: defaultWeights,
      },
    })
    showToast('Weights Reset', 'Priority weights restored to default 50/30/20 balance.', 'info')
  }

  const handleRefreshRecommendations = async () => {
    setIsRefreshing(true)
    await refreshRecommendationSession()
    setIsRefreshing(false)
  }

  const handleOpenDetails = (prog: Programme) => {
    setSelectedProgramme(prog)
    recordHistory({
      title: `${prog.name} — ${prog.universityShortName}`,
      subtitle: `Viewed programme criteria (${prog.degreeType})`,
      path: `/student/programmes/${prog.id}`,
      type: 'programme',
    })
  }

  // Handle Error State
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Ranked Programme Recommendations"
          description="Error loading recommendation results"
        />
        <ErrorState
          title="Unable to Calculate Recommendations"
          description="A network or calculation error occurred while retrieving programme data."
          onRetry={() => window.location.reload()}
          retryLabel="Retry"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. In Guided 3-Step Wizard mode (!isDashboard): Display the visual stepper */}
      {!isDashboard && <DiscoveryStepper currentStep={3} />}

      {/* 2. In Student Dashboard mode (isDashboard): Display a helpful contextual banner without onboarding stepper */}
      {isDashboard && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-brand-50/70 via-slate-50 to-white border border-brand-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-100 text-brand">
              <Compass className="h-4 w-4 text-brand-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy">
                Decision Cockpit: Live Match Recommendations
              </p>
              <p className="text-[11px] text-slate-500">
                Generated from your Intermediate profile and custom priorities. Want to re-run the 3-step explore wizard?
              </p>
            </div>
          </div>
          <Link to="/discover" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold border-brand-300 bg-white text-brand hover:bg-brand-50 cursor-pointer shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span>Re-run 3-Step Discovery Wizard</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Page Header with Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          {!isDashboard && (
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="default" className="text-xs bg-brand-50 text-brand-700 border-brand-200">
                Step 3 of 3: Ranked Recommendations
              </Badge>
              <span className="text-xs text-slate-400">• Karachi HSC 2025/26 Cycle</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
              Ranked Programme Recommendations
            </h2>
            {isDashboard && (
              <Badge variant="outline" className="text-xs font-bold text-brand bg-brand-50 border-brand-200">
                Karachi HSC 2025/26 Cycle
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized for <strong className="text-slate-800">{profile.fullName}</strong> ({profile.hscGroup} • {profile.board} •{' '}
            <span className="font-extrabold text-brand">{profile.hscTotalPredictedPercentage}% Target</span>)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isDashboard && (
            <Link to="/discover/preferences">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Step 2</span>
              </Button>
            </Link>
          )}

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5 text-xs font-bold bg-brand hover:bg-brand-700 text-white cursor-pointer shadow-2xs"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Review Profile & Recalculate</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshRecommendations}
            disabled={isRefreshing}
            className="gap-1.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-brand ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Results</span>
          </Button>

          <Link to="/student/saved-programmes">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-indigo-600" />
              <span>Saved Shortlist ({savedProgrammeIds.length})</span>
            </Button>
          </Link>

          {!isDashboard && (
            <Link to="/student/recommendations">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-bold border-brand-300 bg-brand-50 hover:bg-brand-100 text-brand-900 cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-brand" />
                <span>Open Dashboard</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Floating or Inline Comparison Readiness Banner */}
      {compareProgrammeIds.length >= 2 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in-50">
          <div className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-emerald-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">
                {compareProgrammeIds.length} Programmes Selected for Comparison
              </p>
              <p className="text-[11px] text-emerald-700">
                You can compare their eligibility rules, tuition fee schedules, and closing cutoffs side-by-side.
              </p>
            </div>
          </div>

          <Link to="/student/compare">
            <Button size="sm" className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer">
              <span>Open Side-by-Side Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Session History & Active Session Controller (Requirement D) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5">
          <History className="h-4 w-4 text-brand-600 shrink-0" />
          <span className="text-xs font-bold text-navy">Evaluation Session:</span>
          <select
            value={activeSessionId || 'live'}
            onChange={(e) => loadSession(e.target.value === 'live' ? null : e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 shadow-2xs focus:border-brand focus:ring-1 focus:ring-brand cursor-pointer max-w-xs sm:max-w-md truncate"
          >
            <option value="live">✨ Current Live Evaluation (Active Profile)</option>
            {sessions.map((sess) => {
              const dt = new Date(sess.createdAt)
              const dateStr = dt.toLocaleDateString([], { month: 'short', day: 'numeric' })
              const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              return (
                <option key={sess.id} value={sess.id}>
                  Session #{sess.id.slice(-6)}: {dateStr} at {timeStr} ({sess.profileSnapshot.hscGroup} • {sess.profileSnapshot.hscTotalPredictedPercentage}%)
                </option>
              )
            })}
          </select>
        </div>

        {activeSession && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadSession(null)}
            className="text-xs font-bold text-brand hover:bg-brand-50 cursor-pointer self-start sm:self-auto"
          >
            ← Back to Live Evaluation
          </Button>
        )}
      </div>

      {/* Archived Session Active Notice */}
      {activeSession && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 text-xs text-brand-900 flex flex-col sm:flex-row items-start justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-start gap-3">
            <Compass className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-navy">
                Viewing Archived Recommendation Session #{activeSession.id.slice(-6)}
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                Generated on <strong>{new Date(activeSession.createdAt).toLocaleDateString()}</strong> at{' '}
                {new Date(activeSession.createdAt).toLocaleTimeString()} with credentials:{' '}
                <span className="font-bold text-slate-800">{activeSession.profileSnapshot.hscGroup}</span> •{' '}
                <span className="font-bold text-brand">{activeSession.profileSnapshot.hscTotalPredictedPercentage}% Target Aggregate</span> •{' '}
                Weights: {activeSession.criteriaWeights.merit}% Merit / {activeSession.criteriaWeights.affordability}% Affordability / {activeSession.criteriaWeights.distance}% Distance.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => loadSession(null)}
            className="text-xs font-bold bg-brand hover:bg-brand-700 text-white shrink-0 cursor-pointer self-end sm:self-center"
          >
            Switch to Live
          </Button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Your Predicted Aggregate"
          value={`${profile.hscTotalPredictedPercentage}%`}
          subtitle="Based on HSC-1 & SSC record"
          icon={<TrendingUp className="h-4 w-4 text-brand-600" />}
        />
        <StatCard
          title="Safety Matches"
          value={categoryCounts.safety}
          subtitle="Safe margin above projected cutoff"
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
        />
        <StatCard
          title="Target Matches"
          value={categoryCounts.target}
          subtitle="Competitive threshold (~cutoff range)"
          icon={<Target className="h-4 w-4 text-amber-600" />}
        />
        <StatCard
          title="Reach Matches"
          value={categoryCounts.reach}
          subtitle="Aspirational or requires deficiency"
          icon={<Compass className="h-4 w-4 text-rose-600" />}
        />
      </div>

      {/* Active Student Context & Interactive Priority Weights Bar */}
      <Card className="border-brand-200/80 bg-gradient-to-r from-brand-50/40 via-white to-slate-50 shadow-2xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800">Active Ranking Weights:</span>
                <span className="text-xs text-brand font-semibold">
                  Merit ({livePriorities.merit}%) • Affordability ({livePriorities.affordability}%) • Distance ({livePriorities.distance}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Location: <strong>{profile.preferences.homeLocation || 'Unspecified'}</strong> • Budget:{' '}
                <strong>
                  PKR {profile.preferences.maxAnnualBudgetPKR?.toLocaleString()} /{' '}
                  {profile.preferences.budgetPeriod || 'annual'}
                </strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWeightPanelOpen((prev) => !prev)}
                className="gap-1.5 text-xs font-semibold border-brand-200 text-brand hover:bg-brand-50 cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5 text-brand" />
                {isWeightPanelOpen ? 'Hide Weight Controls' : 'Adjust Priority Weights'}
              </Button>

              <Link to="/discover/preferences">
                <Button variant="outline" size="sm" className="text-xs font-medium border-slate-200 text-slate-700 hover:text-navy hover:bg-slate-50">
                  Edit Preferences (Step 2)
                </Button>
              </Link>
            </div>
          </div>

          {/* Collapsible Dynamic Weight Adjuster */}
          {isWeightPanelOpen && (
            <div className="mt-4 pt-4 border-t border-brand-200/60 grid gap-4 sm:grid-cols-3 animate-in fade-in-50">
              {/* Merit Slider */}
              <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">Academic Merit</span>
                  <span className="font-extrabold text-brand">{livePriorities.merit}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={livePriorities.merit}
                  onChange={(e) => handlePriorityChange('merit', Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Higher weight prioritizes cutoff margin</span>
              </div>

              {/* Affordability Slider */}
              <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">Tuition Affordability</span>
                  <span className="font-extrabold text-emerald-700">{livePriorities.affordability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={livePriorities.affordability}
                  onChange={(e) => handlePriorityChange('affordability', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Favors programmes within stated budget</span>
              </div>

              {/* Distance Slider */}
              <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">Transit Proximity</span>
                  <span className="font-extrabold text-amber-700">{livePriorities.distance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={livePriorities.distance}
                  onChange={(e) => handlePriorityChange('distance', Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Favors campuses near your residential area</span>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetPriorities}
                  className="text-xs text-slate-500 hover:text-slate-800 gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restore Default Weights (50 / 30 / 20)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search Bar */}
      <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter Tier:
          </span>

          <button
            type="button"
            onClick={() => setActiveCategoryTab('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategoryTab === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All Degrees ({categoryCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab('Safety')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryTab === 'Safety'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Safety Matches ({categoryCounts.safety})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab('Target')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryTab === 'Target'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            Target Matches ({categoryCounts.target})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab('Reach')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryTab === 'Reach'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100/70'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Reach / Competitive ({categoryCounts.reach})
          </button>
        </div>

        {/* Academic Eligibility Filter Row */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Academic Eligibility:
          </span>

          <button
            type="button"
            onClick={() => setEligibilityFilter('all')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
              eligibilityFilter === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All Programmes ({categoryCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setEligibilityFilter('eligible')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              eligibilityFilter === 'eligible'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Academically Eligible ({categoryCounts.eligible})
          </button>

          <button
            type="button"
            onClick={() => setEligibilityFilter('ineligible')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              eligibilityFilter === 'ineligible'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100/70'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Ineligible / Deficiency Required ({categoryCounts.ineligible})
          </button>
        </div>

        {/* Input & Dropdowns Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div>
            <Input
              placeholder="Search degree, university or discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-xs"
            />
          </div>

          {/* Discipline */}
          <div>
            <Select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-white text-xs"
            >
              <option value="all">All Disciplines</option>
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Electrical & Mechanical Engineering">Electrical & Mechanical</option>
              <option value="Business Administration & Management">Business & Management</option>
              <option value="Medicine & Allied Health">Medicine & Health</option>
            </Select>
          </div>

          {/* Sector */}
          <div>
            <Select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-white text-xs"
            >
              <option value="all">All Sectors</option>
              <option value="Public">Public Sector Only</option>
              <option value="Private">Private Sector Only</option>
              <option value="Semi-Government">Semi-Government</option>
            </Select>
          </div>

          {/* Shift */}
          <div>
            <Select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="bg-white text-xs"
            >
              <option value="all">All Shifts</option>
              <option value="Morning">Morning (Open Merit)</option>
              <option value="Evening">Evening / Self-Finance</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Cards Content */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <EmptyState
          title="No degree programmes match your active filter criteria"
          description="Try resetting your filters or widening your budget ceiling to explore more Karachi degree options."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{filteredRecommendations.length}</strong> ranked programmes
            </span>
            <span className="text-[11px] text-slate-400">
              Ranked by composite Recommendation Score (Fit Index)
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.programme.id}
                recommendation={rec}
                rank={index + 1}
                onViewDetails={() => handleOpenDetails(rec.programme)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Decision-Support Advisory & Non-Guarantee Disclaimer Banner */}
      <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            Admissions Decision-Support Advisory & Non-Guarantee Notice
          </p>
          <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
            All recommendation fit indices, cutoff comparisons, and match tier categories (Safety, Target, Reach) are statistical decision-support estimations derived from multi-year syndicate gazette archives (2021–2024) and student-entered preferences. They do not constitute an official offer or guarantee of admission. Official closing merit is published exclusively by university admission boards.
          </p>
        </div>
      </div>

      {/* 3-Step Wizard Navigation Footer (Only on /recommendations) */}
      {!isDashboard && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link to="/discover/preferences" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="gap-2 w-full sm:w-auto cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Step 2: Preferences & Priorities</span>
              </Button>
            </Link>

            <Link to="/discover" className="w-full sm:w-auto">
              <Button type="button" variant="ghost" className="text-xs text-slate-600 hover:text-navy cursor-pointer w-full sm:w-auto">
                <span>Edit Step 1: Academic Scores</span>
              </Button>
            </Link>
          </div>

          <Link to="/student/recommendations" className="w-full sm:w-auto">
            <Button className="gap-2 font-bold w-full sm:w-auto px-6 shadow-sm bg-brand hover:bg-brand-700 text-white cursor-pointer">
              <LayoutDashboard className="h-4 w-4" />
              <span>Continue to Student Dashboard Cockpit</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Detail Modal (quick preview fallback) */}
      <ProgrammeDetailModal
        programme={selectedProgramme}
        isOpen={!!selectedProgramme}
        onClose={() => setSelectedProgramme(null)}
      />

      {/* Edit Profile Modal for Reviewing Credentials before Recalculating */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}
