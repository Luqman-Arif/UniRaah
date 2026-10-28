import { Programme } from '@/types/programme'
import { mockProgrammes } from '@/data/mock/programmes'
import { simulateNetworkCall } from '@/services/api/client'

let programmesStore: Programme[] = [...mockProgrammes]

export const programmeService = {
  async getAll(): Promise<Programme[]> {
    const res = await simulateNetworkCall(programmesStore)
    return res.data
  },

  async getById(id: string): Promise<Programme | undefined> {
    const programme = programmesStore.find((p) => p.id === id)
    const res = await simulateNetworkCall(programme)
    return res.data
  },

  async getByUniversityId(universityId: string): Promise<Programme[]> {
    const filtered = programmesStore.filter((p) => p.universityId === universityId)
    const res = await simulateNetworkCall(filtered)
    return res.data
  },

  async update(id: string, updates: Partial<Programme>): Promise<Programme> {
    const index = programmesStore.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Programme with id ${id} not found`)
    }
    programmesStore[index] = { ...programmesStore[index], ...updates }
    const res = await simulateNetworkCall(programmesStore[index])
    return res.data
  },

  async create(newProg: Omit<Programme, 'id'>): Promise<Programme> {
    const created: Programme = {
      ...newProg,
      id: `prog-${Date.now()}`,
    }
    programmesStore.unshift(created)
    const res = await simulateNetworkCall(created)
    return res.data
  },

  async delete(id: string): Promise<boolean> {
    programmesStore = programmesStore.filter((p) => p.id !== id)
    await simulateNetworkCall(true)
    return true
  },
}
