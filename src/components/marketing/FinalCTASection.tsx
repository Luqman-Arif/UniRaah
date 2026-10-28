import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  ArrowRight,
  Compass,
  ShieldCheck,
  BotMessageSquare,
} from 'lucide-react'

export const FinalCTASection: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth()
  const navigate = useNavigate()

  const handleAction = (targetUrl: string, promptText?: string) => {
    if (!isAuthenticated) {
      openAuthModal('signin', targetUrl, promptText)
    } else {
      navigate(targetUrl)
    }
  }
  return (
    <section className="py-20 lg:py-28 bg-page relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-600 via-brand-700 to-navy p-8 sm:p-12 lg:p-16 text-white shadow-elevated overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-200" />
              <span>Karachi Higher Secondary Decision Support</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Make Your Next Academic Decision With More Clarity.
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-brand-100 leading-relaxed font-normal">
              Compare degrees matching your intermediate group, align tuition fees and transit distance with your family priorities, and benchmark multi-year merit cutoffs grounded in official university documents.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Button
                size="lg"
                onClick={() =>
                  handleAction(
                    '/discover',
                    'Please sign in or create an account to start your personalized Karachi university degree discovery.'
                  )
                }
                className="bg-white text-brand-700 hover:bg-slate-100 font-bold px-7 h-12 text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Find Your Programmes</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() =>
                  handleAction(
                    '/recommendations',
                    'Sign in or select a demo persona to view Karachi university recommendations.'
                  )
                }
                className="bg-white/10 hover:bg-white/20 active:bg-white/25 active:scale-[0.98] text-white border border-white/25 h-12 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <Compass className="h-4 w-4 mr-2" />
                <span>View Sample Recommendations</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() =>
                  handleAction(
                    '/advisor',
                    'Sign in to ask Karachi admission eligibility questions to the AI Advisor.'
                  )
                }
                className="bg-white/10 hover:bg-white/20 active:bg-white/25 active:scale-[0.98] text-white border border-white/25 h-12 text-sm font-semibold hidden sm:inline-flex transition-all focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <BotMessageSquare className="h-4 w-4 mr-2" />
                <span>Ask AI Advisor</span>
              </Button>
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs text-brand-200 border-t border-white/15">
              <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
              <span>
                100% free for students and families. No account required to explore qualifying degree options.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
