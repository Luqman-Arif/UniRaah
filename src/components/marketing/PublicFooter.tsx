import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'

export const PublicFooter: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate(`/${hash}`)
      return
    }
    const target = document.getElementById(hash.replace('#', ''))
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
    <footer className="border-t border-border bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-navy">
                  Uni<span className="text-brand">Raah</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded">
                  Karachi HSC
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              UniRaah is an independent admission decision-support platform designed specifically for Higher Secondary Certificate (HSC) students in Karachi, Pakistan.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Grounded in Syndicate-Approved Publications</span>
            </div>
          </div>

          {/* Column 2: Platform Exploration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              Student Platform
            </h4>
            <ul className="space-y-2.5 text-slate-500">
              <li>
                <Link to="/discover" className="hover:text-brand transition-colors">
                  Academic Profiling
                </Link>
              </li>
              <li>
                <Link to="/discover/preferences" className="hover:text-brand transition-colors">
                  Preferences & Budget
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-brand transition-colors">
                  Ranked Recommendations
                </Link>
              </li>
              <li>
                <Link to="/programmes/ned-cs/prediction" className="hover:text-brand transition-colors">
                  Cutoff Trajectories
                </Link>
              </li>
              <li>
                <Link to="/advisor" className="hover:text-brand transition-colors">
                  AI Admission Advisor
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand transition-colors font-medium text-slate-700">
                  Sign In / Demo Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Homepage Navigation Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              Overview & Guide
            </h4>
            <ul className="space-y-2.5 text-slate-500">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, '#features')}
                  className="hover:text-brand transition-colors"
                >
                  Decision Dimensions
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                  className="hover:text-brand transition-colors"
                >
                  3-Step Process
                </a>
              </li>
              <li>
                <a
                  href="#showcase"
                  onClick={(e) => handleAnchorClick(e, '#showcase')}
                  className="hover:text-brand transition-colors"
                >
                  Interface Preview
                </a>
              </li>
              <li>
                <a
                  href="#transparency"
                  onClick={(e) => handleAnchorClick(e, '#transparency')}
                  className="hover:text-brand transition-colors"
                >
                  Data Transparency
                </a>
              </li>
              <li>
                <a
                  href="#advisor-preview"
                  onClick={(e) => handleAnchorClick(e, '#advisor-preview')}
                  className="hover:text-brand transition-colors"
                >
                  AI Advisor Preview
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleAnchorClick(e, '#faq')}
                  className="hover:text-brand transition-colors"
                >
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Scope & Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              Monitored Scope
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Initial scope covers ~15–20 universities across Karachi, including NED UET, FAST-NUCES, KU (UBIT), IBA Karachi, DUHS, Habib University, SSUET, and Dawood UET.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-navy transition-colors bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
              >
                <span>Institutional Admin Portal</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Prediction Disclaimer & Bottom Legal Strip */}
        <div className="pt-8 border-t border-slate-100 space-y-4 text-[11px] text-slate-500">
          <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-3.5 leading-relaxed text-slate-500">
            <strong className="text-navy font-semibold">Admissions Disclaimer:</strong> UniRaah is an independent educational decision-support tool. Admission cutoffs, aggregate calculations, and degree recommendations are statistical planning benchmarks derived from historical published lists and do not constitute an official admission guarantee. Final admission offers and merit lists are issued solely by respective university syndicates.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
            <p>© {currentYear} UniRaah. Higher Secondary Decision Support for Karachi, Pakistan.</p>
            <p>Designed for intermediate students across BIEK, FBISE, AKU-EB, and Cambridge.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
