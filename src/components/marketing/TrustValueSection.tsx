import React from 'react'
import {
  GraduationCap,
  TrendingUp,
  Wallet,
  MapPin,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const TrustValueSection: React.FC = () => {
  const dimensions = [
    {
      icon: <GraduationCap className="h-5 w-5 text-brand" />,
      title: 'Academic Eligibility',
      badge: 'Requirements',
      description:
        'Verifies intermediate group prerequisites (Pre-Eng, Pre-Med, ICS) and validates council policies like HEC deficiency math.',
      iconBg: 'bg-brand-50 border-brand-200/80 text-brand',
      badgeStyle: 'bg-brand-50 text-brand-700 border-brand-200/80',
      dotColor: 'bg-brand',
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      title: 'Historical Closing Merit',
      badge: 'Closing Merit',
      description:
        'Benchmarks verified multi-year closing aggregates to assess realistic admission likelihood without speculative estimates.',
      iconBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-600',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotColor: 'bg-emerald-500',
    },
    {
      icon: <Wallet className="h-5 w-5 text-indigo-600" />,
      title: 'Tuition & Billing Cycles',
      badge: 'Annual Fees',
      description:
        'Analyzes audited annual and semester fee schedules across public, semi-government, and private Karachi universities.',
      iconBg: 'bg-indigo-50 border-indigo-200/80 text-indigo-600',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      dotColor: 'bg-indigo-500',
    },
    {
      icon: <MapPin className="h-5 w-5 text-rose-600" />,
      title: 'Karachi Transit Proximity',
      badge: 'Transit Zones',
      description:
        'Calculates estimated commute distance from your residential area to campus corridors for daily feasibility.',
      iconBg: 'bg-rose-50 border-rose-200/80 text-rose-600',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotColor: 'bg-rose-500',
    },
    {
      icon: <FileCheck2 className="h-5 w-5 text-amber-600" />,
      title: 'Official Document Records',
      badge: 'Official Sources',
      description:
        'Cross-references formulas, quotas, and seat counts against official university prospectuses and syndicate gazettes.',
      iconBg: 'bg-amber-50 border-amber-200/80 text-amber-600',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dotColor: 'bg-amber-500',
    },
  ]

  return (
    <section className="relative border-b border-border/80 bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow & Headline */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/70 px-3.5 py-1.5 text-xs font-semibold text-brand-800 shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0" />
            <span className="leading-none">Comprehensive Admissions Evaluation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            University Decisions Involve More Than an Aggregate Mark.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A high intermediate percentage is only one part of the equation. Choosing an undergraduate programme in Karachi requires evaluating eligibility regulations, historical merit cutoffs, family budget limits, daily transit feasibility, and official university policies.
          </p>
        </div>

        {/* 5 Decision Dimensions Grid */}
        <div className="mt-12 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {dimensions.map((dim, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 transition-all duration-200 hover:border-brand-300 hover:bg-white hover:shadow-elevated hover:-translate-y-1 group cursor-default h-full"
            >
              <div className="flex flex-col flex-1">
                {/* Top Row: Icon Container and Badge side-by-side with close, balanced alignment */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-2xs transition-transform duration-200 group-hover:scale-105',
                      dim.iconBg
                    )}
                  >
                    {dim.icon}
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 h-6 shrink-0 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider border leading-none shadow-2xs',
                      dim.badgeStyle
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dim.dotColor)} />
                    <span>{dim.badge}</span>
                  </span>
                </div>

                {/* Title with unified min-height to ensure equal margin and aligned body text */}
                <h3 className="text-sm font-bold text-navy group-hover:text-brand transition-colors mt-4 min-h-[40px] flex items-start leading-snug">
                  {dim.title}
                </h3>

                {/* Description with unified min-height and balanced copy */}
                <p className="text-xs text-slate-600 leading-relaxed mt-2 flex-1 min-h-[3.75rem]">
                  {dim.description}
                </p>
              </div>

              {/* Bottom Footer Row with aligned icon and text */}
              <div className="pt-3.5 border-t border-slate-200/70 mt-4 text-[11px] font-semibold text-brand flex items-center justify-between">
                <span className="text-slate-500 text-[10px] group-hover:text-brand transition-colors">
                  Multi-factor engine
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-brand/70 group-hover:text-brand group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
