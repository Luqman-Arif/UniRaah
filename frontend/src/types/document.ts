export type DocumentCategory = 'prospectus' | 'merit_list' | 'fee_schedule' | 'gazette_notification'

export interface OfficialDocument {
  id: string
  universityId: string
  universityName: string
  universityShortName: string
  title: string
  category: DocumentCategory
  academicSession: string // e.g. "2024-2025"
  fileFormat: 'PDF'
  fileSizeMb: number
  publishDate: string
  downloadUrl: string
  verifiedByAdmin: boolean
  description: string
}
