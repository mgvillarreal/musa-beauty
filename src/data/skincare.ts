import type { Localized } from './catalog'
import type { Concern, QuizAnswers, RoutineTime, SkinType } from './quiz'

/** Pasos de una rutina, en el orden en que se aplican */
export type StepId = 'cleanse' | 'tone' | 'treat' | 'eyes' | 'moisturize' | 'protect'
export const STEP_ORDER: StepId[] = ['cleanse', 'tone', 'treat', 'eyes', 'moisturize', 'protect']

/** Qué pasos entran según el tiempo que la persona le dedica */
const STEPS_BY_TIME: Record<RoutineTime, StepId[]> = {
  // Sin rutina: lo esencial para crear el hábito (sin sérums ni pasos extra)
  none: ['cleanse', 'moisturize', 'protect'],
  quick: ['cleanse', 'moisturize', 'protect'],
  steady: ['cleanse', 'treat', 'moisturize', 'protect'],
  ritual: ['cleanse', 'tone', 'treat', 'eyes', 'moisturize', 'protect'],
}

/** Foto que usa cada producto (assets/images/skincare/<image>.png): una por tipo de envase */
export type SkincareImage = 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'eye-cream' | 'sunscreen'

export interface SkincareProduct {
  id: string
  step: StepId
  image: SkincareImage
  name: Localized
  /** Por qué se recomienda: una línea, en lenguaje simple */
  note: Localized
  price: number
  /** Si se indica, solo para estos tipos de piel / preocupaciones */
  skinTypes?: SkinType[]
  concerns?: Concern[]
}

export const SKINCARE: SkincareProduct[] = [
  {
    id: 'gel-cleanser',
    step: 'cleanse',
    image: 'cleanser',
    name: { es: 'Gel Limpiador Purificante', en: 'Purifying Gel Cleanser' },
    note: { es: 'Quita el exceso de grasa sin dejar la piel tirante.', en: 'Removes excess oil without leaving skin tight.' },
    price: 320,
    skinTypes: ['oily', 'combination', 'balanced'],
  },
  {
    id: 'milk-cleanser',
    step: 'cleanse',
    image: 'cleanser',
    name: { es: 'Leche Limpiadora Calmante', en: 'Soothing Cleansing Milk' },
    note: { es: 'Limpia con suavidad y respeta la barrera de la piel.', en: 'Cleanses gently and respects the skin barrier.' },
    price: 340,
    skinTypes: ['dry', 'sensitive'],
  },
  {
    id: 'balancing-toner',
    step: 'tone',
    image: 'toner',
    name: { es: 'Tónico Equilibrante', en: 'Balancing Toner' },
    note: { es: 'Afina la textura y controla el brillo durante el día.', en: 'Refines texture and keeps shine in check all day.' },
    price: 290,
    skinTypes: ['oily', 'combination'],
  },
  {
    id: 'hydrating-toner',
    step: 'tone',
    image: 'toner',
    name: { es: 'Tónico Hidratante', en: 'Hydrating Toner' },
    note: { es: 'Una primera capa de hidratación que prepara la piel.', en: 'A first layer of hydration that preps the skin.' },
    price: 290,
    skinTypes: ['dry', 'sensitive', 'balanced'],
  },
  {
    id: 'vitamin-c',
    step: 'treat',
    image: 'serum',
    name: { es: 'Sérum Luminoso con Vitamina C', en: 'Vitamin C Glow Serum' },
    note: { es: 'Devuelve la luz a la piel apagada o cansada.', en: 'Brings light back to dull, tired skin.' },
    price: 560,
    concerns: ['glow'],
  },
  {
    id: 'niacinamide',
    step: 'treat',
    image: 'serum',
    name: { es: 'Sérum Poros con Niacinamida 10%', en: 'Niacinamide 10% Pore Serum' },
    note: { es: 'Reduce la apariencia de los poros y suaviza la textura.', en: 'Minimizes the look of pores and smooths texture.' },
    price: 480,
    concerns: ['pores'],
  },
  {
    id: 'dark-spot',
    step: 'treat',
    image: 'serum',
    name: { es: 'Sérum Antimanchas', en: 'Dark Spot Serum' },
    note: { es: 'Unifica el tono y atenúa las manchas con constancia.', en: 'Evens out tone and fades spots with steady use.' },
    price: 590,
    concerns: ['spots'],
  },
  {
    id: 'hyaluronic',
    step: 'treat',
    image: 'serum',
    name: { es: 'Sérum Ácido Hialurónico', en: 'Hyaluronic Acid Serum' },
    note: { es: 'Retiene la humedad: la piel se siente rellena y elástica.', en: 'Holds moisture in the skin so it feels plump and supple.' },
    price: 470,
    concerns: ['hydration'],
  },
  {
    id: 'peptides',
    step: 'treat',
    image: 'serum',
    name: { es: 'Sérum Firmeza con Péptidos', en: 'Peptide Firming Serum' },
    note: { es: 'Mejora la firmeza y suaviza las líneas finas.', en: 'Improves firmness and softens fine lines.' },
    price: 620,
    concerns: ['fineLines'],
  },
  {
    id: 'eye-cream',
    step: 'eyes',
    image: 'eye-cream',
    name: { es: 'Contorno de Ojos Seda', en: 'Silk Eye Cream' },
    note: { es: 'Descongestiona y alisa la zona más delicada del rostro.', en: 'De-puffs and smooths the most delicate area of the face.' },
    price: 450,
  },
  {
    id: 'gel-cream',
    step: 'moisturize',
    image: 'moisturizer',
    name: { es: 'Gel-Crema Ligera', en: 'Light Gel-Cream' },
    note: { es: 'Hidrata sin peso ni brillo.', en: 'Lightweight hydration with no shine.' },
    price: 420,
    skinTypes: ['oily', 'combination'],
  },
  {
    id: 'rich-cream',
    step: 'moisturize',
    image: 'moisturizer',
    name: { es: 'Crema Nutritiva', en: 'Nourishing Cream' },
    note: { es: 'Textura rica que calma la tirantez de la piel seca.', en: 'A rich texture that eases dry, tight skin.' },
    price: 480,
    skinTypes: ['dry'],
  },
  {
    id: 'calming-cream',
    step: 'moisturize',
    image: 'moisturizer',
    name: { es: 'Crema Calmante', en: 'Calming Cream' },
    note: { es: 'Sin perfume: reduce el enrojecimiento y la picazón.', en: 'Fragrance-free: reduces redness and itching.' },
    price: 460,
    skinTypes: ['sensitive'],
  },
  {
    id: 'daily-cream',
    step: 'moisturize',
    image: 'moisturizer',
    name: { es: 'Crema Hidratante Diaria', en: 'Daily Moisturizer' },
    note: { es: 'Mantiene el equilibrio de la piel todos los días.', en: 'Keeps skin balanced, every day.' },
    price: 410,
    skinTypes: ['balanced'],
  },
  {
    id: 'spf-fluid',
    step: 'protect',
    image: 'sunscreen',
    name: { es: 'Protector Solar Fluido SPF 50', en: 'SPF 50 Fluid Sunscreen' },
    note: { es: 'El paso que más protege: todas las mañanas, aunque esté nublado.', en: 'The most protective step: every morning, even when it’s cloudy.' },
    price: 390,
  },
]

const matches = (product: SkincareProduct, answers: Required<QuizAnswers>) =>
  (!product.skinTypes || product.skinTypes.includes(answers.skinType)) &&
  (!product.concerns || product.concerns.includes(answers.concern))

/** Rutina recomendada: un producto por paso, en orden de uso */
export function buildRoutine(answers: Required<QuizAnswers>): SkincareProduct[] {
  const steps = STEPS_BY_TIME[answers.time]
  return STEP_ORDER.filter((step) => steps.includes(step))
    .map((step) => SKINCARE.find((p) => p.step === step && matches(p, answers)))
    .filter((p): p is SkincareProduct => p !== undefined)
}
