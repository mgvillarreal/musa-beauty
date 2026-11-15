import type { ReactNode } from 'react'
import { imageSources, useImageReady, type ImageFolder } from '../../lib/images'

interface ProductImageProps {
  folder: ImageFolder
  id: string
  /** Ancho mostrado en px: el navegador elige el tamaño de foto justo */
  width: number
  className?: string
  /** Qué mostrar mientras no hay foto (null = nada) */
  fallback?: ReactNode
}

/** Foto de producto (fondo crema, sin recortes). Decorativa: el nombre va en texto al lado. */
export function ProductImage({ folder, id, width, className = '', fallback = null }: ProductImageProps) {
  const { src, small, srcSet } = imageSources(folder, id)
  const ready = useImageReady(small)
  if (!ready) return <>{fallback}</>

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={`${width}px`}
      width={width}
      height={width}
      alt=""
      loading="lazy"
      decoding="async"
      className={`aspect-square object-cover ${className}`}
    />
  )
}
