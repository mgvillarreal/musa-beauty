import type { Locale } from '../../i18n/messages'
import { useLocaleStore, useT } from '../../i18n/useLocale'
import { UsaFlag, VenezuelaFlag } from './Flags'

const OPTIONS: { locale: Locale; label: string; Flag: typeof VenezuelaFlag }[] = [
  { locale: 'es', label: 'Español', Flag: VenezuelaFlag },
  { locale: 'en', label: 'English', Flag: UsaFlag },
]

/** Cambio de idioma tocando la bandera. La activa lleva un subrayado dorado. */
export function LanguageSwitch() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  return (
    <div role="group" aria-label={t.header.language} className="flex shrink-0 items-center gap-1">
      {OPTIONS.map(({ locale: option, label, Flag }) => {
        const active = option === locale
        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => setLocale(option)}
            className={`flex h-7 w-9 items-center justify-center border-b transition-colors focus-visible:outline-1 focus-visible:outline-gold ${
              active ? 'border-gold' : 'border-transparent'
            }`}
          >
            <Flag className={`h-3.5 w-5 transition-opacity ${active ? '' : 'opacity-40 hover:opacity-90'}`} />
          </button>
        )
      })}
    </div>
  )
}
