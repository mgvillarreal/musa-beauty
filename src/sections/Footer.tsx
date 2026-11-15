import { useState, type FormEvent } from 'react'
import { ArrowRightIcon } from '../components/ui/Icons'
import { useT } from '../i18n/useLocale'

const AUTHOR = 'Gabriela Villarreal'

const SHOP_LINKS = [
  { href: '#productos', key: 'bestsellers' },
  { href: '#tonos', key: 'shades' },
  { href: '#resenas', key: 'reviews' },
  { href: '#rutina', key: 'routine' },
] as const

const heading = 'text-xs font-medium tracking-[0.2em] text-gold uppercase'
const link = 'text-cream/85 transition-colors hover:text-cream focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold'

export function Footer() {
  const t = useT()

  return (
    <footer className="bg-wine pt-20 pb-8 text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.9fr_1.3fr]">
        <div>
          <p className="font-display text-5xl text-gold italic">Musa</p>
          <p className="mt-4 max-w-xs font-display text-xl leading-snug">{t.footer.tagline}</p>
        </div>

        <nav aria-labelledby="footer-shop">
          <h2 id="footer-shop" className={heading}>
            {t.footer.shop}
          </h2>
          <ul className="mt-5 space-y-3">
            {SHOP_LINKS.map((item) => (
              <li key={item.key}>
                <a href={item.href} className={link}>
                  {t.header.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{t.footer.help}</h2>
          <ul className="mt-5 space-y-3 text-cream/85">
            {t.footer.helpItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <Newsletter />
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col gap-4 border-t border-cream/20 pt-6 text-xs text-cream/75 md:flex-row md:items-start md:justify-between">
          <p className="max-w-md">{t.footer.disclaimer}</p>
          <p>{t.footer.credit}</p>
        </div>
        <p className="mt-6 text-center text-sm text-cream/75">
          {t.footer.madeWith} <span className="text-cream">{AUTHOR}</span>
        </p>
      </div>
    </footer>
  )
}

/** Suscripción simulada: valida el correo y confirma, sin enviar nada */
function Newsletter() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'invalid' | 'done'>('idle')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setStatus(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? 'done' : 'invalid')
  }

  return (
    <div>
      <h2 className={heading}>{t.footer.newsletter}</h2>
      <p className="mt-5 text-cream/85">{t.footer.newsletterLead}</p>
      {status === 'done' ? (
        <p role="status" className="mt-5 font-display text-xl text-gold">
          {t.footer.subscribed}
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-5">
          <label htmlFor="newsletter-email" className="sr-only">
            {t.footer.email}
          </label>
          <div className="flex border-b border-cream/50 focus-within:border-gold">
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'invalid') setStatus('idle')
              }}
              placeholder={t.footer.email}
              aria-invalid={status === 'invalid'}
              aria-describedby={status === 'invalid' ? 'newsletter-error' : undefined}
              className="min-w-0 flex-1 bg-transparent py-3 text-cream placeholder:text-cream/60 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 py-3 pl-4 text-sm font-medium tracking-[0.16em] uppercase hover:text-gold focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {t.footer.subscribe}
              <ArrowRightIcon />
            </button>
          </div>
          {status === 'invalid' && (
            <p id="newsletter-error" role="alert" className="mt-2 text-sm text-gold">
              {t.footer.invalidEmail}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
