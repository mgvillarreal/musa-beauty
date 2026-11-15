import { useId } from 'react'
import type { Finish } from '../../data/catalog'
import type { SkinTone } from '../../data/skinTones'
import { FINISH_PAINT, POWDER_PATH, SWATCH_PATH, swatchSeed } from './paint'
import { SkinPatch, SkinTexture } from './SkinPatch'

interface SwatchProps {
  tone: SkinTone
  color: string
  finish: Finish
  className?: string
  /** Llenar el recuadro recortando los bordes (como object-fit: cover) en vez de encajar */
  cover?: boolean
  /**
   * Proporción del marco (ancho / alto). El trazo siempre se ve entero y la piel se extiende
   * para llenar el marco: sirve para tarjetas verticales sin recortar la muestra.
   */
  frame?: number
}

/** Área visible del lienzo: el trazo vive en 100 × 64 y la piel crece hacia donde haga falta */
export interface Area {
  x: number
  y: number
  width: number
  height: number
}

function areaFor(frame?: number): Area {
  const base = 100 / 64
  if (!frame || Math.abs(frame - base) < 0.01) return { x: 0, y: 0, width: 100, height: 64 }
  if (frame < base) {
    const height = 100 / frame
    return { x: 0, y: 32 - height / 2, width: 100, height }
  }
  const width = 64 * frame
  return { x: 50 - width / 2, y: 0, width, height: 64 }
}

/**
 * Muestra de producto sobre la piel, como el swatch que se hace en el brazo en una tienda.
 * Decorativa: el nombre del tono va en texto aparte.
 *
 * El trazo no es una mancha lisa: un filtro SVG le da lo que tiene un swatch real.
 * 1. Bordes irregulares: un ruido fino desplaza el contorno unas décimas.
 * 2. Rayitas del arrastre: un ruido estirado en horizontal adelgaza el producto en líneas finas.
 * 3. Final gastado: la cobertura baja hacia el final del trazo (degradé en el relleno), y
 *    combinada con las rayitas, el producto se rompe en hebras donde la barra se levantó.
 * 4. Intensidad despareja, 5. borde con un poco más de pigmento y 6. un brillo cremoso
 *    a lo largo del trazo, cortado por las marcas del arrastre (como un labial recién aplicado).
 * Cada color usa su propia semilla de ruido, para que no se vean todos iguales.
 * Los productos en polvo (acabado transparente, como el rubor) se dibujan distinto: ver PowderSwatch.
 */
export function Swatch({ tone, color, finish, className = '', cover = false, frame }: SwatchProps) {
  const id = useId()
  const area = areaFor(frame)
  const seed = swatchSeed(color)

  return (
    <svg
      viewBox={`${area.x} ${area.y} ${area.width} ${area.height}`}
      preserveAspectRatio={cover ? 'xMidYMid slice' : undefined}
      className={className}
      aria-hidden
      focusable="false"
      style={{ isolation: 'isolate' }}
    >
      {finish === 'sheer' ? (
        <PowderSwatch id={id} tone={tone} color={color} seed={seed} area={area} />
      ) : (
        <CreamSwatch id={id} tone={tone} color={color} seed={seed} finish={finish} area={area} />
      )}
    </svg>
  )
}

interface LayerProps {
  id: string
  tone: SkinTone
  color: string
  seed: number
  area: Area
}

/** Producto cremoso (labial): barra arrastrada sobre la piel */
function CreamSwatch({ id, tone, color, seed, finish, area }: LayerProps & { finish: Finish }) {
  const paint = FINISH_PAINT[finish]
  // Mate: brillo apenas insinuado. Satinado: más luz.
  const shine = finish === 'satin' ? 0.6 : 0.38
  return (
    <>
      <defs>
        {/* Cobertura a lo largo del trazo: plena al inicio, se gasta en el último tramo */}
        <linearGradient id={`${id}-wear`} gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="94" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.62" stopColor="#fff" />
          <stop offset="0.86" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>

        <mask id={`${id}-wear-mask`} maskUnits="userSpaceOnUse" x={area.x} y={area.y} width={area.width} height={area.height}>
          <rect {...area} fill={`url(#${id}-wear)`} />
        </mask>

        <filter id={`${id}-swatch`} filterUnits="userSpaceOnUse" x={area.x} y={area.y} width={area.width} height={area.height} colorInterpolationFilters="sRGB">
          {/* 1. Bordes irregulares */}
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed={seed} result="edgeNoise" />
          <feDisplacementMap in="SourceAlpha" in2="edgeNoise" scale={paint.edge} xChannelSelector="R" yChannelSelector="G" result="ragged" />
          {/* 2. Rayitas: ruido muy estirado en horizontal, usado como opacidad */}
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.85" numOctaves="3" seed={seed + 7} result="streakNoise" />
          <feColorMatrix in="streakNoise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="streaks" />
          {/* 3. Cobertura = 2.1 × forma − 1.5 × rayitas: con cobertura plena da más de 1 (cuerpo sólido);
                 donde el degradé la baja, las rayitas ganan y el producto se rompe en hebras */}
          <feComposite in="ragged" in2="streaks" operator="arithmetic" k1="0" k2="2.1" k3="-1.5" k4="0" result="coverage" />
          <feGaussianBlur in="coverage" stdDeviation={paint.softness} result="soft" />
          <feFlood floodColor={color} />
          <feComposite in2="soft" operator="in" result="paint" />

          {/* 4. Intensidad despareja: un ruido amplio oscurece apenas algunas zonas (el producto no queda parejo) */}
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.12" numOctaves="2" seed={seed + 11} result="densityNoise" />
          <feColorMatrix in="densityNoise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.3 0 0 0 -0.1" result="densityAlpha" />
          <feComposite in="densityAlpha" in2="soft" operator="in" result="density" />

          {/* 5. Borde con un poco más de pigmento: franja interior del contorno, apenas más oscura */}
          <feGaussianBlur in="soft" stdDeviation="1.1" result="softBlur" />
          <feComposite in="soft" in2="softBlur" operator="arithmetic" k1="0" k2="2" k3="-2" k4="0" result="rimAlpha" />
          <feFlood floodColor="#1a0508" floodOpacity="0.22" />
          <feComposite in2="rimAlpha" operator="in" result="rim" />

          <feMerge>
            <feMergeNode in="paint" />
            <feMergeNode in="density" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>

        {/* 6. Brillo cremoso: una banda de luz a lo largo del trazo (algo arriba del centro)... */}
        <linearGradient id={`${id}-sheen-band`} gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="0" y2="42">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* ...cortada en líneas por las marcas del arrastre (ruido estirado en horizontal) */}
        <filter id={`${id}-sheen`} filterUnits="userSpaceOnUse" x={area.x} y={area.y} width={area.width} height={area.height}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.55" numOctaves="2" seed={seed + 21} result="lines" />
          <feColorMatrix in="lines" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3 0 0 0 -1.5" result="lineAlpha" />
          <feComposite in="lineAlpha" in2="SourceAlpha" operator="in" result="sheen" />
          <feGaussianBlur in="sheen" stdDeviation="0.35" />
        </filter>

        <clipPath id={`${id}-shape`}>
          <path d={SWATCH_PATH} />
        </clipPath>
      </defs>

      <SkinPatch tone={tone} {...area} />

      {/* Color en dos capas (la mezcla va por fuera del grupo filtrado, que la aislaría):
          una se multiplica con la piel y la integra; la otra cubre, como un labial cremoso */}
      <g opacity={0.2} style={{ mixBlendMode: 'multiply' }}>
        <path d={SWATCH_PATH} fill={`url(#${id}-wear)`} filter={`url(#${id}-swatch)`} />
      </g>
      <g opacity={paint.opacity * 0.9} style={{ mixBlendMode: paint.blend }}>
        <path d={SWATCH_PATH} fill={`url(#${id}-wear)`} filter={`url(#${id}-swatch)`} />
      </g>

      {/* Con foto de piel, los poros se ven a través del producto */}
      <SkinTexture tone={tone} {...area} clipPath={`url(#${id}-shape)`} />

      {/* Brillo cremoso (la mezcla "screen" va por fuera del recorte, que la aislaría) */}
      <g opacity={shine} style={{ mixBlendMode: 'screen' }}>
        <g clipPath={`url(#${id}-shape)`}>
          <rect {...area} fill={`url(#${id}-sheen-band)`} mask={`url(#${id}-wear-mask)`} filter={`url(#${id}-sheen)`} />
        </g>
      </g>
    </>
  )
}

/**
 * Producto en polvo (rubor): una pasada de pincel, no una barra.
 * 1. Forma ovalada y ancha, con el borde deformado y muy difuminado (el polvo se esparce).
 * 2. Más denso en el centro, se disipa hacia afuera (degradé radial en el relleno).
 * 3. Grano de polvo: ruido fino que adelgaza la cobertura en puntitos, y marcas suaves del pincel.
 * 4. Destellos: puntitos de luz sueltos, como el brillo de un rubor satinado.
 * El color va en dos capas: una se multiplica con la piel (realismo, cambia según el tono)
 * y otra se pinta normal (el pigmento del rubor se ve aunque la piel sea profunda).
 */
function PowderSwatch({ id, tone, color, seed, area }: LayerProps) {
  return (
    <>
      <defs>
        <radialGradient
          id={`${id}-density`}
          gradientUnits="userSpaceOnUse"
          cx="48"
          cy="34"
          r="42"
          gradientTransform="translate(48 34) scale(1 0.55) translate(-48 -34)"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </radialGradient>

        <filter id={`${id}-powder`} filterUnits="userSpaceOnUse" x={area.x} y={area.y} width={area.width} height={area.height} colorInterpolationFilters="sRGB">
          {/* 1. Borde irregular y difuso */}
          <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" seed={seed} result="edgeNoise" />
          <feDisplacementMap in="SourceAlpha" in2="edgeNoise" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="shaped" />
          <feGaussianBlur in="shaped" stdDeviation="2.3" result="soft" />
          {/* 3. Grano de polvo y marcas del pincel, como opacidad */}
          <feTurbulence type="turbulence" baseFrequency="1.4" numOctaves="1" seed={seed + 3} result="grainNoise" />
          <feColorMatrix in="grainNoise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="grain" />
          <feTurbulence type="fractalNoise" baseFrequency="0.025 0.55" numOctaves="2" seed={seed + 9} result="brushNoise" />
          <feColorMatrix in="brushNoise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="brush" />
          <feComposite in="soft" in2="grain" operator="arithmetic" k1="0" k2="1.3" k3="-0.35" k4="0" result="grainy" />
          <feComposite in="grainy" in2="brush" operator="arithmetic" k1="0" k2="1.15" k3="-0.3" k4="0" result="coverage" />
          <feFlood floodColor={color} />
          <feComposite in2="coverage" operator="in" />
        </filter>

        {/* 4. Destellos: solo los picos más altos de un ruido fino, en blanco, dentro de la forma */}
        <filter id={`${id}-shimmer`} filterUnits="userSpaceOnUse" x={area.x} y={area.y} width={area.width} height={area.height}>
          <feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="1" seed={seed + 5} result="sparkNoise" />
          <feColorMatrix in="sparkNoise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  14 0 0 0 -9.6" result="sparks" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="area" />
          <feComposite in="sparks" in2="area" operator="in" />
        </filter>

        <clipPath id={`${id}-shape`}>
          <path d={POWDER_PATH} />
        </clipPath>
      </defs>

      <SkinPatch tone={tone} {...area} />

      {/* Las mezclas van por fuera de los grupos filtrados (un filtro aísla la mezcla) */}
      <g opacity={0.5} style={{ mixBlendMode: 'multiply' }}>
        <path d={POWDER_PATH} fill={`url(#${id}-density)`} filter={`url(#${id}-powder)`} />
      </g>
      <g opacity={0.45}>
        <path d={POWDER_PATH} fill={`url(#${id}-density)`} filter={`url(#${id}-powder)`} />
      </g>
      <g opacity={0.38} style={{ mixBlendMode: 'screen' }}>
        <path d={POWDER_PATH} fill={`url(#${id}-density)`} filter={`url(#${id}-shimmer)`} />
      </g>

      <SkinTexture tone={tone} {...area} clipPath={`url(#${id}-shape)`} />
    </>
  )
}
