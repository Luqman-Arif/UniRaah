import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cutoffService } from '@/services/mock/cutoffService'
import { CutoffPrediction } from '@/types/admission'

export function useCutoffs(programmeId?: string) {
  const queryClient = useQueryClient()

  const cutoffsQuery = useQuery({
    queryKey: ['cutoffs', programmeId],
    queryFn: () =>
      programmeId
        ? cutoffService.getByProgrammeId(programmeId).then((res) => (res ? [res] : []))
        : cutoffService.getAll(),
  })

  const updateCutoffMutation = useMutation({
    mutationFn: ({ programmeId, updates }: { programmeId: string; updates: Partial<CutoffPrediction> }) =>
      cutoffService.updateCutoff(programmeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cutoffs'] })
    },
  })

  return {
    ...cutoffsQuery,
    cutoffs: cutoffsQuery.data ?? [],
    updateCutoff: updateCutoffMutation.mutateAsync,
  }
}
