import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCutoffs } from '@/hooks/useCutoffs'
import { useProgrammes } from '@/hooks/useProgrammes'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { CutoffTrendChart } from '@/features/predictions/CutoffTrendChart'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import {
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'

export const ProgrammePredictionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { cutoffs, isLoading: isCutoffsLoading } = useCutoffs()
  const { programmes, isLoading: isProgsLoading } = useProgrammes()
  const { profile } = useStudentProfile()

  const [selectedProgId, setSelectedProgId] = useState<string>(id || 'ned-cs')

  // Keep selected ID in sync if param changes
  const activeProgId = id || selectedProgId
  const activeCutoff = cutoffs.find((c) => c.programmeId === activeProgId) || cutoffs[0]
  const activeProgramme = programmes.find((p) => p.id === activeProgId)

  if (isCutoffsLoading || isProgsLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (!activeCutoff) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <EmptyState
          title="Cutoff Data Not Available"
          description="Historical cutoff records and statistical projections have not yet been indexed for this programme."
          actionLabel="Return to Recommendations"
          onAction={() => navigate('/recommendations')}
        />
      </div>
    )
  }

  const userScore = profile.hscTotalPredictedPercentage
  const projScore = activeCutoff.predictedCutoffRange.projectedAggregate
  const delta = Number((userScore - projScore).toFixed(1))
  const isSafe = delta >= 0

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/recommendations" className="hover:text-brand-600 transition-colors">
            Recommendations
          </Link>
          <span>/</span>
          {activeProgramme ? (
            <Link to={`/programmes/${activeProgramme.id}`} className="hover:text-brand-600 transition-colors">
              {activeProgramme.name}
            </Link>
          ) : (
            <span>Programme Details</span>
          )}
          <span>/</span>
          <span className="font-semibold text-slate-900">Cutoff Prediction & Trends</span>
        </div>

        <div className="flex items-center gap-2">
          {activeProgramme && (
            <Link to={`/programmes/${activeProgramme.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" />
                Programme Details
              </Button>
            </Link>
          )}
          <Link to="/recommendations">
            <Button variant="ghost" size="sm" className="text-xs text-slate-600">
              Recommendations
            </Button>
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="text-xs bg-brand-600 text-white font-semibold">
            {activeCutoff.admissionCycleContext}
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            Historical Cutoffs (2021–2024) & Illustrative 2025 Forecast
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {activeCutoff.programmeName} — {activeCutoff.universityName}
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Multi-year open merit closing thresholds with calibrated projection against your intermediate predicted aggregate.
        </p>
      </div>

      {/* Clear Statistical Disclaimer Alert */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Important Advisory & Disclaimer (Estimates are not guarantees):</span>
        </div>
        <p className="leading-relaxed text-amber-800">
          {activeCutoff.disclaimer} All historical figures are drawn directly from published selection lists. Official closing merit is determined solely by the university admissions committee at the time of final seat allocation.
        </p>
      </div>

      {/* Programme Switcher Dropdown */}
      <div className="max-w-md">
        <Select
          label="Select Degree Programme to Inspect Cutoffs"
          value={activeCutoff.programmeId}
          onChange={(e) => {
            setSelectedProgId(e.target.value)
            navigate(`/programmes/${e.target.value}/prediction`)
          }}
        >
          {cutoffs.map((item) => (
            <option key={item.programmeId} value={item.programmeId}>
              {item.programmeName} — {item.universityShortName}
            </option>
          ))}
        </Select>
      </div>

      {/* Forecast Snapshot KPI Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Card 1: Projected 2025 Baseline */}
        <Card className="border-brand-200 bg-brand-50/30 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              2025 Projected Baseline
            </span>
            <p className="text-3xl font-black text-brand-700">
              {activeCutoff.predictedCutoffRange.projectedAggregate}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Expected range: {activeCutoff.predictedCutoffRange.min}% – {activeCutoff.predictedCutoffRange.max}%
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Your Current Projected Aggregate */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Your Predicted Aggregate
            </span>
            <p className="text-3xl font-black text-slate-900">
              {userScore.toFixed(1)}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Evaluated for {profile.fullName} ({profile.hscGroup})
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Delta Margin */}
        <Card className={`border-slate-200 shadow-xs ${isSafe ? 'bg-emerald-50/30' : 'bg-rose-50/30'}`}>
          <CardContent className="p-5 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Estimated Cutoff Margin
            </span>
            <p className={`text-3xl font-black ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isSafe ? `+${delta}%` : `${delta}%`}
            </p>
            <p className={`text-[11px] font-bold ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isSafe ? 'Above projected cutoff threshold' : 'Competitive / Below threshold'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Historical Trend Chart Component */}
      <CutoffTrendChart
        cutoffData={activeCutoff}
        studentAggregate={userScore}
      />

      {/* Historical Records Summary Table */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Multi-Year Historical Breakdown & Seat Allocations
          </CardTitle>
          <CardDescription className="text-xs">
            Merit formula: {activeCutoff.meritFormulaDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Admission Cycle</th>
                  <th className="py-2.5 px-3">Closing Aggregate</th>
                  <th className="py-2.5 px-3">Open Merit Rank</th>
                  <th className="py-2.5 px-3">Seats Filled</th>
                  <th className="py-2.5 px-3">Data Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCutoff.historicalCutoffs.map((item) => (
                  <tr key={item.year} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.year} Admission Cycle</td>
                    <td className="py-3 px-3 font-extrabold text-brand-700">{item.closingAggregate.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.openMeritClosingRank ? `#${item.openMeritClosingRank}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.seatsFilled} Seats</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 font-semibold">
                        Verified Official List
                      </Badge>
                    </td>
                  </tr>
                ))}
                <tr className="bg-brand-50/40 font-bold">
                  <td className="py-3 px-3 text-brand-900">2025 Projected (Next Batch)</td>
                  <td className="py-3 px-3 text-brand-800">
                    {activeCutoff.predictedCutoffRange.projectedAggregate}% (Range: {activeCutoff.predictedCutoffRange.min}%–{activeCutoff.predictedCutoffRange.max}%)
                  </td>
                  <td className="py-3 px-3 text-slate-500">—</td>
                  <td className="py-3 px-3 text-slate-600">Pending Registration</td>
                  <td className="py-3 px-3">
                    <Badge variant="default" className="text-[10px] bg-brand-600 text-white font-bold">
                      Illustrative Projection
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
