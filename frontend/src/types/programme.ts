import { HSCGroup } from './student'
import { UniversitySector } from './university'

export type DegreeLevel = 'Undergraduate BS' | 'Undergraduate BE' | 'Undergraduate BBA' | 'MBBS' | 'Pharm-D'

export interface TestWeightageFormula {
  entryTestPercentage: number // e.g. 50
  hscPercentage: number       // e.g. 50
  sscPercentage: number       // e.g. 0
  interviewOrOtherPercentage?: number
  testName: string            // e.g. "NED Pre-Admission Entry Test", "FAST-NU Online Test", "IBA Aptitude Test"
}

export interface OfficialSourceReference {
  title: string
  documentType: string
  url?: string
  citation: string
}

export interface Programme {
  id: string
  universityId: string
  universityName: string
  universityShortName: string
  universitySector: UniversitySector
  name: string
  degreeType: DegreeLevel
  discipline: string
  eligibleHSCGroups: HSCGroup[]
  minHscPercentage: number
  testWeightage: TestWeightageFormula
  annualTuitionFeePKR: number
  semesterTuitionFeePKR?: number
  durationYears: number
  totalSeats: number
  shifts: ('Morning' | 'Evening')[]
  accreditationBody: string // e.g. "NCEAC (Level W)", "PEC Accredited"
  overview: string
  campusZone?: string
  officialSources?: OfficialSourceReference[]
}
