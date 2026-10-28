import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building2,
  ArrowRight,
  Sparkles,
  FileText,
  User,
} from 'lucide-react'

interface ShowcaseProgramme {
  id: string
  rank: number
  title: string
  university: string
  sector: 'Public' | 'Semi-Government' | 'Private'
  category: 'Target' | 'Safety' | 'Reach'
  fitScore: number
  estimatedAggregate: number
  cutoffDelta: number
  annualFeePKR: number
  distanceKm: number
  locationZone: string
  testWeightage: string
  explanation: string
  officialDoc: string
}

const showcaseData: ShowcaseProgramme[] = [
  {
    id: 'ned-cs',
    rank: 1,
    title: 'BS Computer Science',
    university: 'NED University of Engineering & Technology',
    sector: 'Public',
    category: 'Target',
    fitScore: 94,
    estimatedAggregate: 84.2,
    cutoffDelta: 1.8,
    annualFeePKR: 98000,
    distanceKm: 2.5,
    locationZone: 'University Road Corridor',
    testWeightage: '50% NED Entry Test + 50% HSC Part-1',
    explanation:
      'High composite match. Your 84.2% projected aggregate exceeds the 2024 closing cutoff (82.4%) by +1.8%. Highly affordable subsidized public tuition and under 3 km from your Gulshan location.',
    officialDoc: 'NED Undergraduate Prospectus 2024–25 (Section 4.2)',
  },
  {
    id: 'ku-se',
    rank: 2,
    title: 'BS Software Engineering',
    university: 'University of Karachi (UBIT)',
    sector: 'Public',
    category: 'Safety',
    fitScore: 98,
    estimatedAggregate: 84.2,
    cutoffDelta: 4.5,
    annualFeePKR: 76000,
    distanceKm: 3.8,
    locationZone: 'Main University Road Campus',
    testWeightage: '50% KU Entry Test + 50% HSC Part-1',
    explanation:
      'Comfortable safety tier. Your estimated aggregate exceeds the previous year cutoff by +4.5%. Lowest annual tuition among computing degrees in Karachi with convenient campus access.',
    officialDoc: 'University of Karachi UBIT Policy Guide 2024–25',
  },
  {
    id: 'fast-ai',
    rank: 3,
    title: 'BS Artificial Intelligence',
    university: 'FAST-NUCES Karachi',
    sector: 'Semi-Government',
    category: 'Reach',
    fitScore: 86,
    estimatedAggregate: 84.2,
    cutoffDelta: -1.2,
    annualFeePKR: 340000,
    distanceKm: 17.5,
    locationZone: 'National Highway / Malir',
    testWeightage: '50% FAST Test + 40% HSC + 10% SSC',
    explanation:
      'Competitive reach tier. Cutoff aggregate is highly competitive. Annual fee is within your PKR 500k ceiling, though the 17.5 km transit distance requires dedicated shuttle planning.',
    officialDoc: 'FAST-NUCES Karachi Fall 2024 Fee & Eligibility Gazette',
  },
]

export const ProductShowcaseSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('ned-cs')
  const activeProgramme =
    showcaseData.find((p) => p.id === selectedId) || showcaseData[0]

  return (
    <section id="showcase" className="py-20 lg:py-28 bg-white border-b border-border/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="text-xs font-bold text-brand-700 bg-brand-50 border-brand-200"
          >
            Interface Walkthrough
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            Experience the UniRaah Decision Cockpit
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            See how real Karachi intermediate credentials are processed into ranked recommendations, cutoff deltas, and official citations.
          </p>
        </div>

        {/* Desktop-Style Window Mockup */}
        <div className="rounded-3xl border border-slate-300/80 bg-slate-900 shadow-modal overflow-hidden">
          {/* Mock Browser Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 ml-2">
                app.uniraah.pk/recommendations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Interactive Preview (Illustrative Mock Data)
              </span>
            </div>
          </div>

          {/* Inner Application Viewport */}
          <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Context Header Pill Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-navy">
                  <User className="h-3.5 w-3.5 text-brand" />
                  <span>Muhammad Hamza</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">BIEK Karachi • Pre-Engineering</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">Part-1: <strong>81.2%</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-brand font-bold">Predicted: 82.5%</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                  Origin: Gulshan-e-Iqbal
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                  Cap: PKR 500k / Yr
                </Badge>
              </div>
            </div>

            {/* Main Cockpit Split View (List on Left, Details on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Ranked Cards */}
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  Ranked Recommendations ({showcaseData.length})
                </p>
                {showcaseData.map((item) => {
                  const isSelected = item.id === selectedId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand ${
                        isSelected
                          ? 'bg-white border-brand shadow-sm ring-2 ring-brand-100 scale-[1.01]'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-2xs active:scale-[0.99]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-navy text-[10px] font-extrabold text-white">
                              #{item.rank}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {item.university}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-navy mt-1">
                            {item.title}
                          </h4>
                        </div>
                        <Badge
                          variant={
                            item.category === 'Target'
                              ? 'warning'
                              : item.category === 'Safety'
                              ? 'success'
                              : 'destructive'
                          }
                          className="text-[10px] px-2 py-0.5 shrink-0"
                        >
                          {item.category} ({item.fitScore}%)
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>PKR {item.annualFeePKR.toLocaleString()} / Yr</span>
                        <span className="text-brand font-semibold">{item.distanceKm} km away</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Right Column: Detailed Programme Preview */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {activeProgramme.university} • {activeProgramme.sector}
                        </span>
                        <h3 className="text-xl font-extrabold text-navy mt-1">
                          {activeProgramme.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Location: {activeProgramme.locationZone} ({activeProgramme.distanceKm} km from Gulshan-e-Iqbal)
                        </p>
                      </div>
                      <Badge
                        variant={
                          activeProgramme.category === 'Target'
                            ? 'warning'
                            : activeProgramme.category === 'Safety'
                            ? 'success'
                            : 'destructive'
                        }
                        className="text-xs px-2.5 py-1"
                      >
                        {activeProgramme.category} Match
                      </Badge>
                    </div>

                    {/* Criteria & Formula Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Est. Aggregate
                        </span>
                        <span className="text-base font-extrabold text-navy">
                          {activeProgramme.estimatedAggregate}%
                        </span>
                        <span className={`text-[10px] font-bold block ${
                          activeProgramme.cutoffDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {activeProgramme.cutoffDelta >= 0 ? `+${activeProgramme.cutoffDelta}%` : `${activeProgramme.cutoffDelta}%`} vs Cutoff
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Annual Tuition
                        </span>
                        <span className="text-base font-extrabold text-navy">
                          PKR {(activeProgramme.annualFeePKR / 1000).toFixed(0)}k
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          PKR {(activeProgramme.annualFeePKR / 2000).toFixed(0)}k / sem
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Commute Proximity
                        </span>
                        <span className="text-base font-extrabold text-navy">
                          {activeProgramme.distanceKm} km
                        </span>
                        <span className="text-[10px] text-brand font-semibold block">
                          Gulshan Corridor
                        </span>
                      </div>
                    </div>

                    {/* Why this is recommended */}
                    <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-4 space-y-1.5">
                      <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-brand" />
                        Recommendation Rationale
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeProgramme.explanation}
                      </p>
                    </div>

                    {/* Weightage Formula & Official Source */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Admission Test Formula:</span>
                        <strong className="text-navy">{activeProgramme.testWeightage}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-slate-400" /> Official Source:
                        </span>
                        <span className="text-brand font-semibold truncate max-w-[260px]">
                          {activeProgramme.officialDoc}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to Real Student Discovery Flow */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      Matches the live logic in the Student Portal
                    </span>
                    <Link to="/discover">
                      <Button size="sm" className="gap-1.5 font-bold bg-brand hover:bg-brand-700 text-white">
                        <span>Try With Your Real Marks</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
