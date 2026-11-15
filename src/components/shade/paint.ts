import type { Finish } from '../../data/catalog'

/**
 * Cómo se pinta un color sobre la piel según su acabado.
 * Lo transparente se multiplica con la piel: en pieles profundas casi desaparece,
 * que es justo lo que el selector quiere mostrar con honestidad.
 * edge: cuánto se deforma el borde; softness: cuánto se difumina (polvo > crema).
 */
export const FINISH_PAINT: Record<
  Finish,
  { opacity: number; blend: 'normal' | 'multiply'; sheen: number; edge: number; softness: number }
> = {
  // Barra cremosa: borde definido
  matte: { opacity: 0.97, blend: 'normal', sheen: 0, edge: 0.8, softness: 0.3 },
  satin: { opacity: 0.93, blend: 'normal', sheen: 0.16, edge: 0.8, softness: 0.35 },
  // Polvo transparente (rubor): lo dibuja PowderSwatch; estos valores los usa el muestrario del hero
  sheer: { opacity: 0.72, blend: 'multiply', sheen: 0, edge: 2.4, softness: 1.3 },
}

/**
 * Forma de un swatch de barra de labial (en un lienzo de 100 × 64):
 * inicio redondeado y firme donde se apoya la barra, cuerpo de ancho casi parejo
 * (un swatch real no termina en punta) y un final recto que el filtro desgasta.
 */
export const SWATCH_PATH =
  'M14 25.5C10.5 27 9.5 36 13 40.5C15 42.5 19 43 24 42.8C40 42.4 58 42 74 41.4C82 41 88 40.6 92.5 40C95 39.4 95.2 32.6 92.5 31.8C86 30.6 80 30 72 29.4C56 28 38 25.4 22 24.6C18.5 24.4 15.8 24.7 14 25.5Z'

/** Pasada de pincel de un producto en polvo (rubor): ovalada, ancha y apenas inclinada */
export const POWDER_PATH = 'M12 36C12 26.5 26 21.5 46 21C66 20.5 85 23.5 88.5 31C92 39 78 45.5 56 46.5C34 47.5 12 45.5 12 36Z'

/** Semilla de ruido estable por color: cada tono tiene sus propias rayitas */
export function swatchSeed(color: string) {
  let hash = 0
  for (const char of color) hash = (hash * 31 + char.charCodeAt(0)) % 997
  return hash
}

