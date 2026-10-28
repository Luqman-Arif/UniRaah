import { Router } from 'express'
import { OtpController } from '../controllers/otpController.js'

export const otpRoutes = Router()

// POST /api/send-otp
otpRoutes.post('/send-otp', OtpController.sendOtp)
