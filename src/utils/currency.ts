/**
 * Currency formatting utilities for RWF (Rwandan Franc)
 */

export interface CurrencyFormatOptions {
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Format currency amount with proper RWF formatting
 */
export function formatCurrency(
  amount: number,
  currency: string = 'RWF',
  options: CurrencyFormatOptions = {}
): string {
  const {
    locale = 'en-RW',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0
  } = options

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(amount)
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `${currency} ${amount.toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits
    })}`
  }
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and formatting
  const cleanString = currencyString.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleanString)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format amount without currency symbol (for internal calculations)
 */
export function formatAmount(amount: number, options: CurrencyFormatOptions = {}): string {
  const {
    locale = 'en-RW',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0
  } = options

  return amount.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  })
}

/**
 * Calculate total amount from array of numbers
 */
export function calculateTotal(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0)
}

/**
 * Calculate percentage of amount relative to total
 */
export function calculatePercentage(amount: number, total: number): number {
  if (total === 0) return 0
  return Math.round((amount / total) * 100)
}

/**
 * Round currency amount to nearest whole number (RWF has no cents)
 */
export function roundCurrency(amount: number): number {
  return Math.round(amount)
}

/**
 * Validate currency amount
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         isFinite(amount) && 
         amount >= 0
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'RWF': 'RWF',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  }
  return symbols[currency] || currency
}

/**
 * Format amount for display in components (short format)
 */
export function formatShortCurrency(amount: number, currency: string = 'RWF'): string {
  if (amount >= 1000000) {
    return `${currency} ${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount, currency)
}

/**
 * Calculate tax amount (if applicable)
 */
export function calculateTax(amount: number, taxRate: number): number {
  return roundCurrency(amount * (taxRate / 100))
}

/**
 * Calculate total with tax
 */
export function calculateTotalWithTax(amount: number, taxRate: number): number {
  const tax = calculateTax(amount, taxRate)
  return amount + tax
}
