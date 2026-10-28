import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines conditional class names and merges Tailwind classes cleanly without conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in Pakistani Rupees (PKR)
 */
export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format percentage with single decimal precision
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
