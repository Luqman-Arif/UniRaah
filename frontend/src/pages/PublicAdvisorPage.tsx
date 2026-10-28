import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AdmissionAdvisorChat } from '@/features/advisor/AdmissionAdvisorChat'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Bot,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Scale,
  DollarSign,
  Building2,
  CheckCircle2,
} from 'lucide-react'

export const PublicAdvisorPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="bg-page min-h-screen pb-16">
      {/* Top Banner / Breadcrumbs Bar */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-slate-500 hover:text-navy transition-colors font-medium hover:underline"
            >
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-navy flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-brand" />
              AI Admission Advisor
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/student/advisor"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors border border-brand-200/60"
              >
                <span>Open in Student Cockpit</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>Open Public Consultation • Free Access</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Page Hero Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span>Karachi Higher Secondary Admission Intelligence</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight">
                AI Admission Decision Advisor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1.5 leading-relaxed">
                Context-aware guidance on Karachi board policies (BIEK & FBISE), pre-medical computing eligibility, entry test weightages, and multi-year cutoff benchmarks — verified directly against official university prospectuses.
              </p>
            </div>

            {/* Quick stats / verified sources indicator */}
            <div className="flex items-center gap-2 self-center sm:self-auto shrink-0 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-2xs">
              <Building2 className="h-4 w-4 text-brand shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold text-navy block leading-none">
                  6 Karachi Universities
                </span>
                <span className="text-[10px] text-slate-400">Indexed from official prospectuses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authenticated user sync notice if logged in */}
        {isAuthenticated && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-brand-50 via-indigo-50/40 to-slate-50 border border-brand-200/80 text-xs text-navy">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
              <span>
                Signed in as <strong>{user?.fullName || 'Verified Candidate'}</strong> ({user?.hscGroup || 'Karachi Student'} • {user?.board || 'BIEK'}). You can also access this advisor directly in your personal student dashboard cockpit.
              </span>
            </div>
            <Link
              to="/student/advisor"
              className="text-xs font-bold text-brand hover:text-brand-800 hover:underline shrink-0 ml-3"
            >
              Dashboard View →
            </Link>
          </div>
        )}

        {/* Main Advisory Chat Component */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1">
          <AdmissionAdvisorChat />
        </div>

        {/* Informational Guidance Cards: Knowledgebase Scope */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider">
              Advisory Knowledgebase Coverage
            </h2>
            <span className="text-xs text-slate-400">Official Karachi Admission Benchmarks</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Card 1: Pre-Med to Computing */}
            <Card className="border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center mb-2">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <CardTitle className="text-xs font-bold text-navy">
                  Pre-Medical Computing Transition
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-xs text-slate-600 leading-relaxed">
                HEC policy permits Pre-Med students to pursue BS CS and Software Engineering provided they complete 6 credit hours of deficiency mathematics during the first year of studies.
              </CardContent>
            </Card>

            {/* Card 2: Entry Test & Aggregate Formulas */}
            <Card className="border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
                  <Scale className="h-4 w-4" />
                </div>
                <CardTitle className="text-xs font-bold text-navy">
                  Entry Test Weightage Formulas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-xs text-slate-600 leading-relaxed">
                Verified merit calculations: NED UET (50% HSC-1 + 50% Test), FAST-NUCES (50% Test + 40% HSC + 10% SSC for NU Test), and UBIT Karachi (HSC marks formula).
              </CardContent>
            </Card>

            {/* Card 3: Fee Structures & Scholarships */}
            <Card className="border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                  <DollarSign className="h-4 w-4" />
                </div>
                <CardTitle className="text-xs font-bold text-navy">
                  Subsidized vs Private Tuition
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-xs text-slate-600 leading-relaxed">
                Public universities like NED and KU charge subsidized annual tuition (~PKR 82k-95k/yr), while private universities offer HEC Need-Based & Sindh Endowment scholarships.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
