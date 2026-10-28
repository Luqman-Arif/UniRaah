import { Request, Response } from 'express'
import { EmailService } from '../services/emailService.js'

export class OtpController {
  public static async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, fullName, code } = req.body

      const cleanEmail = (email || '').trim().toLowerCase()
      const cleanCode = (code || '').trim()
      const cleanName = (fullName || 'Student').trim()

      if (!cleanEmail || !cleanCode) {
        res.status(400).json({
          success: false,
          error: 'Email and verification code are required.',
        })
        return
      }

      // Basic RFC email validation check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        res.status(400).json({
          success: false,
          error: 'Invalid email address format.',
        })
        return
      }

      const result = await EmailService.sendOtpEmail(cleanEmail, cleanName, cleanCode)

      res.status(200).json({
        success: true,
        emailSent: true,
        deliveryMethod: result.deliveryMethod,
        recipient: cleanEmail,
      })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Internal server error during email dispatch'
      console.error('[OtpController] Error:', err)
      res.status(500).json({
        success: false,
        error: errorMsg,
      })
    }
  }
}
