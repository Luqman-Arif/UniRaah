import { OfficialDocument } from '@/types/document'
import { mockOfficialDocuments } from '@/data/mock/documents'
import { simulateNetworkCall } from '@/services/api/client'

let documentsStore: OfficialDocument[] = [...mockOfficialDocuments]

export const documentService = {
  async getAll(): Promise<OfficialDocument[]> {
    const res = await simulateNetworkCall(documentsStore)
    return res.data
  },

  async getByUniversityId(universityId: string): Promise<OfficialDocument[]> {
    const filtered = documentsStore.filter((d) => d.universityId === universityId)
    const res = await simulateNetworkCall(filtered)
    return res.data
  },

  async create(newDoc: Omit<OfficialDocument, 'id'>): Promise<OfficialDocument> {
    const created: OfficialDocument = {
      ...newDoc,
      id: `doc-${Date.now()}`,
    }
    documentsStore.unshift(created)
    const res = await simulateNetworkCall(created)
    return res.data
  },

  async delete(id: string): Promise<boolean> {
    documentsStore = documentsStore.filter((d) => d.id !== id)
    await simulateNetworkCall(true)
    return true
  },
}
