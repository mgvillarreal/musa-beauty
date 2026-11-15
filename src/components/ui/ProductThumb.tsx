import { SKIN_TONES } from '../../data/skinTones'
import type { ProductInfo } from '../../lib/products'
import { Swatch } from '../shade/Swatch'
import { ProductImage } from './ProductImage'

/**
 * Miniatura de producto: la foto si existe; si no, la muestra del tono sobre piel (maquillaje)
 * o un bloque con la inicial (cuidado facial).
 */
export function ProductThumb({ info, size = 80, className = '' }: { info: ProductInfo; size?: number; className?: string }) {
  const fallback = info.color ? (
    <Swatch tone={SKIN_TONES[4]} color={info.color} finish="matte" cover className={className} />
  ) : (
    <span aria-hidden className={`flex items-center justify-center bg-wine/8 font-display text-3xl text-berry ${className}`}>
      {info.name.charAt(0)}
    </span>
  )
  return <ProductImage folder={info.image.folder} id={info.image.id} width={size} className={className} fallback={fallback} />
}
