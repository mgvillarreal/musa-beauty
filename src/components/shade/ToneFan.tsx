import { motion } from 'motion/react'
import type { Finish } from '../../data/catalog'
import { SKIN_TONES } from '../../data/skinTones'
import { FINISH_PAINT } from './paint'
import { SkinPatch, SkinTexture } from './SkinPatch'

const STRIP = 48
const GAP = 4
const WIDTH = SKIN_TONES.length * STRIP + (SKIN_TONES.length - 1) * GAP
const HEIGHT = 520

/** Pasada de labial que cruza todas las tiras de piel */
const STROKE = `M6 242C80 208 170 216 250 226S420 232 ${WIDTH - 10} 208C${WIDTH} 242 ${WIDTH - 10} 278 ${WIDTH - 32} 290C394 326 284 312 184 316C104 320 34 332 14 310C2 298 2 270 6 242Z`

interface ToneFanProps {
  color: string
  finish: Finish
}

/**
 * Los diez tonos de piel como muestrario, y el labial elegido pasado por encima.
 * Al cambiar de labial, el trazo cambia de color con una transición suave.
 */
export function ToneFan({ color, finish }: ToneFanProps) {
  const paint = FINISH_PAINT[finish]

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" aria-hidden focusable="false" style={{ isolation: 'isolate' }}>
      <defs>
        <clipPath id="fan-reveal">
          <motion.rect
            x="0"
            y="0"
            height={HEIGHT}
            initial={{ width: 0 }}
            animate={{ width: WIDTH }}
            transition={{ duration: 1.3, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
          />
        </clipPath>
        <filter id="fan-soft">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {SKIN_TONES.map((tone, i) => (
        <motion.g
          key={tone.id}
          initial={{ y: HEIGHT * 0.06 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
        >
          <SkinPatch tone={tone} x={i * (STRIP + GAP)} width={STRIP} height={HEIGHT} />
        </motion.g>
      ))}

      {/* La mezcla va fuera del grupo recortado: un recorte aísla la mezcla de lo que tiene adentro */}
      <g style={{ mixBlendMode: paint.blend }}>
        <g clipPath="url(#fan-reveal)">
          <path d={STROKE} fill={color} opacity={paint.opacity} filter="url(#fan-soft)" style={{ transition: 'fill 500ms ease' }} />
        </g>
      </g>
      {/* Con fotos, la textura de cada piel se ve a través del labial */}
      <clipPath id="fan-stroke">
        <path d={STROKE} />
      </clipPath>
      <g opacity={0.8} style={{ mixBlendMode: 'overlay' }}>
        <g clipPath="url(#fan-reveal)">
          {SKIN_TONES.map((tone, i) => (
            <SkinTexture
              key={tone.id}
              tone={tone}
              x={i * (STRIP + GAP)}
              width={STRIP}
              height={HEIGHT}
              clipPath="url(#fan-stroke)"
              blend={false}
            />
          ))}
        </g>
      </g>
    </svg>
  )
}
