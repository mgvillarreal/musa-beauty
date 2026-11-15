import { findMakeup, shadeNumber } from '../data/catalog'
import { SKINCARE } from '../data/skincare'
import type { Locale } from '../i18n/messages'
import type { ImageFolder } from './images'
import type { BagLine } from '../store/bagStore'

export interface ProductInfo {
  name: string
  /** "N.º 01 · Frambuesa" para maquillaje */
  variant?: string
  price: number
  image: { folder: ImageFolder; id: string }
  /** Color del tono (maquillaje): sirve de muestra mientras no hay foto */
  color?: string
}

/** Datos para mostrar cualquier producto (de la bolsa, más vendidos, etc.) */
export function productInfo(line: BagLine, locale: Locale): ProductInfo | null {
  if (line.kind === 'makeup') {
    const product = findMakeup(line.productId)
    if (!product) return null
    const shade = product.shades.find((s) => s.id === line.shadeId) ?? product.shades[0]
    return {
      name: product.name[locale],
      variant: `N.º ${shadeNumber(product, shade.id)} · ${shade.name[locale]}`,
      price: product.price,
      image: { folder: product.category === 'lips' ? 'lips' : 'blush', id: shade.id },
      color: shade.hex,
    }
  }
  const product = SKINCARE.find((p) => p.id === line.productId)
  if (!product) return null
  return { name: product.name[locale], price: product.price, image: { folder: 'skincare', id: product.image } }
}
