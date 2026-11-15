import { useEffect, useState } from 'react'
import IMAGE_WIDTHS from '../data/image-widths.json'

export type ImageFolder = keyof typeof IMAGE_WIDTHS

/** Rutas de una foto en sus dos tamaños (ver scripts/optimize-images.mjs) */
export function imageSources(folder: ImageFolder, id: string) {
  const base = `/images/${folder}/${id}`
  const width = IMAGE_WIDTHS[folder]
  return {
    src: `${base}.webp`,
    small: `${base}-sm.webp`,
    srcSet: `${base}-sm.webp ${width / 2}w, ${base}.webp ${width}w`,
  }
}

/** Resultado de cada foto ya probada: no se vuelve a pedir */
const status = new Map<string, boolean>()

/**
 * true cuando la foto cargó. Mientras tanto (o si no existe) la interfaz usa el color plano,
 * así la página funciona igual antes de tener las fotos.
 */
export function useImageReady(src: string) {
  // El caché es la fuente de verdad; este contador solo vuelve a pintar cuando la foto termina de cargar
  const [, rerender] = useState(0)

  useEffect(() => {
    if (status.has(src)) return
    let active = true
    const img = new Image()
    img.onload = () => {
      status.set(src, true)
      if (active) rerender((n) => n + 1)
    }
    img.onerror = () => status.set(src, false)
    img.src = src
    return () => {
      active = false
    }
  }, [src])

  return status.get(src) === true
}
