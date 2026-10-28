import { Request, Response, NextFunction } from 'express'

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] \x1b[35m${req.method}\x1b[0m ${req.originalUrl}`)
  next()
}
