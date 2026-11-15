import type { SVGProps } from 'react'

/** Íconos de línea fina (1.5 px), acordes al trazo de la tipografía. Siempre decorativos. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export const BagIcon = ({ size = 20, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden focusable="false" {...p}>
    <path d="M4.5 8h15l-1 12.5h-13L4.5 8Z" />
    <path d="M9 10.5V6.5a3 3 0 0 1 6 0v4" />
  </svg>
)

export const ArrowRightIcon = ({ size = 18, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" {...p}>
    <path d="M3 12h17M14.5 6.5 20 12l-5.5 5.5" />
  </svg>
)

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const CloseIcon = ({ size = 20, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...line} aria-hidden focusable="false" {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const PlusIcon = ({ size = 16, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...line} aria-hidden focusable="false" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const MinusIcon = ({ size = 16, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...line} aria-hidden focusable="false" {...p}>
    <path d="M5 12h14" />
  </svg>
)
