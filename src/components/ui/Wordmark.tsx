/** Logotipo: "Musa" en Bodoni cursiva, grande, como una firma */
export function Wordmark({ label, className = '' }: { label: string; className?: string }) {
  return (
    <a
      href="#inicio"
      className={`block font-display text-[2.75rem] leading-none tracking-tight text-berry italic transition-colors hover:text-wine focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-berry ${className}`}
    >
      <span aria-hidden>Musa</span>
      <span className="sr-only">{label}</span>
    </a>
  )
}
