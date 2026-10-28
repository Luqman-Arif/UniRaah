export type HSCGroup =
  | 'Pre-Engineering'
  | 'Pre-Medical'
  | 'Computer Science'
  | 'General Science'
  | 'Commerce'
  | 'Arts & Humanities'

export type ExaminationBoard =
  | 'Board of Intermediate Education Karachi (BIEK)'
  | 'Federal Board of Intermediate & Secondary Education (FBISE)'
  | 'Aga Khan University Examination Board (AKU-EB)'
  | 'Cambridge International (A-Levels)'
  | 'Sindh Board'

export type DisciplinePreference =
  | 'Computer Science & AI'
  | 'Software Engineering'
  | 'Electrical & Mechanical Engineering'
  | 'Business Administration & Management'
  | 'Medicine & Allied Health'
  | 'Data Science & Cyber Security'
  | 'Architecture & Design'

export type UniversitySectorPreference = 'all' | 'public' | 'private' | 'semi-government'

export type ShiftPreference = 'morning' | 'evening' | 'any'

export interface SubjectMarks {
  mathematics?: number
  physics?: number
  chemistry?: number
  computerScience?: number
  biology?: number
}

export type BudgetPeriod = 'annual' | 'semester'

export interface RecommendationPriorities {
  merit: number        // e.g. 50
  affordability: number // e.g. 30
  distance: number     // e.g. 20
}

export interface StudentAcademicProfile {
  fullName: string
  email: string
  hscGroup: HSCGroup
  board: ExaminationBoard
  sscPercentage: number // Matric / O-level %
  hscPart1Percentage: number // First year %
  hscTotalPredictedPercentage: number // Overall predicted / final %
  subjectMarks: SubjectMarks
  preferences: {
    disciplines: DisciplinePreference[]
    maxAnnualBudgetPKR: number
    budgetPeriod: BudgetPeriod
    homeLocation: string // Supported Karachi location or '' if unspecified
    sector: UniversitySectorPreference
    shift: ShiftPreference
    priorities: RecommendationPriorities
  }
}
