import { Reveal } from '../components/ui/Reveal'
import { SKIN_TONES, skinImageId } from '../data/skinTones'
import { useT } from '../i18n/useLocale'

/** Franja tipográfica entre el hero y el selector: la idea de la marca en una frase */
export function Statement() {
  const t = useT()

  return (
    <section aria-label={`${t.statement.line1} ${t.statement.line2}`} className="bg-wine text-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 text-center sm:px-8 md:flex-row md:justify-between md:py-20 md:text-left lg:py-28">
        <p className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-tight">
          <Reveal>{t.statement.line1}</Reveal>
          <Reveal delay={0.1}>
            <span className="text-gold">{t.statement.line2}</span>
          </Reveal>
        </p>
        <div aria-hidden className="flex shrink-0">
          {SKIN_TONES.map((tone) => (
            // Las fotos reales de cada piel (el color plano queda de respaldo mientras cargan)
            <span
              key={tone.id}
              className="block h-16 w-5 bg-cover bg-center sm:h-24 sm:w-7"
              style={{ backgroundColor: tone.hex, backgroundImage: `url(/images/skin/${skinImageId(tone.id)}-sm.webp)` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
