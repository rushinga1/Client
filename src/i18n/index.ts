import { createI18n } from 'vue-i18n'
import en from './locales/en'
import rw from './locales/rw'
import fr from './locales/fr'
import sw from './locales/sw'

// Import locale messages
const messages = {
  en,
  rw,
  fr,
  sw
}

// Get browser locale or fallback to English
function getBrowserLocale(): string {
  const browserLang = navigator.language || (navigator as any).userLanguage
  
  // Map browser language codes to our supported locales
  const localeMap: Record<string, string> = {
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'rw': 'rw',
    'rw-RW': 'rw',
    'fr': 'fr',
    'fr-FR': 'fr',
    'sw': 'sw',
    'sw-KE': 'sw',
    'sw-TZ': 'sw'
  }
  
  return localeMap[browserLang] || 'en'
}

// Get stored locale or fallback to English
function getStoredLocale(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('agruni_locale')
    if (stored && messages[stored as keyof typeof messages]) {
      return stored
    }
  }
  return 'en' // Default is always English
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  warnHtmlMessage: false,
  missing: (locale, key) => {
    if (import.meta.env.DEV) {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`)
    }
    return key
  }
})

// Export i18n instance and helper functions
export default i18n

// Export available locales
export const availableLocales = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' }
] as const

// Export locale codes
export type LocaleCode = typeof availableLocales[number]['code']

// Helper function to set locale and persist it
export function setLocale(locale: LocaleCode) {
  i18n.global.locale.value = locale
  if (typeof window !== 'undefined') {
    localStorage.setItem('agruni_locale', locale)
  }
}

// Helper function to get current locale
export function getCurrentLocale(): LocaleCode {
  return i18n.global.locale.value as LocaleCode
}

// Helper function to check if locale is supported
export function isLocaleSupported(locale: string): locale is LocaleCode {
  return availableLocales.some(l => l.code === locale)
}

// Helper function to get locale info
export function getLocaleInfo(locale: LocaleCode) {
  return availableLocales.find(l => l.code === locale)
}

// Helper function to format currency with locale
export function formatCurrencyWithLocale(
  amount: number,
  currency: string = 'RWF',
  locale: LocaleCode = getCurrentLocale()
): string {
  try {
    const localeCode = getLocaleCodeForFormatting(locale)
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    // Fallback formatting
    return `${currency} ${amount.toLocaleString()}`
  }
}

// Map our locale codes to Intl locale codes
function getLocaleCodeForFormatting(locale: LocaleCode): string {
  const localeMap: Record<LocaleCode, string> = {
    en: 'en-RW',
    rw: 'rw-RW',
    fr: 'fr-RW',
    sw: 'sw-KE'
  }
  return localeMap[locale] || 'en-RW'
}

// Helper function to format dates with locale
export function formatDateWithLocale(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  locale: LocaleCode = getCurrentLocale()
): string {
  try {
    const dateObj = new Date(date)
    const localeCode = getLocaleCodeForFormatting(locale)
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }
    
    return new Intl.DateTimeFormat(localeCode, defaultOptions).format(dateObj)
  } catch (error) {
    // Fallback formatting
    return new Date(date).toLocaleDateString()
  }
}

// Helper function to format relative time with locale
export function formatRelativeTime(
  date: Date | string | number,
  locale: LocaleCode = getCurrentLocale()
): string {
  try {
    const dateObj = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return i18n.global.t('datetime.today')
    if (diffDays === 1) return i18n.global.t('datetime.yesterday')
    if (diffDays === -1) return i18n.global.t('datetime.tomorrow')
    
    return formatDateWithLocale(dateObj, { month: 'short', day: 'numeric' }, locale)
  } catch (error) {
    return new Date(date).toLocaleDateString()
  }
}

// Export translation helper
export const t = i18n.global.t

// Export reactive locale ref
export const locale = i18n.global.locale
