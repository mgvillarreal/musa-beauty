import { Swatch } from '../components/shade/Swatch'
import { ArrowRightIcon, PlusIcon } from '../components/ui/Icons'
import { ProductImage } from '../components/ui/ProductImage'
import { Stars } from '../components/ui/Stars'
import { BESTSELLERS, type Bestseller } from '../data/bestsellers'
import { findMakeup } from '../data/catalog'
import { SKINCARE } from '../data/skincare'
import { SKIN_TONES } from '../data/skinTones'
import { SECTION_TITLE } from '../lib/styles'
import { useLocaleStore, useT } from '../i18n/useLocale'
import { formatMoney } from '../lib/format'
import { useBagStore } from '../store/bagStore'
import { useStudioStore } from '../store/studioStore'

const MEDIUM_TONE = SKIN_TONES[4]

export function Bestsellers() {
  const t = useT()

  return (
    <section id="productos" aria-labelledby="productos-title" className="border-b border-wine">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="productos-title" className={`${SECTION_TITLE} text-wine`}>
            {t.bestsellers.title} {t.bestsellers.titleAccent}
          </h2>
          <a
            href="#tonos"
            className="group inline-flex items-center gap-2 border-b border-wine pb-1 text-sm font-medium tracking-[0.16em] text-wine uppercase hover:text-berry focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
          >
            {t.bestsellers.viewAll}
            <ArrowRightIcon className="transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {BESTSELLERS.map((item) => (
            <li key={item.id}>
              <ProductCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProductCard({ item }: { item: Bestseller }) {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const add = useBagStore((s) => s.add)
  const setProduct = useStudioStore((s) => s.setProduct)

  const makeup = item.kind === 'makeup' ? findMakeup(item.id) : undefined
  const skincare = item.kind === 'skincare' ? SKINCARE.find((p) => p.id === item.id) : undefined
  const name = (makeup ?? skincare)!.name[locale]
  const price = (makeup ?? skincare)!.price
  const subtitle = makeup ? t.bestsellers.shadesCount(makeup.shades.length) : t.routine.steps[skincare!.step]
  const firstShade = makeup?.shades[0]

  // Imagen principal: foto del producto. Al pasar el mouse: el color sobre piel (maquillaje).
  const photo = makeup
    ? { folder: makeup.category === 'lips' ? ('lips' as const) : ('blush' as const), id: firstShade!.id }
    : { folder: 'skincare' as const, id: skincare!.image }
  const swatch = makeup && (
    <Swatch tone={MEDIUM_TONE} color={firstShade!.hex} finish={makeup.finish} frame={4 / 5} className="size-full" />
  )

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-wine/6">
        <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <ProductImage
            folder={photo.folder}
            id={photo.id}
            width={320}
            className="size-full"
            fallback={
              swatch ?? (
                <span aria-hidden className="flex size-full items-center justify-center font-display text-7xl text-berry/70">
                  {name.charAt(0)}
                </span>
              )
            }
          />
        </div>
        {/* Segunda imagen al pasar el mouse: el tono aplicado sobre piel */}
        {swatch && (
          <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {swatch}
          </div>
        )}
        {item.badge && (
          <span className="absolute top-3 left-3 bg-cream px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.16em] text-wine uppercase">
            {t.bestsellers.badge[item.badge]}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-sm text-muted">{subtitle}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-wine">{name}</h3>

        {makeup && (
          <span aria-hidden className="mt-2 flex gap-1">
            {makeup.shades.map((s) => (
              <span key={s.id} className="size-3 rounded-full" style={{ backgroundColor: s.hex }} />
            ))}
          </span>
        )}

        <p className="mt-2 flex items-center gap-2 text-berry">
          <Stars value={item.rating} />
          <span className="text-xs text-muted" aria-hidden>
            {item.rating} ({item.reviews.toLocaleString(locale === 'es' ? 'es-MX' : 'en-US')})
          </span>
          <span className="sr-only">{t.bestsellers.rating(item.rating, item.reviews)}</span>
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <p className="font-medium text-wine">{formatMoney(price, locale)}</p>
          {makeup ? (
            <a
              href="#tonos"
              onClick={() => setProduct(makeup.id)}
              aria-label={t.bestsellers.chooseShadeLabel(name)}
              className="btn-lift bg-wine inline-flex items-center gap-2 px-3.5 py-2.5 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-cream uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              {t.bestsellers.chooseShade}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => add({ kind: 'skincare', productId: skincare!.id })}
              aria-label={t.bestsellers.addLabel(name)}
              className="btn-lift bg-wine inline-flex items-center gap-2 px-3.5 py-2.5 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-cream uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              <PlusIcon size={14} />
              {t.bestsellers.add}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
