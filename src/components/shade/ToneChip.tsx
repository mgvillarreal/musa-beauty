import type { SkinTone } from '../../data/skinTones'

interface ToneChipProps {
  tone: SkinTone
  name: string
  checked: boolean
  label: string
  onSelect: () => void
  size?: 'md' | 'sm'
}

/**
 * Cuadrito para elegir un tono de piel (radio nativo, accesible con teclado).
 * Al pasar el mouse o llegar con el teclado aparece debajo un tooltip con su nombre ("Tono 4"),
 * sin tapar la etiqueta de arriba.
 * El tooltip es visual: para el lector de pantalla, el nombre ya va en el texto oculto del radio.
 */
export function ToneChip({ tone, name, checked, label, onSelect, size = 'md' }: ToneChipProps) {
  return (
    <label className="group relative cursor-pointer">
      <input type="radio" name={name} value={tone.id} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span className="sr-only">{label}</span>
      <span
        aria-hidden
        className={`block border border-wine/20 transition-transform peer-checked:-translate-y-1 peer-checked:outline-2 peer-checked:outline-offset-2 peer-checked:outline-wine peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-wine ${
          size === 'md' ? 'size-11' : 'size-9'
        }`}
        style={{ backgroundColor: tone.hex }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-full left-1/2 z-10 mt-3 -translate-x-1/2 -translate-y-1 bg-wine px-2.5 py-1 text-xs font-medium whitespace-nowrap text-cream opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100"
      >
        {label}
        {/* Flechita del tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-wine" />
      </span>
    </label>
  )
}
