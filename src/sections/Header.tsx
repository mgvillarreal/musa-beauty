import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BagIcon } from '../components/ui/Icons'
import { LanguageSwitch } from '../components/ui/LanguageSwitch'
import { Wordmark } from '../components/ui/Wordmark'
import { useT } from '../i18n/useLocale'
import { EASE } from '../lib/motion'
import { bagCount, useBagStore } from '../store/bagStore'

export function TopBar() {
  const t = useT()
  return (
    <div className="bg-wine">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 sm:px-8">
        <p className="text-xs tracking-wide text-cream">{t.topBar}</p>
        <LanguageSwitch />
      </div>
    </div>
  )
}

const NAV = [
  { href: '#productos', key: 'bestsellers' },
  { href: '#tonos', key: 'shades' },
  { href: '#resenas', key: 'reviews' },
  { href: '#rutina', key: 'routine' },
] as const

const linkStyle =
  'text-sm font-medium tracking-[0.14em] text-wine uppercase transition-colors hover:text-berry focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-berry'

/** true cuando la página bajó lo suficiente como para compactar el header */
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/**
 * Header fijo: al bajar se compacta (menos alto, logo más chico) para dejar más espacio al contenido.
 * Escritorio (xl, desde 1280 px): menú a la izquierda, logo al centro, bolsa a la derecha.
 * Más angosto (móvil, tablet y laptops chicas, donde el menú chocaba con el logo): logo a la izquierda; bolsa y botón de menú a la derecha. El menú se despliega
 * debajo del header (patrón "disclosure": el botón dice si está abierto; Esc o un enlace lo cierran).
 */
export function Header() {
  const t = useT()
  const scrolled = useScrolled()
  const count = useBagStore((s) => bagCount(s.items))
  const openBag = useBagStore((s) => s.openBag)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    // Si la pantalla crece hasta escritorio, el menú desplegable ya no corresponde
    const desktop = window.matchMedia('(min-width: 1280px)')
    const onResize = () => desktop.matches && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-wine bg-cream">
      <div
        className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center px-4 transition-[padding] duration-500 sm:px-8 xl:grid-cols-[1fr_auto_1fr] ${
          scrolled ? 'py-2.5' : 'py-4 xl:py-5'
        }`}
      >
        <nav aria-label={t.header.navLabel} className="hidden xl:block">
          <ul className="flex gap-7">
            {NAV.map((item) => (
              <li key={item.key}>
                <a href={item.href} className={linkStyle}>
                  {t.header.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Wordmark
          label={t.header.home}
          className={`origin-left transition-transform duration-500 xl:origin-center ${scrolled ? 'scale-75' : ''}`}
        />

        <div className="flex items-center gap-5 justify-self-end">
          {/* Sin aria-label: el nombre sale del texto visible ("Bolsa") más la cantidad en texto oculto,
              así quien usa control por voz puede decir lo que ve. En móvil "Bolsa" se oculta solo a la vista. */}
          <button type="button" onClick={openBag} className={`flex items-center gap-2 ${linkStyle}`}>
            <BagIcon />
            <span className="max-sm:sr-only">{t.header.bag}</span>
            <span className="sr-only">{t.header.bagItems(count)}</span>
            {/* El número entra desde abajo cada vez que cambia */}
            <span aria-hidden className="relative inline-flex h-5 min-w-4 overflow-hidden text-berry">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="block tabular-nums"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
            className="flex size-10 items-center justify-center text-wine focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-berry xl:hidden"
          >
            {/* Tres líneas que se cruzan en una X al abrir */}
            <span aria-hidden className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span className={`absolute top-1.5 left-0 block h-px w-6 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label={t.header.navLabel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden border-t border-line xl:hidden"
          >
            <ul className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.05 + i * 0.05 }}
                  className="border-b border-line last:border-b-0"
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-4 ${linkStyle}`}
                  >
                    {t.header.nav[item.key]}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
