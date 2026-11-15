import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useRef, useState, type RefCallback } from 'react'
import { ArrowRightIcon } from '../components/ui/Icons'
import { ProductImage } from '../components/ui/ProductImage'
import { useBagStore } from '../store/bagStore'
import { QUIZ, QUIZ_ORDER, type QuizAnswers } from '../data/quiz'
import { buildRoutine } from '../data/skincare'
import { SECTION_TITLE } from '../lib/styles'
import { useLocaleStore, useT } from '../i18n/useLocale'
import { formatMoney } from '../lib/format'

const NUMERALS = ['1.', '2.', '3.', '4.', '5.', '6.']

/** intro → pregunta 0, 1, 2 → resultado */
type Stage = 'intro' | number | 'result'

const primaryButton =
  'inline-flex items-center gap-3 bg-wine px-6 py-3.5 text-sm font-medium tracking-[0.16em] text-cream uppercase btn-lift disabled:cursor-not-allowed disabled:opacity-40 disabled:filter-none disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine'
const textButton =
  'border-b border-wine pb-0.5 text-sm font-medium tracking-[0.16em] text-wine uppercase hover:border-berry hover:text-berry focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine'

export function RoutineQuiz() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const [stage, setStage] = useState<Stage>('intro')
  const [answers, setAnswers] = useState<QuizAnswers>({})

  // Al cambiar de etapa, el foco va al nuevo título: el lector de pantalla anuncia dónde estás.
  // Se enfoca cuando el título aparece (tras la animación de salida), no antes.
  const focusNext = useRef(false)
  const headingRef = useCallback<RefCallback<HTMLHeadingElement>>((el) => {
    if (el && focusNext.current) {
      focusNext.current = false
      el.focus()
    }
  }, [])
  const go = (next: Stage) => {
    focusNext.current = true
    setStage(next)
  }

  const restart = () => {
    setAnswers({})
    go('intro')
  }

  return (
    <section id="rutina" aria-labelledby="rutina-title" className="bg-berry text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-8 sm:py-16 md:grid-cols-[0.8fr_1.2fr] md:py-20 lg:py-24 xl:py-32">
        <div>
          <h2 id="rutina-title" className={SECTION_TITLE}>
            {t.routine.title}
          </h2>
          <p className="mt-6 max-w-md text-cream/85">{t.routine.lead}</p>
        </div>

        <div className="self-start bg-cream p-6 text-wine sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={String(stage)}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {stage === 'intro' && <Intro headingRef={headingRef} onStart={() => go(0)} />}

              {typeof stage === 'number' && (
                <Question
                  index={stage}
                  answers={answers}
                  headingRef={headingRef}
                  onAnswer={(value) => setAnswers((a) => ({ ...a, [QUIZ_ORDER[stage]]: value }))}
                  onBack={() => go(stage === 0 ? 'intro' : stage - 1)}
                  onNext={() => go(stage === QUIZ_ORDER.length - 1 ? 'result' : stage + 1)}
                />
              )}

              {stage === 'result' && answers.skinType && answers.concern && answers.time && (
                <Result answers={answers as Required<QuizAnswers>} headingRef={headingRef} onRestart={restart} locale={locale} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

type HeadingRef = RefCallback<HTMLHeadingElement>

function Intro({ headingRef, onStart }: { headingRef: HeadingRef; onStart: () => void }) {
  const t = useT()
  return (
    <>
      {/* Título solo para lectores de pantalla: recibe el foco al volver al inicio del test */}
      <h3 ref={headingRef} tabIndex={-1} className="sr-only">
        {t.routine.questionsTitle}
      </h3>
      <ol className="-mt-5">
        {QUIZ_ORDER.map((q, i) => (
          <li key={q} className="flex items-baseline gap-5 border-b border-line py-5">
            <span aria-hidden className="w-12 shrink-0 font-display text-3xl text-berry">
              {NUMERALS[i]}
            </span>
            <span className="font-display text-2xl leading-snug">{t.routine.questions[q]}</span>
          </li>
        ))}
      </ol>
      <button type="button" onClick={onStart} className={`mt-10 ${primaryButton}`}>
        {t.routine.start}
        <ArrowRightIcon />
      </button>
    </>
  )
}

interface QuestionProps {
  index: number
  answers: QuizAnswers
  headingRef: HeadingRef
  onAnswer: (value: string) => void
  onBack: () => void
  onNext: () => void
}

function Question({ index, answers, headingRef, onAnswer, onBack, onNext }: QuestionProps) {
  const t = useT()
  const question = QUIZ_ORDER[index]
  const options = QUIZ[question]
  const selected = answers[question]
  const last = index === QUIZ_ORDER.length - 1
  const labels = t.routine.options[question] as Record<string, { label: string; hint: string }>
  const titleId = `quiz-${question}`

  return (
    <>
      <div className="flex items-center gap-4">
        <p className="shrink-0 text-sm font-medium text-berry">{t.routine.progress(index + 1, QUIZ_ORDER.length)}</p>
        <div aria-hidden className="h-px flex-1 bg-line">
          <div className="h-px bg-berry transition-[width] duration-500" style={{ width: `${((index + 1) / QUIZ_ORDER.length) * 100}%` }} />
        </div>
      </div>

      <fieldset aria-labelledby={titleId} className="mt-6">
        <h3 ref={headingRef} id={titleId} tabIndex={-1} className="font-display text-3xl leading-tight outline-none sm:text-4xl">
          {t.routine.questions[question]}
        </h3>
        <div className="mt-6 grid gap-2">
          {options.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name={question}
                value={option}
                checked={selected === option}
                onChange={() => onAnswer(option)}
                className="peer sr-only"
              />
              <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border border-wine/25 px-5 py-4 transition-colors hover:border-wine peer-checked:border-wine peer-checked:bg-wine peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wine peer-checked:[&>em]:text-cream/80">
                <span className="font-display text-xl">{labels[option].label}</span>
                <em className="text-sm text-muted not-italic">{labels[option].hint}</em>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-6">
        <button type="button" onClick={onBack} className={textButton}>
          {t.routine.back}
        </button>
        <button type="button" onClick={onNext} disabled={!selected} className={primaryButton}>
          {last ? t.routine.finish : t.routine.next}
          <ArrowRightIcon />
        </button>
      </div>
    </>
  )
}

interface ResultProps {
  answers: Required<QuizAnswers>
  headingRef: HeadingRef
  onRestart: () => void
  locale: 'es' | 'en'
}

function Result({ answers, headingRef, onRestart, locale }: ResultProps) {
  const t = useT()
  const add = useBagStore((s) => s.add)
  const routine = buildRoutine(answers)
  const total = routine.reduce((sum, p) => sum + p.price, 0)

  return (
    <>
      <h3 ref={headingRef} tabIndex={-1} className="font-display text-4xl leading-tight outline-none sm:text-5xl">
        {t.routine.resultTitle}
      </h3>
      <p className="mt-2 text-muted">{t.routine.resultLead(routine.length, answers.time === 'none')}</p>

      <ol className="mt-6 border-t border-line">
        {routine.map((product, i) => (
          <li key={product.id} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 border-b border-line py-4 sm:gap-x-5">
            <ProductImage
              folder="skincare"
              id={product.image}
              width={64}
              className="size-16"
              fallback={
                <span aria-hidden className="flex size-16 items-center justify-center bg-wine/8 font-display text-2xl text-berry">
                  {NUMERALS[i]}
                </span>
              }
            />
            <div>
              <p className="text-sm font-medium text-berry">
                <span className="sr-only">{i + 1}. </span>
                {t.routine.steps[product.step]}
              </p>
              <p className="mt-1 font-display text-xl leading-snug">{product.name[locale]}</p>
              <p className="mt-1 text-sm text-muted">{product.note[locale]}</p>
            </div>
            <p className="pt-5 text-sm font-medium">{formatMoney(product.price, locale)}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 font-display text-2xl">
        {t.routine.total} <span className="text-berry">{formatMoney(total, locale)}</span>
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => add(routine.map((p) => ({ kind: 'skincare' as const, productId: p.id })))}
          className={primaryButton}
        >
          {t.routine.addAll}
          <ArrowRightIcon />
        </button>
        <button type="button" onClick={onRestart} className={textButton}>
          {t.routine.restart}
        </button>
      </div>
    </>
  )
}
