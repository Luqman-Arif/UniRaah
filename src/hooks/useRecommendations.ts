import { useMemo } from 'react'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useProgrammes } from '@/hooks/useProgrammes'
import { evaluateStudentRecommendations } from '@/services/mock/recommendationEngine'
import { ProgrammeRecommendation } from '@/types/admission'
import { RecommendationPriorities } from '@/types/student'

export interface UseRecommendationsOptions {
  customPriorities?: RecommendationPriorities
}

export function useRecommendations(options?: UseRecommendationsOptions) {
  const { profile } = useStudentProfile()
  const { programmes, isLoading, error } = useProgrammes()

  const customPriorities = options?.customPriorities

  const recommendations = useMemo<ProgrammeRecommendation[]>(() => {
    if (!programmes.length) return []
    return evaluateStudentRecommendations(profile, programmes, { customPriorities })
  }, [profile, programmes, customPriorities])

  const categorized = useMemo(() => {
    return {
      safety: recommendations.filter((r) => r.matchCategory === 'Safety'),
      target: recommendations.filter((r) => r.matchCategory === 'Target'),
      reach: recommendations.filter((r) => r.matchCategory === 'Reach'),
    }
  }, [recommendations])

  return {
    recommendations,
    categorized,
    isLoading,
    error,
    studentProfile: profile,
  }
}
