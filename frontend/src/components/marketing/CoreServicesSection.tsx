import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Compass,
  TrendingUp,
  BotMessageSquare,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  ShieldCheck,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react'

export const CoreServicesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50/60 border-b border-border/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="text-xs font-bold text-brand-700 bg-brand-50 border-brand-200"
          >
            Core Decision Suite
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            Engineered Specifically for Karachi Undergraduate Admissions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Four specialized services designed to replace informal advice with structured academic evaluation, multi-year closing data, and official documentation.
          </p>
        </div>

        {/* ==================================================================== */}
        {/* SERVICE A: Personalized Programme Recommendations (Text Left, Card Right) */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-xs">
              <Compass className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Service A • Academic Matching
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                Personalized Programme Recommendations
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              UniRaah checks departmental prerequisite rules for your specific intermediate group (Pre-Engineering, Pre-Medical, ICS, or General Science) and calculates a composite recommendation score balancing merit suitability, family tuition limits, and campus commute distance.
            </p>
            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Degrees categorized into clear Safety, Target, and Reach tiers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Departmental test formulas (e.g. 50% test + 50% HSC) applied transparently.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Accounts for HEC deficiency mathematics requirements for Pre-Medical students.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/discover">
                <Button className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs">
                  <span>Start Recommendation Discovery</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual A: Compact Ranked Programme Mock List */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-subtle space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-navy">Sample Ranked Output (Illustrative)</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Pre-Engineering • 82.5%</span>
              </div>

              {/* Sample Programme Card 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 hover:border-brand-200 hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-brand" /> NED UET • Public
                    </span>
                    <h4 className="text-sm font-bold text-navy mt-0.5">BS Computer Science</h4>
                  </div>
                  <Badge variant="warning" className="text-[10px] px-2 py-0.5">
                    Target Match (94%)
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <span>Est. Aggregate: <strong className="text-navy">84.2%</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>PKR 98,000 / Yr</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-brand font-semibold">8.4 km away</span>
                </div>
              </div>

              {/* Sample Programme Card 2 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 hover:border-brand-200 hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-brand" /> KU (UBIT) • Public
                    </span>
                    <h4 className="text-sm font-bold text-navy mt-0.5">BS Software Engineering</h4>
                  </div>
                  <Badge variant="success" className="text-[10px] px-2 py-0.5">
                    Safety Match (98%)
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <span>Est. Aggregate: <strong className="text-navy">84.2%</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>PKR 76,000 / Yr</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-brand font-semibold">7.5 km away</span>
                </div>
              </div>

              {/* Sample Programme Card 3 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 hover:border-brand-200 hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-brand" /> FAST-NUCES • Semi-Gov
                    </span>
                    <h4 className="text-sm font-bold text-navy mt-0.5">BS Artificial Intelligence</h4>
                  </div>
                  <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                    Reach Match (86%)
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <span>Est. Aggregate: <strong className="text-navy">84.2%</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>PKR 340,000 / Yr</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-brand font-semibold">17.5 km away</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                Illustrative example data. Scores recalculate dynamically based on your submitted marks.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SERVICE B: Admission Cutoff Insights (Visual Left, Text Right)       */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual B: Tasteful Cutoff Trajectory Chart */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-subtle space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Historical Cutoff Analytics
                  </span>
                  <h4 className="text-sm font-bold text-navy">NED UET — BS Computer Science</h4>
                </div>
                <Badge variant="outline" className="text-[10px] text-brand border-brand-200 bg-brand-50">
                  4-Year Trajectory
                </Badge>
              </div>

              {/* Illustrated Multi-Year Cutoff Bar Graph */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>2021 Closing Aggregate</span>
                    <span>84.1%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-300 rounded-full" style={{ width: '84.1%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>2022 Closing Aggregate</span>
                    <span>86.4%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: '86.4%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>2023 Closing Aggregate</span>
                    <span>88.2%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '88.2%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>2024 Closing Aggregate</span>
                    <span>89.5%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: '89.5%' }} />
                  </div>
                </div>

                {/* 2025 Projected Corridor */}
                <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-3 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-brand" />
                      2025 Projected Cutoff Range:
                    </span>
                    <strong className="text-brand font-extrabold">88.8% – 90.6%</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Expected threshold: ~89.8%. Projected based on cohort shifts and seat matrices.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Estimates for academic planning only. Admission outcomes depend strictly on official merit gazettes.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Service B • Merit Analytics
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                Admission Cutoff Trends & Historical Trajectories
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Evaluating current year competition without historical context leads to costly misjudgments. UniRaah indexes four consecutive years of verified closing lists (2021–2024) and projects statistical 2025 cutoff ranges for both morning open-merit and evening shifts.
            </p>
            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Multi-year aggregate trends across Engineering, Computing, and Medicine.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Distinguishes morning merit from subsidized self-finance evening shifts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clear disclaimers highlighting that projections are benchmarks, not guarantees.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/programmes/ned-cs/prediction">
                <Button variant="outline" className="gap-2 font-bold border-slate-300 text-slate-700 hover:text-navy">
                  <span>Explore Cutoff Trajectory Analytics</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SERVICE C: AI Admission Advisor (Text Left, Card Right)              */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-xs">
              <BotMessageSquare className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Service C • Policy Intelligence
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                AI Admission Advisor Grounded in Official Documents
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Navigating intermediate transitions in Karachi is full of conflicting rumors. UniRaah’s Admission Advisor answers policy queries using retrieved official prospectuses and syndicate gazettes, providing visible source references with every response.
            </p>
            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Answers questions on Pre-Medical transition into BS Computer Science.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Explains university-specific formula weights (NED, FAST, KU UBIT, IBA).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Explicitly reports insufficient evidence if official published text is missing.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/advisor">
                <Button className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs">
                  <span>Open AI Admission Advisor</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual C: Sample Conversation Card with Cited Reference */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-navy">Advisor Consultation Preview</span>
                </div>
                <Badge variant="secondary" className="text-[10px] text-slate-600 bg-slate-100">
                  Demonstration Mode
                </Badge>
              </div>

              {/* User Question Bubble */}
              <div className="rounded-2xl bg-brand-50 border border-brand-100 p-3.5 text-xs text-navy space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  Student Query
                </span>
                <p className="font-semibold">
                  "Can I transition from Pre-Medical into BS Computer Science at NED UET, and what is the mathematics requirement?"
                </p>
              </div>

              {/* Advisor Response Bubble */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Advisor Response (Verified Official Policy)
                </span>
                <p className="leading-relaxed">
                  Yes. Under current Higher Education Commission (HEC) and NED University syndicate regulations, students who completed intermediate in the <strong>Pre-Medical</strong> group are eligible for admission to BS Computer Science, BS Software Engineering, and BS Data Science.
                </p>
                <p className="leading-relaxed">
                  Admitted students are required to pass two non-credit remedial deficiency mathematics courses within their first year of undergraduate study.
                </p>

                {/* Visible Supporting Citation */}
                <div className="mt-3 rounded-xl bg-white border border-slate-200 p-2.5 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-brand" />
                    Cited Source: NED Undergraduate Prospectus 2024–25
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Section 4.2: Department of Computer Science & Information Technology (p. 52)
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Interactive demonstration powered by our deterministic intermediate policy knowledgebase.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SERVICE D: Fee & Location Comparison (Visual Left, Text Right)       */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual D: Clean Fee & Distance Comparison Panel */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-subtle space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Neighborhood Proximity Comparison
                  </span>
                  <h4 className="text-sm font-bold text-navy">Origin: Gulshan-e-Iqbal, Karachi</h4>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                  Transit Matrix
                </Badge>
              </div>

              {/* Comparison Rows */}
              <div className="space-y-2.5">
                {/* Row 1: NED UET */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy block">NED UET</span>
                    <span className="text-[10px] text-slate-400">University Road Corridor • Public</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy block">PKR 98,000 / Yr</span>
                    <span className="text-[10px] text-brand font-semibold flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" /> 2.5 km away
                    </span>
                  </div>
                </div>

                {/* Row 2: KU UBIT */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy block">University of Karachi (UBIT)</span>
                    <span className="text-[10px] text-slate-400">Main Campus • Public</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy block">PKR 76,000 / Yr</span>
                    <span className="text-[10px] text-brand font-semibold flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" /> 3.8 km away
                    </span>
                  </div>
                </div>

                {/* Row 3: FAST Karachi */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy block">FAST-NUCES Karachi</span>
                    <span className="text-[10px] text-slate-400">National Highway / Malir • Semi-Gov</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy block">PKR 340,000 / Yr</span>
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" /> 17.5 km away
                    </span>
                  </div>
                </div>

                {/* Row 4: Habib University */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy block">Habib University</span>
                    <span className="text-[10px] text-slate-400">Gulistan-e-Jauhar • Private</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy block">PKR 1,180,000 / Yr</span>
                    <span className="text-[10px] text-brand font-semibold flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" /> 5.8 km away
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Billing: Explicit Annual & Per-Semester Schedules</span>
                <span>Fixed Matrix Distances</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Service D • Logistics & Affordability
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                Tuition Transparency & Transit Proximity
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              In Karachi, an acceptance letter is only viable if tuition fits your household budget and the daily commute is sustainable. UniRaah evaluates both factors side by side with academic eligibility.
            </p>
            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clearly displays both Annual and Per-Semester tuition dues.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pre-calibrated distance matrix covering 12 Karachi residential zones.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Helps families avoid unviable 2-hour commutes across Karachi traffic corridors.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/discover/preferences">
                <Button variant="outline" className="gap-2 font-bold border-slate-300 text-slate-700 hover:text-navy">
                  <span>Calibrate Your Budget & Area</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
