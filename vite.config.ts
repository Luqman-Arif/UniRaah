import { defineConfig, Plugin, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import nodemailer from 'nodemailer'
import dns from 'dns'
import type { IncomingMessage, ServerResponse } from 'http'

async function sendViaDirectMx(
  email: string,
  fullName: string,
  code: string,
  emailFrom: string
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
          from: emailFrom,
          to: email,
          replyTo: 'support@uniraah.pk',
          subject: `UniRaah — Your Student Verification Code: ${code}`,
          text: `Hello ${fullName},\n\nYour UniRaah verification code is: ${code}\nThis code will expire in 10 minutes.\n\nBest regards,\nUniRaah Karachi Admissions Team`,
          html: `
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
          `,
        })

        console.log(`\x1b[32m✔ [UniRaah Email Dispatcher] Email delivered directly to ${email} via MX server [${record.exchange}:25].\x1b[0m`)
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

function emailDispatchPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'email-dispatch-service',
    configureServer(server) {
      server.middlewares.use('/api/send-otp', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString()
        })

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const parsed = JSON.parse(body || '{}')
            const email: string = (parsed.email || '').trim().toLowerCase()
            const fullName: string = (parsed.fullName || 'Student').trim()
            const code: string = (parsed.code || '').trim()

            if (!email || !code) {
              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'Email and code are required' }))
              return
            }

            const smtpHost = env.SMTP_HOST || process.env.SMTP_HOST
            const smtpPort = Number(env.SMTP_PORT || process.env.SMTP_PORT || 465)
            const smtpUser = env.SMTP_USER || process.env.SMTP_USER
            const smtpPass = env.SMTP_PASS || process.env.SMTP_PASS
            const smtpSecure = (env.SMTP_SECURE || process.env.SMTP_SECURE) !== 'false'
            const emailFrom = env.EMAIL_FROM || process.env.EMAIL_FROM || '"UniRaah Admissions" <admissions@uniraah.pk>'

            let deliveredSuccessfully = false
            let deliveryMethod = 'none'

            // Method 1: If real authenticated SMTP credentials are provided
            if (smtpUser && smtpPass) {
              try {
                const transporter = nodemailer.createTransport({
                  host: smtpHost || 'smtp.gmail.com',
                  port: smtpPort,
                  secure: smtpSecure,
                  auth: {
                    user: smtpUser,
                    pass: smtpPass,
                  },
                })

                await transporter.sendMail({
                  from: emailFrom,
                  to: email,
                  subject: `UniRaah — Your Student Verification Code: ${code}`,
                  text: `Hello ${fullName},\n\nYour UniRaah verification code is: ${code}\nThis code will expire in 10 minutes.\n\nBest regards,\nUniRaah Karachi Admissions Team`,
                  html: `
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
                            Enter this code in your UniRaah signup window to complete your registration. If you did not request this, you can safely ignore this email.
                          </p>
                        </div>
                        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                          © 2026 UniRaah — Supporting Karachi HSC Students
                        </div>
                      </div>
                    </div>
                  `,
                })
                deliveredSuccessfully = true
                deliveryMethod = 'Authenticated SMTP'
                console.log(`\x1b[32m✔ [UniRaah Email Dispatcher] Verification email successfully sent to ${email} via SMTP.\x1b[0m`)
              } catch (smtpErr) {
                console.error('\x1b[31m✖ [UniRaah Email Dispatcher] Authenticated SMTP delivery failed, falling back to direct MX:\x1b[0m', smtpErr)
              }
            }

            // Method 2: Direct MX delivery to the recipient's mail exchange server
            if (!deliveredSuccessfully) {
              const mxDelivered = await sendViaDirectMx(email, fullName, code, emailFrom)
              if (mxDelivered) {
                deliveredSuccessfully = true
                deliveryMethod = 'Direct MX Mail Server'
              }
            }

            // High-visibility terminal notification
            console.log('\n\x1b[34m========================================================================\x1b[0m')
            console.log('\x1b[1m\x1b[36m📧 [UniRaah Email Dispatch Service]\x1b[0m')
            console.log('\x1b[34m------------------------------------------------------------------------\x1b[0m')
            console.log(`\x1b[1mTo\x1b[0m        : ${email} (${fullName})`)
            console.log(`\x1b[1mSubject\x1b[0m   : UniRaah Student Verification Code: ${code}`)
            console.log(`\x1b[1mOTP Code\x1b[0m  : \x1b[33m\x1b[1m${code}\x1b[0m (Valid for 10 minutes)`)
            console.log(`\x1b[1mDelivery\x1b[0m  : ${deliveredSuccessfully ? `\x1b[32mSent via ${deliveryMethod}\x1b[0m` : '\x1b[33mDispatched to local terminal\x1b[0m'}`)
            console.log('\x1b[34m========================================================================\x1b[0m\n')

            res.statusCode = 200
            res.end(
              JSON.stringify({
                success: true,
                emailSent: deliveredSuccessfully,
                deliveryMethod,
                recipient: email,
              })
            )
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown server error'
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: errorMsg }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), emailDispatchPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
