import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Swatch } from '../components/shade/Swatch'
import { ToneChip } from '../components/shade/ToneChip'
import { ArrowRightIcon } from '../components/ui/Icons'
import { Stars } from '../components/ui/Stars'
import { findMakeup, shadeNumber } from '../data/catalog'
import { reviewsForTone } from '../data/reviews'
import { SKIN_TONES } from '../data/skinTones'
import { SECTION_TITLE } from '../lib/styles'
import { useLocaleStore, useT } from '../i18n/useLocale'
import { useStudioStore } from '../store/studioStore'

/**
 * Reseñas por tono de piel, con una sola reseña protagonista: cita grande y, al lado,
 * el tono que compró sobre la piel de quien la escribe. Las flechas pasan a la siguiente.
 * Comparte el tono con el selector: si elegiste "Tono 7" arriba, aquí ves las del 7.
 */
export function Reviews() {
  const t = useT()
  const tone = useStudioStore((s) => s.tone)
  const setTone = useStudioStore((s) => s.setTone)
  const { exact } = reviewsForTone(tone)

  return (
    <section id="resenas" aria-labelledby="resenas-title" className="border-b border-wine bg-wine/5">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8 border-b border-wine/20 pb-8">
          <div>
            <h2 id="resenas-title" className={`${SECTION_TITLE} text-wine`}>
              {t.reviews.title}
            </h2>
            <p className="mt-3 max-w-md text-muted sm:max-lg:max-w-none">{t.reviews.lead}</p>
          </div>

          <div>
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-wine">{t.reviews.toneLegend}</legend>
              <div className="flex flex-wrap gap-2">
                {SKIN_TONES.map((s) => (
                  <ToneChip
                    key={s.id}
                    tone={s}
                    name="review-tone"
                    checked={tone === s.id}
                    label={t.studio.tone(s.id)}
                    onSelect={() => setTone(s.id)}
                    size="sm"
                  />
                ))}
              </div>
            </fieldset>
            <p role="status" className="mt-3 text-sm text-muted">
              {t.reviews.exact(exact, tone)}
            </p>
          </div>
        </div>

        {/* Al cambiar de tono se vuelve a la primera reseña de ese tono */}
        <FeaturedReview key={tone} tone={tone} />
      </div>
    </section>
  )
}

function FeaturedReview({ tone }: { tone: number }) {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const { reviews } = reviewsForTone(tone)
  const [index, setIndex] = useState(0)

  const review = reviews[index]
  const product = findMakeup(review.productId)!
  const shade = product.shades.find((s) => s.id === review.shadeId)!
  const go = (step: number) => setIndex((i) => (i + step + reviews.length) % reviews.length)

  const arrowButton =
    'flex size-11 items-center justify-center border border-wine/30 text-wine transition-colors hover:border-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'

  return (
    <div className="mt-12 grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {/* "Foto" de la reseña: el tono comprado sobre la piel de quien la escribe.
              Vertical desde tablet; en móvil, horizontal (se recorta solo piel, el trazo queda entero) */}
          <figure>
            <Swatch
              tone={SKIN_TONES[review.tone - 1]}
              color={shade.hex}
              finish={product.finish}
              frame={4 / 5}
              cover
              className="aspect-[5/3] h-auto w-full max-w-sm md:aspect-[4/5]"
            />
            <figcaption className="sr-only">{t.reviews.photoAlt(shade.name[locale], review.tone)}</figcaption>
          </figure>
        </motion.div>
      </AnimatePresence>

      <div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="flex items-center gap-2 text-berry">
              <Stars value={review.rating} />
              <span className="sr-only">{t.reviews.stars(review.rating)}</span>
            </p>
            <blockquote className="mt-6 font-display text-3xl leading-snug text-wine sm:text-4xl xl:text-5xl xl:leading-tight">
              “{review.text[locale]}”
            </blockquote>
            <figcaption className="mt-8">
              <p className="font-medium text-wine">{t.reviews.reviewer(review.name, review.tone)}</p>
              <p className="text-sm text-muted">
                {product.name[locale]} · N.º {shadeNumber(product, shade.id)} {shade.name[locale]}
              </p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label={t.reviews.prev} className={arrowButton}>
            <ArrowRightIcon className="rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.reviews.next} className={arrowButton}>
            <ArrowRightIcon />
          </button>
          <p aria-live="polite" className="ml-2 text-sm text-muted tabular-nums">
            {t.reviews.counter(index + 1, reviews.length)}
          </p>
        </div>
      </div>
    </div>
  )
}
