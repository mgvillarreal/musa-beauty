import type { Locale } from '../i18n/messages'

/** Precio en pesos, con "$" en ambos idiomas (sin "MX$") */
export const formatMoney = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'MXN',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value)
