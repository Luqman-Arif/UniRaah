import React from 'react'
import { Link } from 'react-router-dom'
import { ProgrammeRecommendation } from '@/types/admission'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { Card, CardContent } from '@/components/ui/card'
import { MatchBadge } from '@/components/shared/MatchBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPKR } from '@/lib/utils'
import {
  Building2,
  Coins,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Bookmark,
  Scale,
  Info,
} from 'lucide-react'

interface RecommendationCardProps {
  recommendation: ProgrammeRecommendation
  rank?: number
  onViewDetails?: () => void
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
  onViewDetails,
}) => {
  const {
    programme,
    matchCategory,
    recommendationScore,
    scoreBreakdown,
    distanceKm,
    studentEstimatedAggregate,
    targetClosingCutoff,
    aggregateDelta,
    meetsMinimumEligibility,
    eligibilityNotes,
  } = recommendation

  const {
    isProgrammeSaved,
    toggleSaveProgramme,
    isInCompare,
    toggleCompareProgramme,
  } = useStudentDashboard()

  const isSaved = isProgrammeSaved(programme.id)
  const inCompare = isInCompare(programme.id)
  const isPositiveDelta = aggregateDelta >= 0
  const isEligible = meetsMinimumEligibility

  return (
    <Card
      className={`group relative overflow-hidden transition-all hover:shadow-md flex flex-col justify-between ${
        isEligible
          ? 'bg-white border-slate-200/90 hover:border-brand-300'
          : 'bg-rose-50/20 border-rose-200/90 hover:border-rose-300'
      }`}
    >
      <CardContent className="p-5 space-y-4">
        {/* Header: University, Sector & Match Badge */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {rank !== undefined && (
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-extrabold text-white">
                  #{rank}
                </span>
              )}
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {programme.universityShortName}
              </span>
              <span className="text-slate-300">•</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-slate-600">
                {programme.universitySector}
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 font-medium">{programme.degreeType}</span>
            </div>

            {onViewDetails ? (
              <button
                type="button"
                onClick={onViewDetails}
                className="block text-left group-hover:text-brand transition-colors cursor-pointer"
              >
                <h3 className="text-base font-extrabold text-navy leading-snug">
                  {programme.name}
                </h3>
              </button>
            ) : (
              <Link
                to={`/student/programmes/${programme.id}`}
                className="block group-hover:text-brand transition-colors"
              >
                <h3 className="text-base font-extrabold text-navy leading-snug">
                  {programme.name}
                </h3>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start">
            {isEligible ? (
              <MatchBadge category={matchCategory} score={recommendationScore} />
            ) : (
              <Badge
                variant="destructive"
                className="bg-rose-100 text-rose-800 border-rose-300 font-extrabold text-[10px] py-1 px-2 flex items-center gap-1 shadow-2xs"
              >
                <AlertCircle className="h-3 w-3 text-rose-600" />
                <span>Not Academically Eligible</span>
              </Badge>
            )}

            {/* Quick Bookmark Toggle Button */}
            <button
              type="button"
              onClick={() => toggleSaveProgramme(programme.id)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isSaved
                  ? 'border-brand-300 bg-brand-50 text-brand shadow-2xs'
                  : 'border-slate-200 text-slate-400 hover:text-brand hover:border-brand-300 bg-white'
              }`}
              title={isSaved ? 'Remove from saved shortlist' : 'Save programme to shortlist'}
              aria-label={isSaved ? 'Remove from saved shortlist' : 'Save programme'}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-brand text-brand' : ''}`} />
            </button>
          </div>
        </div>

        {/* Academic Eligibility Status Banner */}
        <div
          className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
            isEligible
              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
              : 'bg-rose-50/90 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-xs">
              {isEligible ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Academic Eligibility: Confirmed</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>Academic Eligibility: Criteria Not Met</span>
                </>
              )}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isEligible ? 'Eligible' : 'Ineligible'}
            </span>
          </div>

          {eligibilityNotes.length > 0 && (
            <ul className="space-y-1 pt-0.5 text-[11px] list-disc list-inside">
              {eligibilityNotes.map((note, index) => (
                <li
                  key={index}
                  className={isEligible ? 'text-emerald-800' : 'text-rose-800 font-medium'}
                >
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Transparent Recommendation Score & Breakdown */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Recommendation Fit Index:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-brand-700">{recommendationScore}/100</span>
              <span className="text-[10px] font-semibold text-slate-400">
                ({isEligible ? `${matchCategory} Match` : 'Ineligible Cap'})
              </span>
            </div>
          </div>

          {/* Mini Breakdown Pills */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
            <div className="rounded-lg bg-white p-1.5 border border-slate-100 text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-400">Merit Delta</span>
              <span className="font-bold text-slate-800">{scoreBreakdown.meritScore}/100</span>
            </div>
            <div className="rounded-lg bg-white p-1.5 border border-slate-100 text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-400">Budget Match</span>
              <span className="font-bold text-emerald-700">{scoreBreakdown.affordabilityScore}/100</span>
            </div>
            <div className="rounded-lg bg-white p-1.5 border border-slate-100 text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-400">Transit Score</span>
              <span className="font-bold text-amber-700">
                {scoreBreakdown.distanceScore !== null ? `${scoreBreakdown.distanceScore}/100` : 'N/A'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200/60">
            {scoreBreakdown.explanation}
          </p>

          <p className="text-[10px] text-slate-400 italic flex items-center gap-1 pt-1 border-t border-slate-200/40">
            <Info className="h-3 w-3 shrink-0" />
            Statistical decision-support estimate; does not guarantee admission.
          </p>
        </div>

        {/* Academic Aggregate vs Historical Cutoff */}
        <div className="rounded-xl border border-slate-200/80 p-3 bg-white space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Your Projected Admission Aggregate:</span>
            <span className="font-bold text-navy text-sm">
              {studentEstimatedAggregate.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Historical Closing Benchmark:</span>
              <span className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1 rounded">2024 Gazette</span>
            </div>
            <span className="font-semibold text-slate-700">
              {targetClosingCutoff.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
              Aggregate Cutoff Delta:
            </span>
            <span
              className={`font-bold text-xs ${
                isPositiveDelta ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isPositiveDelta
                ? `+${aggregateDelta.toFixed(1)}% above 2024 benchmark`
                : `${Math.abs(aggregateDelta).toFixed(1)}% below 2024 benchmark`}
            </span>
          </div>
        </div>

        {/* Tuition Fee & Transit Distance Specs (Verified Official Labels) */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-start gap-1.5">
            <Coins className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-navy block leading-tight">
                {formatPKR(programme.annualTuitionFeePKR)} / yr
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                ✓ Verified Syndicate Fee
              </span>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              {distanceKm !== null ? (
                <>
                  <span className="font-bold text-slate-900 block leading-tight">
                    ~{distanceKm} km transit
                  </span>
                  <span className="text-[10px] text-slate-400">{programme.campusZone}</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-slate-500 block leading-tight">
                    Distance Unspecified
                  </span>
                  <span className="text-[10px] text-slate-400">Location not set</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleCompareProgramme(programme.id)}
              className={`h-8 px-2.5 text-xs gap-1 cursor-pointer ${
                inCompare
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-600 border-slate-200'
              }`}
              title={inCompare ? 'Remove from comparison' : 'Compare side-by-side'}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{inCompare ? 'In Compare' : 'Compare'}</span>
            </Button>

            <Link
              to={`/programmes/${programme.id}/prediction`}
              className="text-xs font-semibold text-slate-600 hover:text-brand flex items-center gap-1"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cutoff Trends</span>
            </Link>
          </div>

          {onViewDetails ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              className="gap-1.5 text-xs font-bold bg-navy hover:bg-slate-800 text-white cursor-pointer"
              onClick={onViewDetails}
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Link to={`/student/programmes/${programme.id}`}>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5 text-xs font-bold bg-navy hover:bg-slate-800 text-white cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
