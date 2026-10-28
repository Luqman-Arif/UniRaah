import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '@/services/mock/documentService'
import { OfficialDocument } from '@/types/document'

export function useOfficialDocuments(universityId?: string) {
  const queryClient = useQueryClient()

  const documentsQuery = useQuery({
    queryKey: ['documents', universityId],
    queryFn: () =>
      universityId
        ? documentService.getByUniversityId(universityId)
        : documentService.getAll(),
  })

  const createDocumentMutation = useMutation({
    mutationFn: (newDoc: Omit<OfficialDocument, 'id'>) => documentService.create(newDoc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => documentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  return {
    ...documentsQuery,
    documents: documentsQuery.data ?? [],
    createDocument: createDocumentMutation.mutateAsync,
    deleteDocument: deleteDocumentMutation.mutateAsync,
  }
}
