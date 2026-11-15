export type Localized = { es: string; en: string }

/**
 * Acabado: define cómo se pinta el color sobre la piel.
 * - matte / satin: cubren (el color se ve casi igual en todos los tonos)
 * - sheer: transparente, se mezcla con la piel (cambia mucho según el tono)
 */
export type Finish = 'matte' | 'satin' | 'sheer'

export interface Shade {
  id: string
  name: Localized
  hex: string
}

export interface Product {
  id: string
  category: 'lips' | 'cheeks'
  name: Localized
  price: number
  finish: Finish
  shades: Shade[]
}

/** Número de catálogo de un tono: "N.º 04", como en las cartas de color de lujo */
export function shadeNumber(product: Product, shadeId: string) {
  const index = product.shades.findIndex((s) => s.id === shadeId)
  return String(index + 1).padStart(2, '0')
}

export const findMakeup = (id: string) => PRODUCTS.find((p) => p.id === id)

export const PRODUCTS: Product[] = [
  {
    id: 'velvet-lip',
    category: 'lips',
    name: { es: 'Labial Terciopelo', en: 'Velvet Lipstick' },
    price: 420,
    finish: 'matte',
    shades: [
      { id: 'frambuesa', name: { es: 'Frambuesa', en: 'Raspberry' }, hex: '#8c1d3d' },
      { id: 'vino', name: { es: 'Vino', en: 'Merlot' }, hex: '#6d1a2c' },
      { id: 'rosa-antiguo', name: { es: 'Rosa antiguo', en: 'Antique Rose' }, hex: '#a35a5e' },
      { id: 'ladrillo', name: { es: 'Ladrillo', en: 'Brick' }, hex: '#8e3a2a' },
      { id: 'cacao', name: { es: 'Cacao', en: 'Cocoa' }, hex: '#6e3f31' },
      { id: 'ciruela', name: { es: 'Ciruela', en: 'Plum' }, hex: '#4b1a33' },
    ],
  },
  {
    id: 'silk-blush',
    category: 'cheeks',
    name: { es: 'Rubor Seda', en: 'Silk Blush' },
    price: 380,
    finish: 'sheer',
    shades: [
      { id: 'durazno', name: { es: 'Durazno', en: 'Peach' }, hex: '#e3876b' },
      { id: 'malva', name: { es: 'Malva', en: 'Mauve' }, hex: '#b56b7f' },
      { id: 'bronce', name: { es: 'Bronce', en: 'Bronze' }, hex: '#a5603e' },
      { id: 'fresa', name: { es: 'Fresa', en: 'Strawberry' }, hex: '#c23b5a' },
    ],
  },
]

export const DEFAULT_PRODUCT = PRODUCTS[0].id

/**
 * Labiales del hero: su color tiñe todo el panel, así que solo entran los que
 * dejan leer el texto crema encima (más de 6:1). Rosa antiguo queda fuera (4.2:1).
 */
export const HERO_SHADES = ['frambuesa', 'vino', 'ladrillo', 'cacao', 'ciruela']
