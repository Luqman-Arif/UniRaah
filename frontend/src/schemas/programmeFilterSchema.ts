import { z } from 'zod'

export const programmeFilterSchema = z.object({
  searchQuery: z.string().default(''),
  discipline: z.string().default('all'),
  sector: z.enum(['all', 'Public', 'Private', 'Semi-Government']).default('all'),
  maxTuitionFee: z.number().optional(),
  matchCategory: z.enum(['all', 'Safety', 'Target', 'Reach']).default('all'),
})

export type ProgrammeFilterValues = z.infer<typeof programmeFilterSchema>
