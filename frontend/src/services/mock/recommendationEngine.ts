import { StudentAcademicProfile, RecommendationPriorities } from '@/types/student'
import { Programme } from '@/types/programme'
import { ProgrammeRecommendation, MatchCategory, RecommendationScoreBreakdown } from '@/types/admission'
import { mockCutoffs } from '@/data/mock/cutoffs'
import { calculateKarachiDistanceKm, calculateDistanceScore } from './distanceService'

export interface EvaluateRecommendationsOptions {
  customPriorities?: RecommendationPriorities
}

export function evaluateStudentRecommendations(
  profile: StudentAcademicProfile,
  programmes: Programme[],
  options?: EvaluateRecommendationsOptions
): ProgrammeRecommendation[] {
  const recommendations: ProgrammeRecommendation[] = []

  const activePriorities: RecommendationPriorities = options?.customPriorities ||
    profile.preferences.priorities || {
      merit: 50,
      affordability: 30,
      distance: 20,
    }

  for (const programme of programmes) {
    const cutoff = mockCutoffs.find((c) => c.programmeId === programme.id)
    const targetCutoff = cutoff
      ? cutoff.predictedCutoffRange.projectedAggregate
      : programme.minHscPercentage + 15

    // 1. Academic Eligibility Check
    const isGroupEligible = programme.eligibleHSCGroups.includes(profile.hscGroup)
    const meetsPercentageThreshold = profile.hscPart1Percentage >= programme.minHscPercentage
    const meetsMinimumEligibility = isGroupEligible && meetsPercentageThreshold

    const eligibilityNotes: string[] = []
    if (!isGroupEligible) {
      eligibilityNotes.push(`Requires HSC in: ${programme.eligibleHSCGroups.join(', ')}`)
    }
    if (!meetsPercentageThreshold) {
      eligibilityNotes.push(
        `Requires minimum ${programme.minHscPercentage}% HSC Part-1 (Your score: ${profile.hscPart1Percentage.toFixed(1)}%)`
      )
    }
    if (profile.hscGroup === 'Pre-Medical' && programme.discipline.includes('Computer Science')) {
      eligibilityNotes.push(
        'HEC Regulation: Pre-Medical students must pass deficiency mathematics courses in 1st year'
      )
    }

    // 2. Projected Student Admission Aggregate Calculation
    const expectedTestScore = profile.hscTotalPredictedPercentage
    const hscWeight = programme.testWeightage.hscPercentage / 100
    const testWeight = programme.testWeightage.entryTestPercentage / 100
    const sscWeight = (programme.testWeightage.sscPercentage || 0) / 100

    const estimatedAggregate = Number(
      (
        profile.hscTotalPredictedPercentage * hscWeight +
        expectedTestScore * testWeight +
        profile.sscPercentage * sscWeight
      ).toFixed(2)
    )

    const aggregateDelta = Number((estimatedAggregate - targetCutoff).toFixed(2))

    // 3. Merit Score Calculation (0 - 100)
    let meritScore = 50
    let matchCategory: MatchCategory = 'Target'

    if (!meetsMinimumEligibility) {
      matchCategory = 'Reach'
      meritScore = !isGroupEligible ? 20 : 30
    } else if (aggregateDelta >= 2.5) {
      matchCategory = 'Safety'
      meritScore = Math.min(98, Math.round(85 + aggregateDelta * 2.5))
    } else if (aggregateDelta >= -2.5) {
      matchCategory = 'Target'
      meritScore = Math.round(72 + aggregateDelta * 4)
    } else {
      matchCategory = 'Reach'
      meritScore = Math.max(35, Math.round(55 + aggregateDelta * 3))
    }

    // 4. Affordability Score Calculation (0 - 100)
    const isSemesterBudget = profile.preferences.budgetPeriod === 'semester'
    const studentBudget = profile.preferences.maxAnnualBudgetPKR > 0
      ? profile.preferences.maxAnnualBudgetPKR
      : 500000

    const semesterFee = programme.semesterTuitionFeePKR ?? Math.round(programme.annualTuitionFeePKR / 2)
    const programmeFeeToCompare = isSemesterBudget
      ? semesterFee
      : programme.annualTuitionFeePKR

    let affordabilityScore = 75
    if (studentBudget > 0) {
      const budgetRatio = programmeFeeToCompare / studentBudget
      if (budgetRatio <= 0.5) {
        affordabilityScore = 100
      } else if (budgetRatio <= 0.85) {
        affordabilityScore = 94
      } else if (budgetRatio <= 1.0) {
        affordabilityScore = 85
      } else if (budgetRatio <= 1.25) {
        affordabilityScore = 65
      } else if (budgetRatio <= 1.5) {
        affordabilityScore = 48
      } else {
        affordabilityScore = Math.max(15, Math.round(100 - budgetRatio * 35))
      }
    }

    // 5. Distance & Proximity Score Calculation
    const distanceKm = calculateKarachiDistanceKm(
      profile.preferences.homeLocation,
      programme.campusZone || 'University Road Corridor'
    )
    const distanceScore = calculateDistanceScore(distanceKm)

    // 6. Weighted Recommendation Score (0 - 100)
    // Normalized dynamically: if distance is unavailable, its weight is gracefully redistributed
    const meritWeight = Math.max(0, activePriorities.merit)
    const affordWeight = Math.max(0, activePriorities.affordability)
    const distWeight = distanceScore !== null ? Math.max(0, activePriorities.distance) : 0
    const totalEffectiveWeight = meritWeight + affordWeight + distWeight

    let recommendationScore = 50
    if (totalEffectiveWeight > 0) {
      const weightedSum =
        meritScore * meritWeight +
        affordabilityScore * affordWeight +
        (distanceScore !== null ? distanceScore * distWeight : 0)

      recommendationScore = Math.min(99, Math.max(10, Math.round(weightedSum / totalEffectiveWeight)))
    }

    // If student is completely ineligible for group, cap score
    if (!isGroupEligible) {
      recommendationScore = Math.min(35, recommendationScore)
    }

    // 7. Human-Understandable Score Explanation
    const explanationParts: string[] = []
    explanationParts.push(
      `Academic Fit: ${meritScore}/100 (${
        aggregateDelta >= 0
          ? `+${aggregateDelta.toFixed(1)}% above projected cutoff`
          : `${Math.abs(aggregateDelta).toFixed(1)}% below projected cutoff`
      })`
    )
    explanationParts.push(
      `Affordability: ${affordabilityScore}/100 (${
        programmeFeeToCompare <= studentBudget
          ? 'within specified budget'
          : 'exceeds specified budget'
      })`
    )
    if (distanceScore !== null && distanceKm !== null) {
      explanationParts.push(
        `Transit Proximity: ${distanceScore}/100 (~${distanceKm} km from ${profile.preferences.homeLocation})`
      )
    } else {
      explanationParts.push('Transit Proximity: Location not specified (weight redistributed to merit & fee)')
    }

    const scoreBreakdown: RecommendationScoreBreakdown = {
      meritScore,
      affordabilityScore,
      distanceScore,
      explanation: explanationParts.join(' • '),
    }

    recommendations.push({
      programme,
      matchCategory,
      recommendationScore,
      scoreBreakdown,
      distanceKm,
      studentEstimatedAggregate: estimatedAggregate,
      targetClosingCutoff: targetCutoff,
      aggregateDelta,
      meetsMinimumEligibility,
      eligibilityNotes,
      admissionProbabilityPercentage: recommendationScore, // backward-compat if needed
    })
  }

  // Sort: Eligible first, then descending by recommendation score
  return recommendations.sort((a, b) => {
    if (a.meetsMinimumEligibility && !b.meetsMinimumEligibility) return -1
    if (!a.meetsMinimumEligibility && b.meetsMinimumEligibility) return 1
    return b.recommendationScore - a.recommendationScore
  })
}
