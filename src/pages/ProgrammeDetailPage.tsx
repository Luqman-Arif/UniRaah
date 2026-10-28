import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProgrammes } from '@/hooks/useProgrammes'
import { useCutoffs } from '@/hooks/useCutoffs'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { calculateKarachiDistanceKm } from '@/services/mock/distanceService'
import { formatPKR } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import {
  ArrowLeft,
  Building2,
  Clock,
  Coins,
  Users,
  Award,
  TrendingUp,
  MapPin,
  ExternalLink,
  BookOpen,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Bookmark,
  Scale,
} from 'lucide-react'

export const ProgrammeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { programmes, isLoading: isProgsLoading } = useProgrammes()
  const { cutoffs, isLoading: isCutoffsLoading } = useCutoffs()
  const { profile } = useStudentProfile()
  const {
    isProgrammeSaved,
    toggleSaveProgramme,
    isInCompare,
    toggleCompareProgramme,
    recordHistory,
  } = useStudentDashboard()

  const programme = programmes.find((p) => p.id === id)

  // Record viewed programme in activity history
  React.useEffect(() => {
    if (programme) {
      recordHistory({
        title: `${programme.name} — ${programme.universityShortName}`,
        subtitle: `${programme.degreeType} • ${programme.discipline}`,
        path: `/student/programmes/${programme.id}`,
        type: 'programme',
      })
    }
  }, [programme, recordHistory])

  if (isProgsLoading || isCutoffsLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  const cutoffData = cutoffs.find((c) => c.programmeId === id)

  if (!programme) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <EmptyState
          title="Degree Programme Not Found"
          description="The requested programme could not be located in the Karachi university catalog."
          actionLabel="Back to Recommendations"
          onAction={() => navigate('/recommendations')}
        />
      </div>
    )
  }

  const distanceKm = calculateKarachiDistanceKm(
    profile.preferences.homeLocation,
    programme.campusZone || 'University Road Corridor'
  )

  const isGroupEligible = programme.eligibleHSCGroups.includes(profile.hscGroup)
  const meetsMinPercentage = profile.hscPart1Percentage >= programme.minHscPercentage

  const isSaved = isProgrammeSaved(programme.id)
  const inCompare = isInCompare(programme.id)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/student/recommendations" className="hover:text-brand-600 transition-colors">
            Recommendations
          </Link>
          <span>/</span>
          <span className="text-slate-400">{programme.universityShortName}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate">{programme.name}</span>
        </div>

        <Link to="/student/recommendations">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Recommendations
          </Button>
        </Link>
      </div>

      {/* Programme Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-50">
                <Building2 className="h-3.5 w-3.5 text-slate-500 mr-1" />
                {programme.universityName} ({programme.universityShortName})
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Sector: {programme.universitySector}
              </Badge>
              <Badge variant="success" className="text-xs gap-1">
                <Award className="h-3 w-3" />
                {programme.accreditationBody}
              </Badge>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {programme.name}
            </h1>

            <p className="text-xs text-slate-500 font-medium sm:text-sm">
              {programme.degreeType} • {programme.discipline}
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 pt-1">
              {programme.overview}
            </p>
          </div>

          {/* Quick Hero Actions: Save & Compare */}
          <div className="flex items-center gap-2.5 shrink-0 self-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSaveProgramme(programme.id)}
              className={`gap-1.5 text-xs font-bold cursor-pointer ${
                isSaved ? 'border-brand-300 bg-brand-50 text-brand' : 'text-slate-700'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-brand text-brand' : ''}`} />
              <span>{isSaved ? 'Shortlisted' : 'Save Degree'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleCompareProgramme(programme.id)}
              className={`gap-1.5 text-xs font-bold cursor-pointer ${
                inCompare ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>{inCompare ? 'Comparing' : 'Compare'}</span>
            </Button>
          </div>
        </div>

          {/* Key Facts Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <Coins className="h-4 w-4 text-brand-600 mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Annual Tuition</p>
              <p className="text-base font-bold text-slate-900">{formatPKR(programme.annualTuitionFeePKR)}</p>
              <p className="text-[10px] text-slate-400">
                ~{formatPKR(programme.semesterTuitionFeePKR ?? Math.round(programme.annualTuitionFeePKR / 2))} / sem
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <Clock className="h-4 w-4 text-brand-600 mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
              <p className="text-base font-bold text-slate-900">{programme.durationYears} Years</p>
              <p className="text-[10px] text-slate-400">{programme.durationYears * 2} Semesters</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <Users className="h-4 w-4 text-brand-600 mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Seats</p>
              <p className="text-base font-bold text-slate-900">{programme.totalSeats}</p>
              <p className="text-[10px] text-slate-400">Open merit + quotas</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <MapPin className="h-4 w-4 text-brand-600 mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Campus Distance</p>
              <p className="text-base font-bold text-slate-900">
                {distanceKm !== null ? `~${distanceKm} km` : 'Unspecified'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile.preferences.homeLocation || 'Location not set'}
              </p>
            </div>
          </div>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Requirements */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Academic Eligibility Requirements
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Verified criteria according to official university admissions policy.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Allowed Intermediate Groups:</span>
                  <div className="text-right space-x-1">
                    {programme.eligibleHSCGroups.map((g) => (
                      <Badge
                        key={g}
                        variant={g === profile.hscGroup ? 'default' : 'outline'}
                        className="text-[11px]"
                      >
                        {g} {g === profile.hscGroup ? '✓ (Your Group)' : ''}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Minimum HSC Part-1 Threshold:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {programme.minHscPercentage}%
                    </span>
                    <span className="text-[11px] text-slate-500">
                      (Your score: {profile.hscPart1Percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <span className="text-slate-500">Your Eligibility Status:</span>
                  <div>
                    {isGroupEligible && meetsMinPercentage ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Eligible for Consideration
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Prerequisites Not Met
                      </span>
                    )}
                  </div>
                </div>

                {profile.hscGroup === 'Pre-Medical' && programme.discipline.includes('Computer Science') && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      HEC Pre-Medical Mathematics Deficiency Rule:
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      Under HEC Notification No. 15-54/A&R/2023, Pre-Medical intermediate graduates are eligible for computing admissions but are required to pass 6 credit hours of deficiency mathematics courses during their first academic year.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Entry Test Formula & Weightage Breakdown */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Entry Test Requirements & Aggregate Formula
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Formula used by admissions committee to determine overall merit rank.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Official Test Name:</span>
                  <span className="font-bold text-slate-900">{programme.testWeightage.testName}</span>
                </div>

                {/* Formula Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-brand-700">
                      Entry Test: {programme.testWeightage.entryTestPercentage}%
                    </span>
                    <span className="text-indigo-700">
                      HSC Part-1: {programme.testWeightage.hscPercentage}%
                    </span>
                    {programme.testWeightage.sscPercentage ? (
                      <span className="text-slate-600">
                        SSC Matric: {programme.testWeightage.sscPercentage}%
                      </span>
                    ) : null}
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${programme.testWeightage.entryTestPercentage}%` }}
                      className="bg-brand-600"
                    />
                    <div
                      style={{ width: `${programme.testWeightage.hscPercentage}%` }}
                      className="bg-indigo-500"
                    />
                    {programme.testWeightage.sscPercentage ? (
                      <div
                        style={{ width: `${programme.testWeightage.sscPercentage}%` }}
                        className="bg-slate-400"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Closing Cutoff Benchmarks */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-600" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Historical Closing Merit Cutoffs (2021–2024)
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border-emerald-200">
                  Historical Published Data
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Archived open merit closing aggregate scores from official university selection lists.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {cutoffData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {cutoffData.historicalCutoffs.map((item) => (
                      <div
                        key={item.year}
                        className="rounded-xl border border-slate-200 p-3 bg-white text-center shadow-2xs"
                      >
                        <p className="text-[11px] font-bold uppercase text-slate-400">
                          {item.year} Closing
                        </p>
                        <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                          {item.closingAggregate.toFixed(1)}%
                        </p>
                        {item.openMeritClosingRank && (
                          <p className="text-[10px] text-slate-400">
                            Rank #{item.openMeritClosingRank}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Historical baseline verified through {cutoffData.lastUpdatedYear} admissions archive.
                    </span>
                    <Link to={`/programmes/${programme.id}/prediction`}>
                      <Button variant="outline" size="sm" className="gap-1 text-xs font-semibold text-brand-700">
                        <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
                        View Trend Chart
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Historical closing cutoffs not published for this programme.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards (1 Col) */}
        <div className="space-y-6">
          {/* Predicted Cutoff Snapshot Card */}
          <Card className="border-brand-200 bg-gradient-to-br from-brand-50/50 via-white to-slate-50 shadow-xs">
            <CardHeader className="pb-3 border-b border-brand-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-brand-900">
                  2025 Projected Threshold
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-brand-700">
                Illustrative Statistical Estimate
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {cutoffData ? (
                <>
                  <div className="rounded-xl bg-white p-4 border border-brand-200 text-center space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Expected Closing Range (2025)
                    </p>
                    <p className="text-2xl font-black text-brand-700">
                      {cutoffData.predictedCutoffRange.min}% – {cutoffData.predictedCutoffRange.max}%
                    </p>
                    <p className="text-[11px] font-semibold text-slate-600">
                      Projected Baseline: {cutoffData.predictedCutoffRange.projectedAggregate}%
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-600 leading-relaxed bg-brand-50/40 p-3 rounded-lg border border-brand-100">
                    <p className="font-bold text-slate-800 mb-0.5">Statistical Disclaimer:</p>
                    {cutoffData.disclaimer}
                  </div>

                  <Link to={`/programmes/${programme.id}/prediction`} className="block">
                    <Button className="w-full gap-2 font-bold text-xs">
                      <TrendingUp className="h-4 w-4" />
                      Detailed Trend & Chart
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-xs text-slate-500">Projection model not available for this entry.</p>
              )}
            </CardContent>
          </Card>

          {/* Official Source References Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Official Source References
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Grounding citations and official publication records.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {programme.officialSources && programme.officialSources.length > 0 ? (
                programme.officialSources.map((source, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-50 p-3 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{source.title}</span>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:text-brand-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Type: {source.documentType}</p>
                    <p className="text-[11px] text-slate-600 italic">{source.citation}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Official references in verification review.</p>
              )}
            </CardContent>
          </Card>

          {/* Campus Location & Corridor Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Campus Corridor & Transit
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs">
              <p className="text-slate-700">
                Corridor: <strong>{programme.campusZone}</strong>
              </p>
              <p className="text-slate-500 leading-relaxed">
                {distanceKm !== null
                  ? `Estimated ${distanceKm} km daily commute from your selected area (${profile.preferences.homeLocation}).`
                  : 'Specify your neighborhood in Preferences to calculate direct transit mileage.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
