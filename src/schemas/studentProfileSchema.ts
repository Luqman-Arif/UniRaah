import { z } from 'zod'

export const academicInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  hscGroup: z.enum([
    'Pre-Engineering',
    'Pre-Medical',
    'Computer Science',
    'General Science',
    'Commerce',
    'Arts & Humanities',
  ], {
    errorMap: () => ({ message: 'Please select your intermediate (HSC) group' }),
  }),
  board: z.enum([
    'Board of Intermediate Education Karachi (BIEK)',
    'Federal Board of Intermediate & Secondary Education (FBISE)',
    'Aga Khan University Examination Board (AKU-EB)',
    'Cambridge International (A-Levels)',
    'Sindh Board',
  ], {
    errorMap: () => ({ message: 'Please select your examination board' }),
  }),
  sscPercentage: z
    .number({ invalid_type_error: 'SSC / Matric percentage must be a number' })
    .min(33, 'Percentage must be at least 33%')
    .max(100, 'Percentage cannot exceed 100%'),
  hscPart1Percentage: z
    .number({ invalid_type_error: 'HSC-1 percentage must be a number' })
    .min(33, 'Percentage must be at least 33%')
    .max(100, 'Percentage cannot exceed 100%'),
  hscTotalPredictedPercentage: z
    .number({ invalid_type_error: 'Predicted percentage must be a number' })
    .min(33, 'Percentage must be at least 33%')
    .max(100, 'Percentage cannot exceed 100%'),
  subjectMarks: z.object({
    mathematics: z.preprocess(
      (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val)),
      z.number().min(0).max(100).optional()
    ),
    physics: z.preprocess(
      (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val)),
      z.number().min(0).max(100).optional()
    ),
    chemistry: z.preprocess(
      (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val)),
      z.number().min(0).max(100).optional()
    ),
    computerScience: z.preprocess(
      (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val)),
      z.number().min(0).max(100).optional()
    ),
    biology: z.preprocess(
      (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val)),
      z.number().min(0).max(100).optional()
    ),
  }),
})

export type AcademicInfoFormValues = z.infer<typeof academicInfoSchema>

export const preferencesSchema = z.object({
  disciplines: z.array(z.enum([
    'Computer Science & AI',
    'Software Engineering',
    'Electrical & Mechanical Engineering',
    'Business Administration & Management',
    'Medicine & Allied Health',
    'Data Science & Cyber Security',
    'Architecture & Design',
  ])).min(1, 'Select at least one preferred discipline'),
  budgetPeriod: z.enum(['annual', 'semester']),
  maxAnnualBudgetPKR: z
    .number({ invalid_type_error: 'Budget amount must be a number' })
    .min(10000, 'Budget must be at least 10,000 PKR')
    .max(5000000, 'Maximum budget threshold is 5,000,000 PKR'),
  homeLocation: z.string(),
  sector: z.enum(['all', 'public', 'private', 'semi-government']),
  shift: z.enum(['morning', 'evening', 'any']),
  priorities: z.object({
    merit: z.number().min(0).max(100),
    affordability: z.number().min(0).max(100),
    distance: z.number().min(0).max(100),
  }).refine((data) => data.merit + data.affordability + data.distance > 0, {
    message: 'At least one priority must have a weight greater than 0',
  }),
})

export type PreferencesFormValues = z.infer<typeof preferencesSchema>

export const studentProfileSchema = academicInfoSchema.extend({
  preferences: preferencesSchema,
})

export type StudentProfileFormValues = z.infer<typeof studentProfileSchema>
