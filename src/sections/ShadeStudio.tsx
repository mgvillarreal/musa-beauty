import { PlusIcon } from '../components/ui/Icons'
import { ProductImage } from '../components/ui/ProductImage'
import { motion } from 'motion/react'
import { EASE } from '../lib/motion'
import { useBagStore } from '../store/bagStore'
import { Swatch } from '../components/shade/Swatch'
import { ToneChip } from '../components/shade/ToneChip'
import { PRODUCTS, shadeNumber } from '../data/catalog'
import { SKIN_TONES } from '../data/skinTones'
import { SECTION_TITLE } from '../lib/styles'
import { useLocaleStore, useT } from '../i18n/useLocale'
import { formatMoney } from '../lib/format'
import { findProduct, useStudioStore } from '../store/studioStore'

const legendStyle = 'mb-4 text-sm font-medium text-wine'
const focusRing = 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-wine'

export function ShadeStudio() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const { tone, productId, setTone, setProduct } = useStudioStore()
  const product = findProduct(productId)
  const skin = SKIN_TONES.find((s) => s.id === tone)!
  const add = useBagStore((s) => s.add)

  return (
    // Rompe el ritmo del resto: ocupa toda la pantalla y el selector es el protagonista
    <section id="tonos" aria-labelledby="tonos-title" className="flex min-h-[100svh] items-center border-b border-wine">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-8 sm:py-16 lg:py-20">
        <h2 id="tonos-title" className={`${SECTION_TITLE} mb-10 text-wine`}>
          {t.studio.title} {t.studio.titleAccent}
        </h2>
        <div className="grid gap-12 lg:grid-cols-[17rem_1fr] lg:gap-16">
          {/* Productos listados a la izquierda; quedan fijos mientras se recorren los colores */}
          <fieldset className="lg:sticky lg:top-32 lg:self-start">
            <legend className={legendStyle}>{t.studio.productLegend}</legend>
            <div className="grid gap-2">
              {PRODUCTS.map((p) => (
                <label key={p.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="product"
                    value={p.id}
                    checked={productId === p.id}
                    onChange={() => setProduct(p.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex items-baseline justify-between gap-4 border border-wine/25 px-5 py-4 text-wine transition-colors hover:border-wine peer-checked:border-wine peer-checked:bg-wine peer-checked:text-cream ${focusRing}`}
                  >
                    <span>
                      <span className="block font-display text-xl">{p.name[locale]}</span>
                      <span className="text-sm opacity-80">
                        {t.studio.finish[p.finish]} · {p.shades.length}
                      </span>
                    </span>
                    <span className="text-sm font-medium">{formatMoney(p.price, locale)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <fieldset>
              <legend className={legendStyle}>{t.studio.toneLegend}</legend>
              <div className="flex flex-wrap gap-2">
                {SKIN_TONES.map((s) => (
                  <ToneChip
                    key={s.id}
                    tone={s}
                    name="skin-tone"
                    checked={tone === s.id}
                    label={t.studio.tone(s.id)}
                    onSelect={() => setTone(s.id)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Momento animado: las muestras entran escalonadas la primera vez que se ve el selector */}
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
              {product.shades.map((shade, i) => (
                <motion.li
                  key={shade.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                >
                  <div className="relative">
                    <Swatch tone={skin} color={shade.hex} finish={product.finish} className="aspect-[100/64] w-full outline outline-wine/15" />
                    {/* Foto del producto en miniatura, cuando existe */}
                    <ProductImage
                      folder={product.category === 'lips' ? 'lips' : 'blush'}
                      id={shade.id}
                      width={64}
                      className="absolute -right-2 -bottom-4 size-16 outline outline-wine/15"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted">
                        N.º {shadeNumber(product, shade.id)} · {t.studio.finish[product.finish]}
                      </p>
                      <p className="mt-0.5 font-display text-2xl text-wine">{shade.name[locale]}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => add({ kind: 'makeup', productId: product.id, shadeId: shade.id })}
                      aria-label={t.studio.addLabel(`${product.name[locale]} ${shade.name[locale]}`)}
                      className="btn-lift bg-wine mt-1 flex size-9 shrink-0 items-center justify-center text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
