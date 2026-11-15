import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { ToneFan } from '../components/shade/ToneFan'
import { ArrowRightIcon } from '../components/ui/Icons'
import { HERO_SHADES, PRODUCTS, shadeNumber } from '../data/catalog'
import { imageSources, useImageReady } from '../lib/images'
import { useLocaleStore, useT } from '../i18n/useLocale'

const lipstick = PRODUCTS.find((p) => p.id === 'velvet-lip')!
const shades = lipstick.shades.filter((s) => HERO_SHADES.includes(s.id))


/**
 * Hero interactivo: el panel derecho se tiñe del labial elegido, el trazo cruza
 * los diez tonos de piel y la cursiva del título cambia al mismo color.
 */
export function Hero() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const [shadeId, setShadeId] = useState(shades[0].id)
  const shade = shades.find((s) => s.id === shadeId)!

  return (
    <section
      id="inicio"
      className="shade-scope grid border-b border-wine lg:grid-cols-[1.1fr_0.9fr]"
      style={{ '--shade': shade.hex } as CSSProperties}
    >
      {/* Sin fundido de opacidad en el título: se pinta de inmediato (mejor LCP) */}
      <motion.div
        initial={{ y: 14 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col justify-center px-4 py-14 sm:items-center sm:px-8 sm:py-16 lg:py-20"
      >
        {/* El bloque queda centrado en su columna. En tablet, además, el texto y el botón van centrados;
            en móvil y escritorio, alineados a la izquierda por dentro */}
        <div className="sm:max-lg:text-center">
        <h1 className="font-display text-[clamp(3.6rem,8vw,8.5rem)] leading-[0.92] tracking-[-0.02em] whitespace-nowrap text-wine">
          <span className="block">{t.hero.line1}</span>
          {/* "Tu musa." toma el color del labial elegido; al pasar el mouse, barrido en degradé hacia vino */}
          <em className="sweep sweep-text-from-shade inline-block">
            {t.hero.line2}
          </em>
          <span className="block">{t.hero.line3}</span>
        </h1>

        {/* El botón toma el color del labial elegido, con el mismo fundido que "Tu musa." */}
        <a
          href="#tonos"
          className="group mt-12 inline-flex items-center gap-3 whitespace-nowrap btn-lift bg-(--shade) px-8 py-4 text-sm font-medium tracking-[0.16em] text-cream uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
        >
          {t.hero.ctaShades}
          <ArrowRightIcon className="transition-transform duration-500 group-hover:translate-x-1" />
        </a>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ backgroundColor: shade.hex }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="flex flex-col justify-between gap-6 px-4 py-8 text-cream sm:px-8 sm:py-10 lg:px-10"
      >
        <p className="text-sm text-cream/90">{t.hero.product}</p>

        <HeroVisual shadeName={shade.name[locale]} color={shade.hex} />

        {/* Móvil: todo centrado. Tablet: alineado a la izquierda, el nombre fijo debajo de los labiales.
            Escritorio ancho: labiales a la izquierda y nombre a la derecha. */}
        <div className="flex flex-col items-center gap-5 sm:items-start xl:flex-row xl:items-end xl:justify-between">
          <fieldset>
            <legend className="mb-4 w-full text-center text-sm text-cream/90 sm:text-left">{t.hero.pickLabel}</legend>
            <div className="flex items-end justify-center gap-3 sm:justify-start">
              {shades.map((s) => (
                <label key={s.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="hero-shade"
                    value={s.id}
                    checked={s.id === shadeId}
                    onChange={() => setShadeId(s.id)}
                    className="peer sr-only"
                  />
                  <span className="sr-only">{s.name[locale]}</span>
                  {/* Camafeo: la punta del labial con un poco del tubo dorado, en un marco ovalado.
                      Elegido: sube y lleva un filete crema */}
                  <span
                    aria-hidden
                    className="block h-16 w-12 overflow-hidden rounded-[50%] outline-1 outline-offset-3 outline-cream/0 transition-[translate,outline-color] duration-300 peer-checked:-translate-y-2 peer-checked:outline-cream peer-focus-visible:outline-2 peer-focus-visible:outline-cream hover:-translate-y-1"
                    style={{ backgroundColor: s.hex }}
                  >
                    <img
                      src={`/images/lips/${s.id}-bullet.webp`}
                      alt=""
                      width={48}
                      height={64}
                      className="size-full object-cover"
                    />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p aria-hidden className="text-center sm:text-left xl:text-right">
            <span className="block text-sm text-cream/90">N.º {shadeNumber(lipstick, shade.id)}</span>
            <span className="font-display text-4xl">{shade.name[locale]}</span>
          </p>
        </div>
      </motion.div>
    </section>
  )
}

const PHOTO = imageSources('hero', 'model')
/** Máscara de labios hecha a mano y ubicada sobre la foto (scripts/fit-lips-mask.mjs) */
const LIPS_MASK = imageSources('hero', 'model-lips-fit').src
/** Mismo valor que el preload de index.html */
const PHOTO_SIZES = '448px'

/**
 * Con la foto de campaña: la modelo, y sus labios teñidos del labial elegido.
 * El color se pinta con una máscara de los labios (model-lips-fit, ver scripts/fit-lips-mask.mjs)
 * en modo multiply: conserva las luces, sombras y textura de la foto.
 * La foto se muestra de inmediato (es lo más grande de la primera vista, y index.html la precarga);
 * si no existiera, quedan los diez tonos de piel.
 */
function HeroVisual({ shadeName, color }: { shadeName: string; color: string }) {
  const t = useT()
  const [failed, setFailed] = useState(false)
  const maskReady = useImageReady(LIPS_MASK)

  if (failed) {
    return (
      <figure className="mx-auto w-full max-w-md">
        <ToneFan color={color} finish={lipstick.finish} />
        <figcaption className="sr-only">{t.hero.scale}</figcaption>
      </figure>
    )
  }

  const lips: CSSProperties = {
    backgroundColor: 'var(--shade)',
    maskImage: `url(${LIPS_MASK})`,
    WebkitMaskImage: `url(${LIPS_MASK})`,
    maskSize: 'cover',
    WebkitMaskSize: 'cover',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  }

  return (
    // En escritorio la foto se ajusta al alto de la pantalla: el hero completo (con los labiales) entra sin scroll
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:h-[min(34rem,calc(100svh-24rem))] lg:w-auto lg:max-w-full">
      <img
        src={PHOTO.src}
        srcSet={PHOTO.srcSet}
        sizes={PHOTO_SIZES}
        width={1122}
        height={1402}
        alt={t.hero.photoAlt(shadeName)}
        fetchPriority="high"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
      {maskReady && (
        <>
          <div aria-hidden className="absolute inset-0 opacity-85 mix-blend-multiply" style={lips} />
          {/* Segunda capa suave: devuelve un poco del brillo natural del labio */}
          <div aria-hidden className="absolute inset-0 opacity-25 mix-blend-soft-light" style={lips} />
        </>
      )}
    </div>
  )
}
