import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('\x1b[31m[Backend Error Handler]:\x1b[0m', err)

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
