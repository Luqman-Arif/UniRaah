import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Calendar,
} from 'lucide-react'

export const DataTransparencySection: React.FC = () => {

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-border/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200"
          >
            Data Provenance & Integrity
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            Grounded in Published University Documents
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            UniRaah does not rely on social media claims, unverified forums, or speculative admission advice. Our models are built directly on published syndicate notifications and verified prospectuses.
          </p>
        </div>

        {/* 4 Transparency Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
              <FileCheck2 className="h-5 w-5 text-brand" />
            </div>
            <h3 className="text-sm font-bold text-navy">Published Sources Only</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every formula, test weightage, and group eligibility rule is sourced from official university prospectuses and gazettes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-navy">Cycle-to-Cycle Variance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Historical cutoffs and fee structures reflect specific admission years. Tuition dues can be updated each academic session.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-navy">Retrieved Citations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The AI advisor answers using retrieved official documents. When a document does not contain an answer, it clearly states insufficient evidence.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-navy">No False Guarantees</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cutoff predictions are statistical estimation corridors for planning. University admission boards retain exclusive authority over final merit.
            </p>
          </div>
        </div>       
      </div>
    </section>
  )
}
