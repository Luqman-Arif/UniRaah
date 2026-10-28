import { Router } from 'express'
import { ProgrammeController } from '../controllers/programmeController.js'

export const programmeRoutes = Router()

// Universities
programmeRoutes.get('/universities', ProgrammeController.getAllUniversities)
programmeRoutes.get('/universities/:id', ProgrammeController.getUniversityById)

// Programmes
programmeRoutes.get('/programmes', ProgrammeController.getAllProgrammes)
programmeRoutes.get('/programmes/:id', ProgrammeController.getProgrammeById)

// Prediction & Aggregate Calculator
programmeRoutes.post('/predict', ProgrammeController.predictAdmission)
