import TONES from './skin-tones.json'

/**
 * Diez tonos de piel basados en la escala Monk (Monk Skin Tone Scale, Dr. Ellis Monk, CC BY 4.0),
 * pensada para representar mejor la diversidad que las escalas clásicas.
 * - hex: color promedio de la foto de cada tono (lo escribe scripts/optimize-images.mjs),
 *   para que el cuadrito de la interfaz coincida con la foto.
 * - monk: color de referencia de la escala original.
 */
export interface SkinTone {
  id: number
  hex: string
  monk: string
}

export const SKIN_TONES: SkinTone[] = TONES

export const DEFAULT_TONE = 5

/** Nombre de archivo de la foto de cada tono: tone-01 … tone-10 */
export const skinImageId = (id: number) => `tone-${String(id).padStart(2, '0')}`
