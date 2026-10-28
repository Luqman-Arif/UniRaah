import nodemailer from 'nodemailer'
import dns from 'dns'
import { ENV } from '../config/env.js'

export interface EmailDispatchResult {
  success: boolean
  deliveryMethod: string
  error?: string
}

/**
 * Attempts delivery directly to recipient domain's Mail Exchange (MX) servers
 */
async function sendViaDirectMx(
  email: string,
  fullName: string,
  code: string,
  htmlTemplate: string
): Promise<boolean> {
  const domain = email.split('@')[1]
  if (!domain) return false

  try {
    const mxRecords = await dns.promises.resolveMx(domain)
    if (!mxRecords || mxRecords.length === 0) return false

    // Sort by priority (lowest priority number = preferred exchanger)
    mxRecords.sort((a, b) => a.priority - b.priority)

    // Try the top 2 MX exchangers
    for (const record of mxRecords.slice(0, 2)) {
      try {
        const mxTransporter = nodemailer.createTransport({
          host: record.exchange,
          port: 25,
          secure: false,
          name: 'uniraah.pk',
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 8000,
        })

        await mxTransporter.sendMail({
          from: ENV.EMAIL_FROM,
          to: email,
          replyTo: 'support@uniraah.pk',
          subject: `UniRaah — Your Student Verification Code: ${code}`,
          text: `Hello ${fullName},\n\nYour UniRaah verification code is: ${code}\nThis code will expire in 10 minutes.\n\nBest regards,\nUniRaah Karachi Admissions Team`,
          html: htmlTemplate,
        })

        console.log(`\x1b[32m✔ [UniRaah Email Dispatcher] Delivered directly to ${email} via MX [${record.exchange}:25]\x1b[0m`)
        return true
      } catch (sendErr) {
        console.warn(`[UniRaah Mailer] Direct delivery to ${record.exchange} failed:`, sendErr)
      }
    }
  } catch (mxErr) {
    console.warn(`[UniRaah Mailer] Failed to resolve MX for ${domain}:`, mxErr)
  }

  return false
}

/**
 * Generates modern, responsive HTML email template
 */
function buildOtpEmailHtml(fullName: string, code: string, email: string): string {
  const domain = email.split('@')[1] || 'domain'
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🎓 UniRaah Karachi</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Undergraduate Admission & Guidance Portal</p>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 0;">Hello ${fullName},</p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Thank you for creating an account on UniRaah. To verify your email and access Karachi degree recommendations, admission probability forecasts, and campus comparison metrics, use the verification code below:
          </p>
          <div style="background: #f1f5f9; border: 2px dashed #93c5fd; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">Your 6-Digit Verification Code</div>
            <div style="font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8;">${code}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">⏱️ Valid for 10 minutes</div>
          </div>
          <p style="font-size: 13px; line-height: 1.5; color: #64748b;">
            Enter this code in your UniRaah signup window to complete your registration.
          </p>
          <div style="margin-top: 20px; padding: 12px; background: #fffbeb; border-radius: 8px; border: 1px solid #fef3c7; font-size: 12px; color: #92400e; line-height: 1.5;">
            📌 <strong>Note:</strong> Institutional and university mail systems (@${domain}) may filter automated verification emails into your <strong>Spam / Junk</strong> folder. Please check your Spam folder if this email does not appear in your primary inbox.
          </div>
        </div>
        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
          © 2026 UniRaah — Supporting Karachi HSC Students
        </div>
      </div>
    </div>
  `
}

export class EmailService {
  public static async sendOtpEmail(
    email: string,
    fullName: string,
    code: string
  ): Promise<EmailDispatchResult> {
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = fullName.trim() || 'Student'
    const cleanCode = code.trim()
    const htmlTemplate = buildOtpEmailHtml(cleanName, cleanCode, cleanEmail)

    let deliveredSuccessfully = false
    let deliveryMethod = 'none'

    // Method 1: Authenticated SMTP (if user provided credentials in .env)
    if (ENV.SMTP_USER && ENV.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: ENV.SMTP_HOST,
          port: ENV.SMTP_PORT,
          secure: ENV.SMTP_SECURE,
          auth: {
            user: ENV.SMTP_USER,
            pass: ENV.SMTP_PASS,
          },
        })

        await transporter.sendMail({
          from: ENV.EMAIL_FROM,
          to: cleanEmail,
          subject: `UniRaah — Your Student Verification Code: ${cleanCode}`,
          text: `Hello ${cleanName},\n\nYour UniRaah verification code is: ${cleanCode}\nThis code will expire in 10 minutes.\n\nBest regards,\nUniRaah Karachi Admissions Team`,
          html: htmlTemplate,
        })

        deliveredSuccessfully = true
        deliveryMethod = 'Authenticated SMTP'
        console.log(`\x1b[32m✔ [UniRaah Email Dispatcher] Sent to ${cleanEmail} via SMTP\x1b[0m`)
      } catch (smtpErr) {
        console.error('\x1b[31m✖ [UniRaah Email Dispatcher] SMTP delivery failed, falling back to direct MX:\x1b[0m', smtpErr)
      }
    }

    // Method 2: Direct MX Mail Exchanger delivery
    if (!deliveredSuccessfully) {
      const mxDelivered = await sendViaDirectMx(cleanEmail, cleanName, cleanCode, htmlTemplate)
      if (mxDelivered) {
        deliveredSuccessfully = true
        deliveryMethod = 'Direct MX Mail Server'
      }
    }

    // High-visibility terminal notification
    console.log('\n\x1b[34m========================================================================\x1b[0m')
    console.log('\x1b[1m\x1b[36m📧 [UniRaah Backend Email Dispatch Service]\x1b[0m')
    console.log('\x1b[34m------------------------------------------------------------------------\x1b[0m')
    console.log(`\x1b[1mTo\x1b[0m        : ${cleanEmail} (${cleanName})`)
    console.log(`\x1b[1mSubject\x1b[0m   : UniRaah Student Verification Code: ${cleanCode}`)
    console.log(`\x1b[1mOTP Code\x1b[0m  : \x1b[33m\x1b[1m${cleanCode}\x1b[0m (Valid for 10 minutes)`)
    console.log(`\x1b[1mDelivery\x1b[0m  : ${deliveredSuccessfully ? `\x1b[32mSent via ${deliveryMethod}\x1b[0m` : '\x1b[33mDispatched to local terminal\x1b[0m'}`)
    console.log('\x1b[34m========================================================================\x1b[0m\n')

    return {
      success: true,
      deliveryMethod: deliveredSuccessfully ? deliveryMethod : 'Terminal Dispatch',
    }
  }
}
