import React, { useState } from 'react'
import { useCutoffs } from '@/hooks/useCutoffs'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { PageHeader } from '@/components/shared/PageHeader'
import { CutoffTrendChart } from '@/features/predictions/CutoffTrendChart'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldAlert, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const PredictionsPage: React.FC = () => {
  const { cutoffs, isLoading } = useCutoffs()
  const { profile } = useStudentProfile()
  const [selectedProgId, setSelectedProgId] = useState<string>('ned-cs')

  const activeCutoff = cutoffs.find((c) => c.programmeId === selectedProgId) || cutoffs[0]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Predicted Admission Cutoffs & Historical Trends"
        description="Multi-year closing aggregate data (2021–2024 gazette archives) and projected 2025 thresholds calibrated against your predicted aggregate."
      />

      {/* Model Metadata & Statistical Uncertainty Card */}
      <Card className="border-brand-200/80 bg-gradient-to-r from-brand-50/50 via-white to-slate-50 shadow-2xs">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-brand-100/70 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-extrabold text-navy">
                Prediction Model Architecture & Data Governance
              </h3>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold text-brand bg-white border-brand-200 self-start sm:self-auto">
              Linear Regressive Multi-Year Fit
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Lineage</span>
              <p className="font-semibold text-slate-800">
                Official Syndicate Merit Gazettes
              </p>
              <p className="text-[11px] text-slate-500">
                4-year audited closing scores (2021–2024) across NED, FAST, KU, IBA, and DUHS.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Uncertainty Bound</span>
              <p className="font-semibold text-slate-800">
                ±1.1% Average Projection Band
              </p>
              <p className="text-[11px] text-slate-500">
                Accounts for test score variations, applicant cohort growth, and seat matrix shifts.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Calibration</span>
              <p className="font-semibold text-slate-800">
                {profile.hscTotalPredictedPercentage}% Projected Aggregate
              </p>
              <p className="text-[11px] text-slate-500">
                Derived from {profile.hscGroup} Part-1 ({profile.hscPart1Percentage}%) and SSC ({profile.sscPercentage}%).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Degree Programme Selector */}
      <div className="max-w-md">
        <Select
          label="Select Degree Programme for Deep Trend Analysis"
          value={activeCutoff?.programmeId}
          onChange={(e) => setSelectedProgId(e.target.value)}
        >
          {cutoffs.map((item) => (
            <option key={item.programmeId} value={item.programmeId}>
              {item.programmeName} — {item.universityShortName}
            </option>
          ))}
        </Select>
      </div>

      {/* Main Trend Chart */}
      {activeCutoff && (
        <CutoffTrendChart
          cutoffData={activeCutoff}
          studentAggregate={profile.hscTotalPredictedPercentage}
        />
      )}

      {/* Comprehensive Cutoffs Summary Table with Clear Separation */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-base font-extrabold text-navy">
            Karachi University Cutoff Matrix (Historical vs. 2025 Projected)
          </h3>
          <span className="text-[11px] text-slate-500">
            Historical gazettes (2021–2024) vs. 2025 statistical estimates
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="font-bold text-slate-900">Programme & Institution</TableHead>
                <TableHead className="text-center font-bold text-slate-700 bg-slate-100/60" colSpan={4}>
                  Historical Official Closing Merit (Gazette Archives)
                </TableHead>
                <TableHead className="text-center font-bold text-brand-900 bg-brand-50/60" colSpan={2}>
                  2025 Projected Threshold (Statistical Model)
                </TableHead>
                <TableHead className="font-bold text-slate-900">Your Delta</TableHead>
              </TableRow>
              <TableRow className="border-t border-slate-200 text-xs">
                <TableHead>Degree Title</TableHead>
                <TableHead className="text-center text-[11px] font-semibold">2021</TableHead>
                <TableHead className="text-center text-[11px] font-semibold">2022</TableHead>
                <TableHead className="text-center text-[11px] font-semibold">2023</TableHead>
                <TableHead className="text-center text-[11px] font-bold text-slate-900 bg-slate-100/80">2024 Benchmark</TableHead>
                <TableHead className="text-center text-[11px] font-bold text-brand-800 bg-brand-50/80">2025 Estimate</TableHead>
                <TableHead className="text-center text-[11px] font-medium text-slate-600 bg-brand-50/40">Expected Range</TableHead>
                <TableHead>Target Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cutoffs.map((item) => {
                const proj = item.predictedCutoffRange.projectedAggregate
                const userScore = profile.hscTotalPredictedPercentage
                const delta = Number((userScore - proj).toFixed(1))
                const isAbove = delta >= 0

                const getVal = (year: number) =>
                  item.historicalCutoffs.find((h) => h.year === year)?.closingAggregate

                return (
                  <TableRow
                    key={item.programmeId}
                    className={item.programmeId === activeCutoff?.programmeId ? 'bg-brand-50/40 font-medium' : ''}
                  >
                    <TableCell className="font-bold text-navy">
                      <div>
                        <span>{item.programmeName}</span>
                        <span className="block text-[11px] font-medium text-slate-500">
                          {item.universityShortName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs text-slate-500">{getVal(2021) || '—'}%</TableCell>
                    <TableCell className="text-center text-xs text-slate-500">{getVal(2022) || '—'}%</TableCell>
                    <TableCell className="text-center text-xs text-slate-500">{getVal(2023) || '—'}%</TableCell>
                    <TableCell className="text-center text-xs font-bold text-slate-900 bg-slate-50/80">
                      {getVal(2024) || '—'}%
                    </TableCell>
                    <TableCell className="text-center bg-brand-50/40">
                      <Badge variant="default" className="font-extrabold text-xs bg-brand text-white">
                        {proj}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-slate-600 font-medium bg-brand-50/20">
                      {item.predictedCutoffRange.min}% – {item.predictedCutoffRange.max}%
                    </TableCell>
                    <TableCell>
                      {isAbove ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          +{delta}% Safe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="h-3 w-3" />
                          {Math.abs(delta)}% Gap
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Prominent Non-Guarantee Legal and Statistical Disclaimer */}
      <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            Admissions Decision-Support Disclaimer & Non-Guarantee Notice
          </p>
          <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
            Historical closing merit aggregates are reproduced verbatim from official syndicate merit gazettes published by respective universities (2021–2024). The 2025 projected cutoffs represent statistical regressions based on multi-year applicant trendlines and test weightings. <strong>These figures are decision-support aids and do not constitute an official offer or guarantee of university admission.</strong> Final closing cutoffs are determined exclusively by university admission committees following entrance test results.
          </p>
        </div>
      </div>
    </div>
  )
}
