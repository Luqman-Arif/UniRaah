export type UniversitySector = 'Public' | 'Private' | 'Semi-Government'

export interface University {
  id: string
  name: string
  shortName: string
  sector: UniversitySector
  address: string
  locationZone: string // e.g. "University Road Corridor", "Clifton/Defence", "Korangi Creek", "Gulshan"
  establishedYear: number
  accreditations: string[] // e.g. ["HEC 'W' Category", "PEC", "NCEAC", "NBEAC"]
  websiteUrl: string
  admissionsEmail: string
  admissionsHelpline: string
  overview: string
  activeProgrammesCount: number
  status: 'active' | 'admissions_open' | 'admissions_closed'
}
