import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Sparkles,
  Bot,
  TrendingUp,
  MapPin,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Compass,
} from 'lucide-react'
import heroStudentImg from '@/assets/hero-student.jpg'

export const HeroSection: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth()
  const navigate = useNavigate()

  const handleFindProgrammesClick = () => {
    if (!isAuthenticated) {
      openAuthModal(
        'signin',
        '/discover',
        'Please sign in or create an account to start your personalized Karachi university degree discovery.'
      )
    } else {
      navigate('/discover')
    }
  }

  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('how-it-works')
    if (target) {
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-border/60 bg-gradient-to-b from-white via-brand-50/20 to-slate-50/50">
      {/* Soft Blue & Violet Ambient Background Lighting Glows */}
      <div
        className="absolute top-0 right-1/4 -mt-20 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-10 h-80 w-80 rounded-full bg-violet-100/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-indigo-50/50 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Core Narrative & Action Controls             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/90 bg-white/90 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                Your Path to the Right University
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-navy leading-[1.14] text-balance">
              YOUR FUTURE STARTS WITH THE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-brand-600 to-brand-700">
                RIGHT UNIVERSITY
              </span>
              
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal text-pretty">
              Discover undergraduate programmes that fit your academic profile, budget, and location — with admission insights grounded in official university information.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={handleFindProgrammesClick}
                className="gap-2.5 font-bold shadow-sm hover:shadow-md px-6 h-12 text-sm bg-brand hover:bg-brand-700 text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Find Your Programmes</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <a
                href="#how-it-works"
                onClick={handleScrollToHowItWorks}
                className="inline-flex items-center"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 text-sm font-semibold border-slate-300 text-slate-700 hover:text-navy hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <Compass className="h-4 w-4 mr-2 text-slate-500" />
                  <span>Explore How It Works</span>
                </Button>
              </a>
            </div>

            {/* Reassurance Line */}
            <div className="pt-1 flex items-start gap-2 text-xs text-slate-500 max-w-xl">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Explore suitable Karachi options before making an admission decision. Projections are statistical benchmarks; final admission decisions rest solely with official university syndicates.
              </p>
            </div>

            {/* Monitored Karachi Institutions Quick Pills */}
            <div className="pt-4 border-t border-slate-200/70">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Indexed Karachi Universities & Verified Prospectuses
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> NED UET
                </span>
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> FAST-NUCES
                </span>
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> KU (UBIT)
                </span>
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> IBA Karachi
                </span>
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> DUHS Karachi
                </span>
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> Habib Univ.
                </span>
                <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 flex items-center gap-1 shadow-2xs hover:border-brand-300 hover:text-brand-700 hover:bg-white transition-colors cursor-default">
                  <Building2 className="h-3 w-3 text-brand" /> SSUET
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Visual Composition & Floating Panels        */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center">
            {/* Visual Anchor Box */}
            <div className="relative w-full max-w-[480px] sm:max-w-[500px]">
              {/* Backlight Ambient Glow Behind Student Image */}
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-300/30 via-violet-200/25 to-indigo-100/30 blur-2xl transform scale-95 pointer-events-none"
                aria-hidden="true"
              />

              {/* Student Editorial Visual Container */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-white bg-slate-100 shadow-xl ring-1 ring-slate-200/70 aspect-[4/3] sm:aspect-[4/3]">
                <img
                  src={heroStudentImg}
                  alt="Karachi student exploring university admission programmes"
                  className="h-full w-full object-cover object-center transform transition-transform duration-700 hover:scale-103"
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Subtle gradient overlay at bottom for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* ========================================================= */}
              {/* FLOATING PANEL 1: Top-Left — Merit Trend Benchmark       */}
              {/* Symmetrically aligned with Panel 2 at -top-4 / -top-5     */}
              {/* ========================================================= */}
              <div className="hidden sm:block absolute -top-4 sm:-top-5 -left-3 sm:-left-8 lg:-left-12 z-20 w-[220px] sm:w-[230px] animate-hero-float-1">
                <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-3 sm:p-3.5 shadow-elevated backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 cursor-default">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-md bg-brand-50 text-brand">
                        <TrendingUp className="h-2.5 w-2.5" />
                      </span>
                      Merit Trend
                    </span>
                    <span className="text-[9px] font-bold text-brand bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                      Benchmark
                    </span>
                  </div>
                  <p className="text-xs font-bold text-navy leading-snug truncate">
                    NED UET Cutoff Range
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 text-slate-600">
                    <span>2024: <strong className="text-navy font-bold">82.4%</strong></span>
                    <span className="text-brand font-bold text-[10px]">Proj: 82–83.5%</span>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* FLOATING PANEL 2: Top-Right — Top Programme Match         */}
              {/* Symmetrically aligned with Panel 1 at -top-4 / -top-5     */}
              {/* ========================================================= */}
              <div className="hidden sm:block absolute -top-4 sm:-top-5 -right-3 sm:-right-8 lg:-right-12 z-20 w-[220px] sm:w-[230px] animate-hero-float-2">
                <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-3 sm:p-3.5 shadow-elevated backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 cursor-default">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                        <Sparkles className="h-2.5 w-2.5" />
                      </span>
                      #1 Top Match
                    </span>
                    <Badge variant="success" className="text-[9px] px-1.5 py-0.5 h-auto font-semibold">
                      Target (94%)
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-navy leading-snug truncate">
                    NED UET — BS CS
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 text-slate-600">
                    <span>Est: <strong className="text-navy font-bold">84.2%</strong></span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px]">
                      <TrendingUp className="h-3 w-3" />
                      +1.8% delta
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* FLOATING PANEL 3: Bottom-Left — AI Advisor Cited Rule     */}
              {/* Symmetrically aligned with Panel 4 at -bottom-4 / -bottom-5 */}
              {/* ========================================================= */}
              <div className="hidden sm:block absolute -bottom-4 sm:-bottom-5 -left-3 sm:-left-8 lg:-left-12 z-20 w-[220px] sm:w-[230px] animate-hero-float-3">
                <div className="rounded-2xl border border-brand-200/90 bg-white/95 p-3 sm:p-3.5 shadow-elevated backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-300 cursor-default">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-md bg-brand text-white">
                        <Bot className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-[10px] font-bold text-navy">
                        UniRaah AI Advisor
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-snug line-clamp-2">
                    "Pre-Med students eligible for BSCS with deficiency math."
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 text-slate-400">
                    <span className="truncate">NED Gazette 2024</span>
                    <span className="text-brand font-semibold text-[9px] shrink-0">HEC Policy</span>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* FLOATING PANEL 4: Bottom-Right — Campus & Fee Proximity   */}
              {/* Symmetrically aligned with Panel 3 at -bottom-4 / -bottom-5 */}
              {/* ========================================================= */}
              <div className="hidden sm:block absolute -bottom-4 sm:-bottom-5 -right-3 sm:-right-8 lg:-right-12 z-20 w-[220px] sm:w-[230px] animate-hero-float-4">
                <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-3 sm:p-3.5 shadow-elevated backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 cursor-default">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                        <MapPin className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-[10px] font-bold text-navy truncate">
                        Gulshan Campus
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-brand bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200 shrink-0">
                      8.4 km away
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="flex items-center gap-1 text-slate-600 text-[10px]">
                      <Coins className="h-3 w-3 text-amber-500" />
                      Annual Tuition:
                    </span>
                    <span className="font-bold text-navy text-xs">PKR 82k / Yr</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 text-slate-400">
                    <span className="truncate">University Road</span>
                    <span className="text-emerald-600 font-semibold text-[9px] shrink-0">Subsidized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile / Responsive Fallback Cards (Stacked Underneath Image) */}
            <div className="grid grid-cols-1 sm:hidden gap-3 w-full mt-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    Top Match Preview
                  </span>
                  <span className="font-bold text-navy">NED UET — BS Computer Science</span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  Target (94%)
                </Badge>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    Merit Cutoff Benchmark
                  </span>
                  <span className="font-bold text-navy">2024: 82.4% • 2025: 82.0%–83.5%</span>
                </div>
                <span className="text-[10px] font-bold text-brand bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                  Verified
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>8.4 km from Gulshan</span>
                </div>
                <div className="font-bold text-navy">PKR 82,000 / Yr</div>
              </div>

              <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-2.5 text-[11px] text-slate-700 flex items-center gap-2">
                <Bot className="h-4 w-4 text-brand shrink-0" />
                <span>AI Advisor grounded in official university prospectuses & syndicate gazettes.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer / Mock Data Label */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-[11px] text-slate-400">
            Visual panels display illustrative student scenarios. Actual recommendations calibrate dynamically from your entered marks, budget, and neighborhood.
          </p>
        </div>
      </div>
    </section>
  )
}
