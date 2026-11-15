import type { SkinTone } from '../../data/skinTones'
import { skinImageId } from '../../data/skinTones'
import { imageSources, useImageReady } from '../../lib/images'

interface SkinPatchProps {
  tone: SkinTone
  x?: number
  y?: number
  width: number
  height: number
}

/**
 * Piel dentro de un SVG: el color plano siempre, y la foto encima cuando existe.
 * La foto se recorta para llenar el área (como object-fit: cover).
 */
export function SkinPatch({ tone, x = 0, y = 0, width, height }: SkinPatchProps) {
  const { small } = imageSources('skin', skinImageId(tone.id))
  const ready = useImageReady(small)

  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill={tone.hex} />
      {ready && <image href={small} x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid slice" />}
    </>
  )
}

/**
 * Textura de la piel sobre el producto: solo el relieve (poros, granulado), sin color ni brillo.
 * El mapa lo genera scripts/optimize-images.mjs en gris neutro; en modo overlay,
 * ese gris no cambia el color del labial, solo le suma textura.
 */
export function SkinTexture({
  tone,
  x = 0,
  y = 0,
  width,
  height,
  clipPath,
  blend = true,
}: SkinPatchProps & { clipPath: string; blend?: boolean }) {
  const texture = `/images/skin/${skinImageId(tone.id)}-texture.webp`
  const ready = useImageReady(texture)
  if (!ready) return null

  // Un grupo con recorte aísla la mezcla: por eso el overlay va en un grupo por fuera del recorte.
  // blend=false cuando quien lo usa ya aplica la mezcla en un grupo exterior.
  const clipped = (
    <g clipPath={clipPath}>
      <image href={texture} x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid slice" />
    </g>
  )
  return blend ? (
    <g opacity={0.8} style={{ mixBlendMode: 'overlay' }}>
      {clipped}
    </g>
  ) : (
    clipped
  )
}
