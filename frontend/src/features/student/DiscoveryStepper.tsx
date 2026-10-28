import React from 'react'
import { Link } from 'react-router-dom'
import { Check, GraduationCap, Sliders, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DiscoveryStepperProps {
  currentStep: 1 | 2 | 3
}

export const DiscoveryStepper: React.FC<DiscoveryStepperProps> = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: 'Academic Information',
      subtitle: 'Board, Group & Marks',
      icon: <GraduationCap className="h-4 w-4" />,
      to: '/discover',
    },
    {
      number: 2,
      title: 'Preferences & Priorities',
      subtitle: 'Budget, Location & Weights',
      icon: <Sliders className="h-4 w-4" />,
      to: '/discover/preferences',
    },
    {
      number: 3,
      title: 'Ranked Recommendations',
      subtitle: 'Personalized Programmes',
      icon: <Sparkles className="h-4 w-4" />,
      to: '/recommendations',
    },
  ]

  return (
    <nav aria-label="Discovery Progress" className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 relative">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isUpcoming = step.number > currentStep

          return (
            <Link
              key={step.number}
              to={step.to}
              className={cn(
                'flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand',
                isCurrent && 'bg-brand-50 border border-brand-200 shadow-2xs',
                isCompleted && 'bg-slate-50/90 border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40',
                isUpcoming && 'opacity-70 border border-transparent hover:border-slate-200 hover:bg-slate-50/60'
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors duration-200',
                  isCompleted && 'bg-emerald-600 text-white shadow-2xs group-hover:bg-emerald-700',
                  isCurrent && 'bg-brand-600 text-white shadow-xs',
                  isUpcoming && 'bg-slate-200 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step {step.number} of 3
                  </span>
                  {isCurrent && (
                    <span className="rounded-full bg-brand-200/70 px-1.5 py-0.2 text-[9px] font-bold text-brand-800">
                      Active
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[9px] font-semibold text-emerald-700">
                      Completed
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    'text-xs font-bold truncate transition-colors',
                    isCurrent ? 'text-brand-900 font-extrabold' : 'text-slate-800 group-hover:text-brand'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{step.subtitle}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
