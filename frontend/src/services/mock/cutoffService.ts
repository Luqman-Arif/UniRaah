import { CutoffPrediction } from '@/types/admission'
import { mockCutoffs } from '@/data/mock/cutoffs'
import { simulateNetworkCall } from '@/services/api/client'

const cutoffsStore: CutoffPrediction[] = [...mockCutoffs]

export const cutoffService = {
  async getAll(): Promise<CutoffPrediction[]> {
    const res = await simulateNetworkCall(cutoffsStore)
    return res.data
  },

  async getByProgrammeId(programmeId: string): Promise<CutoffPrediction | undefined> {
    const cutoff = cutoffsStore.find((c) => c.programmeId === programmeId)
    const res = await simulateNetworkCall(cutoff)
    return res.data
  },

  async updateCutoff(
    programmeId: string,
    updates: Partial<CutoffPrediction>
  ): Promise<CutoffPrediction> {
    const index = cutoffsStore.findIndex((c) => c.programmeId === programmeId)
    if (index === -1) {
      throw new Error(`Cutoff data for programme ${programmeId} not found`)
    }
    cutoffsStore[index] = { ...cutoffsStore[index], ...updates }
    const res = await simulateNetworkCall(cutoffsStore[index])
    return res.data
  },
}
