import { University } from '@/types/university'
import { mockUniversities } from '@/data/mock/universities'
import { simulateNetworkCall } from '@/services/api/client'

// In-memory store for mutations in the current session
const universitiesStore: University[] = [...mockUniversities]

export const universityService = {
  async getAll(): Promise<University[]> {
    const res = await simulateNetworkCall(universitiesStore)
    return res.data
  },

  async getById(id: string): Promise<University | undefined> {
    const university = universitiesStore.find((u) => u.id === id)
    const res = await simulateNetworkCall(university)
    return res.data
  },

  async update(id: string, updates: Partial<University>): Promise<University> {
    const index = universitiesStore.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error(`University with id ${id} not found`)
    }
    universitiesStore[index] = { ...universitiesStore[index], ...updates }
    const res = await simulateNetworkCall(universitiesStore[index])
    return res.data
  },

  async create(newUniversity: Omit<University, 'id'>): Promise<University> {
    const created: University = {
      ...newUniversity,
      id: `uni-${Date.now()}`,
    }
    universitiesStore.unshift(created)
    const res = await simulateNetworkCall(created)
    return res.data
  },
}
