import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ta from './locales/ta'
import hi from './locales/hi'

export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' }
] as const

export type LocaleCode = typeof SUPPORTED_LOCALES[number]['code']

const LOCALE_KEY = 'spc_locale'

function detectLocale(): LocaleCode {
  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved && SUPPORTED_LOCALES.some(l => l.code === saved)) return saved as LocaleCode
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, ta, hi },
})

export function setLocale(code: LocaleCode) {
  i18n.global.locale.value = code
  localStorage.setItem(LOCALE_KEY, code)
}
