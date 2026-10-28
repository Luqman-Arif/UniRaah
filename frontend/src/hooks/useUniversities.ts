import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { universityService } from '@/services/mock/universityService'
import { University } from '@/types/university'

export function useUniversities() {
  const queryClient = useQueryClient()

  const universitiesQuery = useQuery({
    queryKey: ['universities'],
    queryFn: () => universityService.getAll(),
  })

  const updateUniversityMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<University> }) =>
      universityService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] })
    },
  })

  return {
    ...universitiesQuery,
    universities: universitiesQuery.data ?? [],
    updateUniversity: updateUniversityMutation.mutateAsync,
    isUpdating: updateUniversityMutation.isPending,
  }
}
