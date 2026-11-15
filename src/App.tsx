import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { BagDrawer } from './components/bag/BagDrawer'
import { useT } from './i18n/useLocale'
import { Bestsellers } from './sections/Bestsellers'
import { Footer } from './sections/Footer'
import { Header, TopBar } from './sections/Header'
import { Hero } from './sections/Hero'
import { Reviews } from './sections/Reviews'
import { RoutineQuiz } from './sections/RoutineQuiz'
import { ShadeStudio } from './sections/ShadeStudio'
import { Statement } from './sections/Statement'
import { useBagStore } from './store/bagStore'

export default function App() {
  const t = useT()
  const bagOpen = useBagStore((s) => s.open)

  // Idioma del documento y título de la pestaña siguen al idioma elegido
  useEffect(() => {
    document.documentElement.lang = t.htmlLang
    document.title = t.meta.title
  }, [t])

  return (
    // reducedMotion="user": si el sistema pide menos movimiento, Motion lo respeta
    <MotionConfig reducedMotion="user">
      {/* Con la bolsa abierta, el resto de la página queda inerte: ni foco ni lector de pantalla */}
      <div inert={bagOpen}>
        <TopBar />
        <Header />
        <main>
          <Hero />
          <Statement />
          <Bestsellers />
          <ShadeStudio />
          <Reviews />
          <RoutineQuiz />
        </main>
        <Footer />
      </div>
      <BagDrawer />
    </MotionConfig>
  )
}
