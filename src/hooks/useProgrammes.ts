import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { programmeService } from '@/services/mock/programmeService'
import { Programme } from '@/types/programme'

export function useProgrammes(universityId?: string) {
  const queryClient = useQueryClient()

  const programmesQuery = useQuery({
    queryKey: ['programmes', universityId],
    queryFn: () =>
      universityId
        ? programmeService.getByUniversityId(universityId)
        : programmeService.getAll(),
  })

  const updateProgrammeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Programme> }) =>
      programmeService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmes'] })
    },
  })

  const createProgrammeMutation = useMutation({
    mutationFn: (newProg: Omit<Programme, 'id'>) => programmeService.create(newProg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmes'] })
    },
  })

  return {
    ...programmesQuery,
    programmes: programmesQuery.data ?? [],
    updateProgramme: updateProgrammeMutation.mutateAsync,
    createProgramme: createProgrammeMutation.mutateAsync,
    isUpdating: updateProgrammeMutation.isPending,
  }
}
