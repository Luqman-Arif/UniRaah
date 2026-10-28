import { Router } from 'express'
import { otpRoutes } from './otpRoutes.js'
import { programmeRoutes } from './programmeRoutes.js'

export const apiRouter = Router()

// Healthcheck endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'uniraah-backend-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// Sub-routers
apiRouter.use('/', otpRoutes)
apiRouter.use('/', programmeRoutes)
