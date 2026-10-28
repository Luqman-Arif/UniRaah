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

export type Sector = 'Public' | 'Private' | 'Semi-Government'

export interface University {
  id: string
  name: string
  shortName: string
  sector: Sector
  address: string
  locationZone: string
  establishedYear: number
  accreditations: string[]
  websiteUrl: string
  admissionsEmail: string
  admissionsHelpline: string
  overview: string
  activeProgrammesCount: number
  status: 'admissions_open' | 'active' | 'upcoming' | 'closed'
}

export interface Programme {
  id: string
  universityId: string
  name: string
  degreeType: string
  discipline: string
  eligibleHscGroups: HSCGroup[]
  minHscPercentage: number
  testName: string
  entryTestPercentage: number
  hscPercentageWeight: number
  sscPercentageWeight?: number
  annualTuitionFeePkr: number
  durationYears: number
  totalSeats: number
  shifts: string[]
  accreditationBody: string
  campusZone: string
  overview: string
  careerPaths: string[]
}

export interface CutoffPredictionRequest {
  hscPercentage: number
  entryTestScore: number
  hscGroup: HSCGroup
  preferredDiscipline?: string
  quota?: string
}

export interface SendOtpRequest {
  email: string
  fullName?: string
  code: string
}
