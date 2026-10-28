import { Programme } from './programme'

export type MatchCategory = 'Safety' | 'Target' | 'Reach'

export interface HistoricalCutoff {
  year: number
  closingAggregate: number // e.g. 78.4
  openMeritClosingRank?: number
  seatsFilled: number
}

export interface RecommendationScoreBreakdown {
  meritScore: number // 0-100
  affordabilityScore: number // 0-100
  distanceScore: number | null // 0-100 or null if location not specified
  explanation: string
}

export interface CutoffPrediction {
  programmeId: string
  programmeName: string
  universityName: string
  universityShortName: string
  historicalCutoffs: HistoricalCutoff[]
  predictedCutoffRange: {
    min: number
    max: number
    projectedAggregate: number
  }
  admissionCycleContext: string // e.g. "Fall 2025 Admissions Cycle"
  disclaimer: string // Non-guarantee statistical estimate disclaimer
  meritFormulaDescription: string
  lastUpdatedYear: number
  /** Optional backward-compatibility field for admin panels */
  confidenceLevel?: 'High' | 'Medium' | 'Low'
}

export interface ProgrammeRecommendation {
  programme: Programme
  matchCategory: MatchCategory
  recommendationScore: number // 0-100 composite recommendation index
  scoreBreakdown: RecommendationScoreBreakdown
  distanceKm: number | null // in km, or null if distance incalculable
  studentEstimatedAggregate: number
  targetClosingCutoff: number
  aggregateDelta: number // positive means student exceeds cutoff
  meetsMinimumEligibility: boolean
  eligibilityNotes: string[]
  /** Optional backward-compatibility field */
  admissionProbabilityPercentage?: number
}
