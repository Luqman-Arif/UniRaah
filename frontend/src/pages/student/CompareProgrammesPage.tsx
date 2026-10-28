import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useProgrammes } from '@/hooks/useProgrammes'
import { useCutoffs } from '@/hooks/useCutoffs'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useRecommendations } from '@/hooks/useRecommendations'
import { calculateKarachiDistanceKm } from '@/services/mock/distanceService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { MatchBadge } from '@/components/shared/MatchBadge'
import { formatPKR } from '@/lib/utils'
import {
  Scale,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react'

export const CompareProgrammesPage: React.FC = () => {
  const {
    compareProgrammeIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
  } = useStudentDashboard()

  const { programmes } = useProgrammes()
  const { cutoffs } = useCutoffs()
  const { profile } = useStudentProfile()
  const { recommendations } = useRecommendations()

  // Find active programmes in comparison
  const comparedProgrammes = useMemo(() => {
    return programmes.filter((p) => compareProgrammeIds.includes(p.id))
  }, [programmes, compareProgrammeIds])

  // Map of recommendations for match scores & delta
  const recMap = useMemo(() => {
    const map = new Map<string, (typeof recommendations)[0]>()
    recommendations.forEach((r) => map.set(r.programme.id, r))
    return map
  }, [recommendations])

  // Cutoffs map
  const cutoffMap = useMemo(() => {
    const map = new Map<string, (typeof cutoffs)[0]>()
    cutoffs.forEach((c) => map.set(c.programmeId, c))
    return map
  }, [cutoffs])

  // Candidates available to add to compare (from saved or catalog)
  const candidateProgrammes = useMemo(() => {
    return programmes.filter((p) => !compareProgrammeIds.includes(p.id))
  }, [programmes, compareProgrammeIds])

  const handleSelectAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val) {
      addToCompare(val)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
              Side-by-Side Programme Comparison
            </h2>
            <Badge variant="outline" className="text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
              {comparedProgrammes.length}/4 Selected
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare eligibility thresholds, fee structures, entry test formulas, and multi-year cutoff projections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {comparedProgrammes.length < 4 && candidateProgrammes.length > 0 && (
            <div className="relative">
              <Select
                onChange={handleSelectAdd}
                defaultValue=""
                className="h-9 text-xs font-semibold pr-8 cursor-pointer border-slate-300"
              >
                <option value="" disabled>
                  + Add Programme to Compare...
                </option>
                {candidateProgrammes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.universityShortName})
                  </option>
                ))}
              </Select>
            </div>
          )}

          {comparedProgrammes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300 border-slate-200 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Matrix</span>
            </Button>
          )}
        </div>
      </div>

      {/* Verified vs Estimated Disclaimer Banner */}
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50/70 via-white to-slate-50 p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">
              Transparent Decision Grounding
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Fees, eligibility groups, and accreditation bodies are <strong>verified</strong> against published official prospectuses. Projected 2025 cutoffs are statistical estimates calibrated from 2021–2024 merit lists.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white border-brand-200 text-brand-700 text-[10px] font-bold shrink-0">
          HEC & University Calibrated
        </Badge>
      </div>

      {/* Comparison View */}
      {comparedProgrammes.length >= 2 ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-slate-400 w-48 min-w-[180px] sticky left-0 bg-slate-50/95 backdrop-blur-xs z-10">
                    Degree Metric
                  </th>
                  {comparedProgrammes.map((prog) => {
                    const rec = recMap.get(prog.id)

                    return (
                      <th
                        key={prog.id}
                        className="p-4 sm:p-5 min-w-[240px] sm:min-w-[280px] max-w-xs align-top border-l border-slate-200"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {prog.universityShortName}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCompare(prog.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Remove from comparison"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <h3 className="text-sm font-extrabold text-navy leading-snug">
                            {prog.name}
                          </h3>

                          {rec && (
                            <div className="pt-1">
                              <MatchBadge category={rec.matchCategory} score={rec.recommendationScore} />
                            </div>
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* 1. University & Sector */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Institution & Sector
                  </td>
                  {comparedProgrammes.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-100">
                      <p className="font-bold text-navy">{p.universityName}</p>
                      <Badge variant="outline" className="text-[10px] mt-1 font-semibold text-slate-600">
                        {p.universitySector} Sector
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* 2. Accreditation (Verified) */}
                <tr className="bg-slate-50/30">
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-100">
                    Accreditation Body
                    <span className="block text-[10px] font-normal text-emerald-700">✓ Verified Official</span>
                  </td>
                  {comparedProgrammes.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-100 font-semibold text-slate-800">
                      {p.accreditationBody || 'Not Reported in Gazette'}
                    </td>
                  ))}
                </tr>

                {/* 3. Minimum HSC Requirement */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Minimum HSC Marks Required
                    <span className="block text-[10px] font-normal text-emerald-700">✓ Syndicate Standard</span>
                  </td>
                  {comparedProgrammes.map((p) => {
                    const isEligible = profile.hscPart1Percentage >= p.minHscPercentage

                    return (
                      <td key={p.id} className="p-4 border-l border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-navy">{p.minHscPercentage}%</span>
                          {isEligible ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" /> Meets Threshold
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                              <XCircle className="h-3 w-3" /> Below Threshold
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>

                {/* 4. Eligible HSC Groups */}
                <tr className="bg-slate-50/30">
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-100">
                    Eligible Intermediate Faculties
                  </td>
                  {comparedProgrammes.map((p) => {
                    const matchesGroup = p.eligibleHSCGroups.includes(profile.hscGroup)

                    return (
                      <td key={p.id} className="p-4 border-l border-slate-100 space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {p.eligibleHSCGroups.map((g, i) => (
                            <span
                              key={i}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                g === profile.hscGroup
                                  ? 'bg-brand text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                        {matchesGroup ? (
                          <p className="text-[10px] font-bold text-emerald-700">Your group is eligible</p>
                        ) : (
                          <p className="text-[10px] font-bold text-rose-700">Ineligible for your group</p>
                        )}
                      </td>
                    )
                  })}
                </tr>

                {/* 5. Annual & Semester Tuition Fee */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Tuition Schedule
                    <span className="block text-[10px] font-normal text-emerald-700">✓ Official Fee Notice</span>
                  </td>
                  {comparedProgrammes.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-100 space-y-0.5">
                      <p className="text-sm font-extrabold text-navy">
                        {formatPKR(p.annualTuitionFeePKR)} / Year
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Approx. {formatPKR(p.semesterTuitionFeePKR || Math.round(p.annualTuitionFeePKR / 2))} / Semester
                      </p>
                    </td>
                  ))}
                </tr>

                {/* 6. Entry Test Weightage Formula */}
                <tr className="bg-slate-50/30">
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-100">
                    Merit Formula & Weights
                  </td>
                  {comparedProgrammes.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-100 space-y-1">
                      <p className="font-bold text-slate-900">{p.testWeightage.testName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{p.testWeightage.entryTestPercentage}% Entry Test</span>
                        <span>+</span>
                        <span>{p.testWeightage.hscPercentage}% HSC</span>
                        {p.testWeightage.sscPercentage > 0 && (
                          <>
                            <span>+</span>
                            <span>{p.testWeightage.sscPercentage}% SSC</span>
                          </>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 7. Projected 2025 Closing Cutoff */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Projected 2025 Cutoff
                    <span className="block text-[10px] font-normal text-amber-700">~ Statistical Projection</span>
                  </td>
                  {comparedProgrammes.map((p) => {
                    const cutoff = cutoffMap.get(p.id)
                    const proj = cutoff?.predictedCutoffRange.projectedAggregate
                    const delta = proj !== undefined ? Number((profile.hscTotalPredictedPercentage - proj).toFixed(1)) : null

                    return (
                      <td key={p.id} className="p-4 border-l border-slate-100">
                        {cutoff ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-extrabold text-navy">{proj}%</span>
                              {delta !== null && (
                                <Badge
                                  variant={delta >= 0 ? 'success' : 'warning'}
                                  className="text-[10px] font-bold"
                                >
                                  {delta >= 0 ? `+${delta}% Above` : `${delta}% Below`}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Range: {cutoff.predictedCutoffRange.min}% – {cutoff.predictedCutoffRange.max}%
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">No Cutoff Record Available</span>
                        )}
                      </td>
                    )
                  })}
                </tr>

                {/* 8. Campus Transit Proximity */}
                <tr className="bg-slate-50/30">
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-100">
                    Transit Distance from Home
                    <span className="block text-[10px] font-normal text-slate-500">Home: {profile.preferences.homeLocation}</span>
                  </td>
                  {comparedProgrammes.map((p) => {
                    const distKm = calculateKarachiDistanceKm(
                      profile.preferences.homeLocation,
                      p.campusZone || 'University Road Corridor'
                    )

                    return (
                      <td key={p.id} className="p-4 border-l border-slate-100">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{distKm !== null ? `~${distKm} km` : 'Location Unspecified'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{p.campusZone || 'Karachi Campus'}</p>
                      </td>
                    )
                  })}
                </tr>

                {/* 9. Direct Link Actions */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Explore Criteria
                  </td>
                  {comparedProgrammes.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-100">
                      <Link to={`/student/programmes/${p.id}`}>
                        <Button size="sm" className="w-full gap-1 text-xs bg-navy hover:bg-slate-800 text-white cursor-pointer">
                          <span>View Full Profile</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Needs more items in comparison */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <Scale className="h-8 w-8 text-emerald-600" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-navy">
              {comparedProgrammes.length === 1
                ? 'Select 1 More Degree to Compare'
                : 'Select 2 to 4 Degree Programmes to Compare'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Side-by-side comparison evaluates admission aggregates, tuition fees, eligibility rules, and historical closing merit trends.
            </p>
          </div>

          {candidateProgrammes.length > 0 && (
            <div className="max-w-xs mx-auto pt-2">
              <Select
                onChange={handleSelectAdd}
                defaultValue=""
                className="h-10 text-xs font-semibold cursor-pointer"
              >
                <option value="" disabled>
                  Choose a Programme to Add...
                </option>
                {candidateProgrammes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.universityShortName}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="pt-2">
            <Link to="/student/recommendations">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                Browse Recommended Programmes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
