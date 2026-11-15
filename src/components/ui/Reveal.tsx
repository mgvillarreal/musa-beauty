import { motion, useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { DURATION, EASE } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Texto que sube desde detrás de una máscara al entrar en pantalla (una vez).
 * Envuelve cada línea de un título por separado para el efecto "línea por línea".
 * No se usa en el h1 del hero: ese debe pintarse de inmediato (LCP).
 *
 * Se observa el contenedor, no el texto: el texto empieza escondido bajo la máscara
 * y el navegador lo considera "no visible", así que nunca avisaría que entró en pantalla.
 */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })

  return (
    // La máscara recorta lo que se sale de la caja. Las cursivas de Bodoni se salen bastante:
    // la cola de la "y" y de la "f" baja mucho y la "f" sobresale a los costados.
    // El relleno agranda la máscara y el margen negativo lo compensa, así el texto no se mueve.
    <span ref={ref} className={`-mx-[0.15em] -mb-[0.3em] block overflow-hidden px-[0.15em] pb-[0.3em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '140%' }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: DURATION, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}
