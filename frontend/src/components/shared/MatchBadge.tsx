import React from 'react'
import { MatchCategory } from '@/types/admission'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Target, Compass } from 'lucide-react'

interface MatchBadgeProps {
  category: MatchCategory
  score?: number
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ category, score }) => {
  switch (category) {
    case 'Safety':
      return (
        <Badge variant="safety" className="gap-1 border border-emerald-300 font-semibold">
          <ShieldCheck className="h-3 w-3 text-emerald-700" />
          <span>Safety Match</span>
          {score !== undefined && <span className="opacity-90">({score}/100)</span>}
        </Badge>
      )
    case 'Target':
      return (
        <Badge variant="target" className="gap-1 border border-amber-300 font-semibold">
          <Target className="h-3 w-3 text-amber-800" />
          <span>Target Match</span>
          {score !== undefined && <span className="opacity-90">({score}/100)</span>}
        </Badge>
      )
    case 'Reach':
      return (
        <Badge variant="reach" className="gap-1 border border-rose-300 font-semibold">
          <Compass className="h-3 w-3 text-rose-800" />
          <span>Reach Threshold</span>
          {score !== undefined && <span className="opacity-90">({score}/100)</span>}
        </Badge>
      )
    default:
      return null
  }
}
