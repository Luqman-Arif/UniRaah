import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is UniRaah?',
    answer:
      'UniRaah is an independent admission decision-support platform designed specifically for Higher Secondary Certificate (HSC) students in Karachi, Pakistan. It brings together academic eligibility validation, multi-year closing merit cutoffs, tuition transparency, residential commute calculations, and retrieval-grounded AI advice into one clear tool.',
  },
  {
    id: 'faq-2',
    question: 'Which students is UniRaah designed for?',
    answer:
      'UniRaah is tailored for intermediate students and families in Karachi evaluating undergraduate degree options. Whether you completed intermediate through Pre-Engineering, Pre-Medical, Computer Science (ICS), General Science, or Commerce, UniRaah helps you discover qualifying programmes and plan your application strategy.',
  },
  {
    id: 'faq-3',
    question: 'Which educational boards are currently supported?',
    answer:
      'The platform natively supports students from the Board of Intermediate Education Karachi (BIEK) and the Federal Board of Intermediate & Secondary Education (FBISE). It also accommodates students from the Aga Khan University Examination Board (AKU-EB) and Cambridge A-Levels equivalence.',
  },
  {
    id: 'faq-4',
    question: 'How are degree programmes recommended?',
    answer:
      'UniRaah first applies strict statutory eligibility criteria (verifying intermediate group compatibility, minimum percentage cutoffs, and regulatory requirements from HEC, PEC, and NCEAC). Qualifying programmes are then ranked by combining your estimated admission aggregate delta, family tuition budget ceiling, and transit distance from your Karachi neighborhood.',
  },
  {
    id: 'faq-5',
    question: 'Are cutoff predictions guaranteed admission outcomes?',
    answer:
      'No. Cutoff projections are statistical planning benchmarks derived from 2021–2024 published closing lists and cohort test performance. They are provided with an expected range to help families evaluate whether a degree is a Safety, Target, or Reach option. Official admission lists are determined exclusively by university syndicates.',
  },
  {
    id: 'faq-6',
    question: 'Where does the admission information come from?',
    answer:
      'Every test weightage formula, seat quota, and tuition schedule is retrieved from official published university prospectuses, syndicate gazettes, and approved institutional fee circulars. UniRaah does not use unverified hearsay or unofficial forum posts.',
  },
  {
    id: 'faq-7',
    question: 'How does the AI Admission Advisor provide its answers?',
    answer:
      'The advisor utilizes retrieval-grounded search over our repository of official Karachi university documents. When responding, it cites the exact document title and section. If the required information is not available in published records, it explicitly states that evidence is insufficient rather than generating an unverified guess.',
  },
  {
    id: 'faq-8',
    question: 'Which Karachi universities are included in the scope?',
    answer:
      'The initial scope covers approximately 15–20 universities across Karachi, including premier public, semi-government, and private institutions such as NED University (NED UET), FAST-NUCES Karachi, University of Karachi (UBIT), Institute of Business Administration (IBA), Dow University of Health Sciences (DUHS), Habib University, Sir Syed University (SSUET), and Dawood UET.',
  },
]

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1'])

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    if (openIds.length === faqData.length) {
      setOpenIds([])
    } else {
      setOpenIds(faqData.map((item) => item.id))
    }
  }

  const allOpen = openIds.length === faqData.length

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white border-b border-border/80 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <Badge
            variant="outline"
            className="text-xs font-bold text-slate-700 bg-slate-100 border-slate-200"
          >
            Admissions Clarity
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-navy">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Essential answers regarding Karachi intermediate admissions, supported boards, cutoff methodology, and data sources.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center justify-between px-1 text-xs text-slate-500">
          <span>8 Documented Admission Queries</span>
          <button
            type="button"
            onClick={handleToggleAll}
            className="font-semibold text-brand hover:text-brand-700 transition-colors cursor-pointer select-none px-2 py-1 rounded-md hover:bg-brand-50"
          >
            {allOpen ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqData.map((item) => {
            const isOpen = openIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-brand-200 bg-brand-50/25 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  id={`faq-question-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-navy hover:text-brand transition-colors cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand rounded-2xl"
                >
                  <span className="text-sm sm:text-base pr-4 flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-brand shrink-0" />
                    {item.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-brand text-white border-brand'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Accessible Animated Accordion Body using CSS Grid */}
                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
