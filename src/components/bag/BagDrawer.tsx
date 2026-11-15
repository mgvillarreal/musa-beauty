import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocaleStore, useT } from '../../i18n/useLocale'
import { formatMoney } from '../../lib/format'
import { EASE } from '../../lib/motion'
import { productInfo } from '../../lib/products'
import { FREE_SHIPPING, bagCount, useBagStore } from '../../store/bagStore'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { CloseIcon, MinusIcon, PlusIcon } from '../ui/Icons'
import { ProductThumb } from '../ui/ProductThumb'

const iconButton =
  'flex size-8 items-center justify-center border border-wine/25 text-wine transition-colors hover:border-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'

/**
 * Bolsa lateral. Mientras está abierta, el resto de la página queda inerte (App),
 * el foco queda atrapado aquí, Esc la cierra y el foco vuelve al botón que la abrió.
 */
export function BagDrawer() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const { items, open, lastAdded, setQuantity, remove, closeBag } = useBagStore()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [showDemo, setShowDemo] = useState(false)

  const lines = items.flatMap((item) => {
    const info = productInfo(item, locale)
    return info ? [{ item, info }] : []
  })
  const subtotal = lines.reduce((sum, l) => sum + l.info.price * l.item.quantity, 0)
  const missing = Math.max(0, FREE_SHIPPING - subtotal)
  const added = lines.find((l) => l.item.key === lastAdded)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeBag()
      if (event.key !== 'Tab' || !panelRef.current) return
      // Foco atrapado: Tab desde el último vuelve al primero, y al revés
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      setShowDemo(false)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [open, closeBag])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-wine/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBag}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream text-wine"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-wine px-6 py-5">
              <h2 id="bag-title" className="font-display text-3xl">
                {t.bagPanel.title} <span className="text-berry">({bagCount(items)})</span>
              </h2>
              <button ref={closeRef} type="button" onClick={closeBag} aria-label={t.bagPanel.close} className={iconButton}>
                <CloseIcon size={18} />
              </button>
            </div>

            <p role="status" className="sr-only">
              {added ? t.bagPanel.added(added.info.name) : ''}
            </p>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
                <p className="font-display text-3xl">{t.bagPanel.empty}</p>
                <a
                  href="#productos"
                  onClick={closeBag}
                  className="border-b border-wine pb-0.5 text-sm font-medium tracking-[0.16em] uppercase hover:text-berry focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
                >
                  {t.bagPanel.emptyCta}
                </a>
              </div>
            ) : (
              <>
                {/* Envío gratis: el mismo beneficio que anuncia la barra superior */}
                <div className="border-b border-line px-6 py-4">
                  <p className="text-sm">
                    {missing > 0 ? t.bagPanel.shippingLeft(formatMoney(missing, locale)) : t.bagPanel.shippingFree}
                  </p>
                  <div aria-hidden className="mt-2 h-1 bg-wine/10">
                    <motion.div
                      className="h-1 bg-berry"
                      initial={false}
                      animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                </div>

                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map(({ item, info }) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-5"
                      >
                        <ProductThumb info={info} size={80} className="size-20" />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="font-display text-xl leading-tight">{info.name}</p>
                            <p className="text-sm font-medium">{formatMoney(info.price * item.quantity, locale)}</p>
                          </div>
                          {info.variant && <p className="text-sm text-muted">{info.variant}</p>}
                          <div className="mt-2 flex items-center justify-between">
                            <div role="group" aria-label={t.bagPanel.quantity(info.name)} className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setQuantity(item.key, item.quantity - 1)}
                                aria-label={t.bagPanel.decrease(info.name)}
                                className={iconButton}
                              >
                                <MinusIcon />
                              </button>
                              <span className="w-5 text-center tabular-nums">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(item.key, item.quantity + 1)}
                                aria-label={t.bagPanel.increase(info.name)}
                                className={iconButton}
                              >
                                <PlusIcon />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(item.key)}
                              aria-label={t.bagPanel.remove(info.name)}
                              className={iconButton}
                            >
                              <CloseIcon size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-wine px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-medium">{t.bagPanel.subtotal}</p>
                    <AnimatedNumber value={subtotal} format={(v) => formatMoney(v, locale)} className="font-display text-3xl" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemo(true)}
                    className="btn-lift bg-wine mt-5 w-full px-6 py-4 text-sm font-medium tracking-[0.16em] text-cream uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
                  >
                    {t.bagPanel.checkout}
                  </button>
                  <p role="status" className="mt-3 min-h-5 text-center text-xs text-muted">
                    {showDemo ? t.bagPanel.demo : ''}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
