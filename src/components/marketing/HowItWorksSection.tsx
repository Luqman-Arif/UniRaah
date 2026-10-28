import React from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Sliders,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Share Your Academic Information',
      badge: 'Step 1 • Profile Input',
      route: '/discover',
      description:
        'Select your intermediate board (BIEK Karachi, FBISE, or AKU-EB), intermediate study group, and enter your SSC matriculation and HSC Part-1 percentage.',
      highlights: [
        'BIEK & Federal Board compatibility',
        'Validates group prerequisites & math rules',
        'Key subject score verification',
      ],
      icon: <FileText className="h-5 w-5 text-brand" />,
    },
    {
      number: '02',
      title: 'Set Budget & Location Preferences',
      badge: 'Step 2 • Calibration',
      route: '/discover/preferences',
      description:
        'Specify your family tuition ceiling (annual or per-semester), choose your residential Karachi neighborhood, and balance priority weights for Merit, Fees, and Distance.',
      highlights: [
        'Pre-calibrated 12 Karachi residential zones',
        'Transparent fee period selections',
        'Normalized priority balance sliders',
      ],
      icon: <Sliders className="h-5 w-5 text-brand" />,
    },
    {
      number: '03',
      title: 'Explore Ranked Degrees & Cutoffs',
      badge: 'Step 3 • Decision Support',
      route: '/recommendations',
      description:
        'Review degree programmes categorized into Safety, Target, and Reach tiers with recommendation scores, 4-year cutoff trajectory trends, and verified official citations.',
      highlights: [
        'Safety, Target, and Reach categorization',
        '2021–2024 closing merit benchmarks',
        'Links to verified university prospectuses',
      ],
      icon: <Compass className="h-5 w-5 text-brand" />,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/60 border-b border-border/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="text-xs font-bold text-brand-700 bg-brand-50 border-brand-200"
          >
            Streamlined Student Workflow
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            How UniRaah Works in 3 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From entering your intermediate marks to reviewing ranked degree programmes — complete your personalized evaluation in under two minutes.
          </p>
        </div>

        {/* 3 Connected Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line across desktop steps */}
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 -z-0"
            aria-hidden="true"
          />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-subtle hover:border-brand-300 hover:shadow-elevated hover:-translate-y-1 transition-all duration-200 active:scale-[0.99] group"
            >
              <div className="space-y-4">
                {/* Step Indicator Header */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white font-black text-base shadow-xs group-hover:bg-brand-700 transition-colors">
                    {step.number}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md group-hover:text-brand transition-colors">
                    {step.badge}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-lg font-bold text-navy group-hover:text-brand transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bullet highlights */}
                <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  {step.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link to the specific step */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to={step.route}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand rounded-md p-1 -m-1"
                >
                  <span>Open {step.title.split(' ')[0]} Flow</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
