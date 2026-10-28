import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || process.env.BACKEND_PORT || 5001),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT || 465),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
  EMAIL_FROM: process.env.EMAIL_FROM || '"UniRaah Admissions" <admissions@uniraah.pk>',
}
