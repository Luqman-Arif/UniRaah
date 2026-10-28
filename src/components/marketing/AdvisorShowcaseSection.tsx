import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Bot,
  User,
  Sparkles,
  FileText,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

interface SampleAdvisorQA {
  id: string
  question: string
  answer: string
  sourceDoc: string
  sourceSection: string
  status: 'verified' | 'insufficient_evidence'
}

const sampleQueries: SampleAdvisorQA[] = [
  {
    id: 'pre-med',
    question: 'Can Pre-Medical students apply for BS Computer Science at Karachi University UBIT?',
    answer:
      'Yes. In accordance with Higher Education Commission (HEC) and University of Karachi syndicate guidelines, intermediate Pre-Medical graduates are fully eligible for BS Computer Science and BS Software Engineering. Admitted students must clear two deficiency mathematics courses within their first two semesters.',
    sourceDoc: 'University of Karachi UBIT Admission & Policy Guide 2024–2025',
    sourceSection: 'Section 3.1: Intermediate Group Eligibility & Deficiency Course Framework (p. 18)',
    status: 'verified',
  },
  {
    id: 'ned-aggregate',
    question: 'How does NED UET calculate the final admission aggregate for engineering?',
    answer:
      'NED University computes the undergraduate open-merit aggregate with equal 50/50 weighting: 50% from the NED Pre-Admission Entry Test score and 50% from the HSC Part-1 percentage (or total intermediate percentage if completed). Matriculation marks are not factored into the aggregate formula.',
    sourceDoc: 'NED University Undergraduate Prospectus 2024–2025',
    sourceSection: 'Section 5.3: Admission Merit Formulation and Seat Matrix Rules (p. 64)',
    status: 'verified',
  },
  {
    id: 'insufficient-demo',
    question: 'Does FAST-NUCES Karachi offer dedicated on-campus hostel accommodation for female students?',
    answer:
      'The indexed official FAST-NUCES Karachi Fall 2024 prospectus and fee schedules do not contain verified confirmation regarding on-campus hostel housing for female students. The university administration operates contracted private transport routes, but residential queries must be directed to the student affairs helpline.',
    sourceDoc: 'FAST-NUCES Karachi Undergraduate Admissions Gazette 2024',
    sourceSection: 'Official Housing Records Not Indexed • Administrative Verification Required',
    status: 'insufficient_evidence',
  },
]

export const AdvisorShowcaseSection: React.FC = () => {
  const [activeQueryId, setActiveQueryId] = useState<string>('pre-med')
  const activeQA =
    sampleQueries.find((q) => q.id === activeQueryId) || sampleQueries[0]

  return (
    <section id="advisor-preview" className="py-20 lg:py-28 bg-slate-50/60 border-b border-border/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="text-xs font-bold text-brand-700 bg-brand-50 border-brand-200"
          >
            Retrieval-Grounded Advisory
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            AI Admission Advisor That Cites Official Sources
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Unlike general chat tools that hallucinate outdated eligibility rules, UniRaah’s advisor retrieves answers directly from verified Karachi university documents and explicitly cites its sources.
          </p>
        </div>

        {/* Interactive Showcase Box */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-subtle space-y-8">
          {/* Query Switcher Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Select Sample Admission Question to Inspect Response & Sources:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {sampleQueries.map((q) => {
                const isActive = q.id === activeQueryId
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActiveQueryId(q.id)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-150 border cursor-pointer text-left min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.98] ${
                      isActive
                        ? 'bg-brand text-white border-brand shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-navy hover:border-slate-300'
                    }`}
                  >
                    {q.id === 'pre-med' && 'Pre-Med to CS Policy'}
                    {q.id === 'ned-aggregate' && 'NED Entry Test Formula'}
                    {q.id === 'insufficient-demo' && 'Missing Evidence Demonstration'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conversation Stream Preview */}
          <div className="space-y-4 rounded-2xl bg-slate-50 p-5 sm:p-6 border border-slate-200/80">
            {/* Student Message */}
            <div className="flex items-start gap-3 justify-end">
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-none bg-brand text-white p-4 text-xs sm:text-sm font-medium leading-relaxed shadow-xs">
                {activeQA.question}
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-white text-xs font-bold shadow-2xs">
                <User className="h-4 w-4" />
              </div>
            </div>

            {/* Advisor Message */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand text-white text-xs font-bold shadow-2xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="max-w-[85%] sm:max-w-[85%] space-y-3">
                <div
                  className={`rounded-2xl rounded-tl-none p-4 text-xs sm:text-sm leading-relaxed shadow-xs border ${
                    activeQA.status === 'insufficient_evidence'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <p>{activeQA.answer}</p>
                </div>

                {/* Visible Source Reference Card */}
                <div className="rounded-xl bg-white border border-slate-200 p-3.5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-brand" />
                      Supporting Source Reference
                    </span>
                    {activeQA.status === 'verified' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Grounded in Syndicate Text
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Insufficient Text In Index
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    {activeQA.sourceDoc}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {activeQA.sourceSection}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Try asking your own questions about Karachi admission policies in the dedicated advisor.
            </p>
            <Link to="/advisor">
              <Button className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white shadow-xs w-full sm:w-auto">
                <Sparkles className="h-4 w-4" />
                <span>Open Dedicated AI Advisor</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
