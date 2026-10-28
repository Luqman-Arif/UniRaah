import { CutoffPredictionRequest, HSCGroup } from '../types/index.js'

export interface AdmissionPredictionResult {
  programmeId: string
  calculatedAggregate: number
  historicalCutoff: number
  probabilityCategory: 'Safety' | 'Target' | 'Reach'
  deltaPercentage: number
  eligible: boolean
  ineligibilityReason?: string
}

export class AdmissionEngine {
  /**
   * Calculates weighted aggregate merit percentage
   */
  public static calculateAggregate(
    hscPercentage: number,
    entryTestScore: number,
    hscWeight: number,
    entryTestWeight: number,
    sscPercentage: number = 0,
    sscWeight: number = 0
  ): number {
    const aggregate =
      (hscPercentage * hscWeight +
        entryTestScore * entryTestWeight +
        sscPercentage * sscWeight) /
      (hscWeight + entryTestWeight + sscWeight)

    return Math.round(aggregate * 100) / 100
  }

  /**
   * Evaluates admission probability bracket against historical cutoff
   */
  public static evaluateProbability(
    aggregate: number,
    historicalCutoff: number
  ): 'Safety' | 'Target' | 'Reach' {
    const delta = aggregate - historicalCutoff
    if (delta >= 2.5) return 'Safety'
    if (delta >= -2.0) return 'Target'
    return 'Reach'
  }
}
