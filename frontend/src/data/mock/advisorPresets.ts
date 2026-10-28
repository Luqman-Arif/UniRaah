import { SuggestedPrompt } from '@/types/advisor'

export const mockSuggestedPrompts: SuggestedPrompt[] = [
  {
    id: 'pre-med-cs',
    label: 'Can Pre-Medical students apply for BS Computer Science?',
    prompt: 'Can I apply for BS Computer Science or Software Engineering with an HSC Pre-Medical background in Karachi?',
    category: 'Eligibility Policy',
  },
  {
    id: 'ned-formula',
    label: 'How is the NED admission aggregate formula calculated?',
    prompt: 'What is the official merit aggregate formula for NED University of Engineering & Technology?',
    category: 'Merit Formulas',
  },
  {
    id: 'ned-vs-fast',
    label: 'Compare NED UET and FAST-NUCES Karachi for CS',
    prompt: 'Compare NED UET and FAST-NUCES Karachi in terms of admission formula, tuition fees, and degree reputation.',
    category: 'Comparative Analysis',
  },
  {
    id: 'affordable-cs',
    label: 'Affordable computing degrees in Karachi under 150k/year',
    prompt: 'Which universities in Karachi offer accredited BS Computer Science or Software Engineering with tuition under 150,000 PKR annually?',
    category: 'Affordability & Fees',
  },
  {
    id: 'insufficient-evidence-demo',
    label: 'Will admission cutoffs drop significantly this year?',
    prompt: 'Will university admission merit drop by 15% across Karachi engineering institutions this session?',
    category: 'Insufficient Evidence Test',
  },
]
