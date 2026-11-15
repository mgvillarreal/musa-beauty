/** Calificación en estrellas. El texto para lectores de pantalla lo da quien la usa. */
export function Stars({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span aria-hidden className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => {
        // Relleno parcial para medias estrellas (4.7 → la quinta al 70%)
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <svg key={i} viewBox="0 0 24 24" width="14" height="14">
            <defs>
              <linearGradient id={`star-${i}-${Math.round(fill * 100)}`}>
                <stop offset={fill} stopColor="currentColor" />
                <stop offset={fill} stopColor="currentColor" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9 6.4 20l1.3-6.3L2.9 9.4l6.4-.7Z"
              fill={`url(#star-${i}-${Math.round(fill * 100)})`}
            />
          </svg>
        )
      })}
    </span>
  )
}
