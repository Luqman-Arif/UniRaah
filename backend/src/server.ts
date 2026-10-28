import express from 'express'
import cors from 'cors'
import { ENV } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Middleware
app.use(
  cors({
    origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5177'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// Mount API routes
app.use('/api', apiRouter)
app.use('/api/v1', apiRouter)

// Global Error Handler
app.use(errorHandler)

// Server startup
const PORT = ENV.PORT

app.listen(PORT, () => {
  console.log('\n\x1b[32m========================================================\x1b[0m')
  console.log(`\x1b[1m\x1b[36m🚀 UniRaah Backend API Server running on port ${PORT}\x1b[0m`)
  console.log(`\x1b[90mHealth check: http://localhost:${PORT}/api/health\x1b[0m`)
  console.log(`\x1b[90mAllowed Frontend Origin: ${ENV.FRONTEND_URL}\x1b[0m`)
  console.log('\x1b[32m========================================================\x1b[0m\n')
})

export default app
