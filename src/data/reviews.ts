import type { Localized } from './catalog'

/**
 * Reseñas de muestra (ficticias, para la demo). Cada una guarda el tono de piel de quien la escribe:
 * así se pueden mostrar primero las de personas con tu mismo tono.
 */
export interface Review {
  id: string
  name: string
  tone: number
  productId: string
  shadeId: string
  rating: number
  text: Localized
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Valeria M.',
    tone: 1,
    productId: 'velvet-lip',
    shadeId: 'rosa-antiguo',
    rating: 5,
    text: {
      es: 'Por fin un rosa que no me pone pálida. Se ve natural y dura toda la mañana.',
      en: 'Finally a pink that doesn’t wash me out. It looks natural and lasts all morning.',
    },
  },
  {
    id: 'r2',
    name: 'Sofía R.',
    tone: 2,
    productId: 'silk-blush',
    shadeId: 'malva',
    rating: 5,
    text: {
      es: 'Se va construyendo por capas: con una apenas se ve, con dos ya se nota.',
      en: 'Very buildable: one layer is barely there, two and it really shows.',
    },
  },
  {
    id: 'r3',
    name: 'Camila T.',
    tone: 3,
    productId: 'velvet-lip',
    shadeId: 'ladrillo',
    rating: 4,
    text: {
      es: 'El color es precioso en piel cálida. Le pongo bálsamo antes porque es bastante mate.',
      en: 'Gorgeous on warm skin. I use balm first because it’s quite matte.',
    },
  },
  {
    id: 'r4',
    name: 'Daniela P.',
    tone: 3,
    productId: 'silk-blush',
    shadeId: 'durazno',
    rating: 5,
    text: {
      es: 'Se funde con la piel, no queda en manchas. Mi favorito para todos los días.',
      en: 'It melts into the skin, no patches. My everyday favorite.',
    },
  },
  {
    id: 'r5',
    name: 'Andrea L.',
    tone: 4,
    productId: 'velvet-lip',
    shadeId: 'frambuesa',
    rating: 5,
    text: {
      es: 'Lo vi en el selector con mi tono y es exactamente así en persona.',
      en: 'I checked it on my skin tone in the shade finder and it looks exactly the same in person.',
    },
  },
  {
    id: 'r6',
    name: 'Mariana G.',
    tone: 5,
    productId: 'velvet-lip',
    shadeId: 'cacao',
    rating: 5,
    text: {
      es: 'Un nude que no me apaga. Lo compré sin probarlo en tienda y acerté.',
      en: 'A nude that doesn’t make me look tired. I bought it without trying it in store and got it right.',
    },
  },
  {
    id: 'r7',
    name: 'Lucía F.',
    tone: 5,
    productId: 'silk-blush',
    shadeId: 'fresa',
    rating: 4,
    text: {
      es: 'Pigmentado pero fácil de difuminar. El empaque dorado es hermoso.',
      en: 'Pigmented but easy to blend. The gold case is beautiful.',
    },
  },
  {
    id: 'r8',
    name: 'Isabela C.',
    tone: 6,
    productId: 'velvet-lip',
    shadeId: 'vino',
    rating: 5,
    text: {
      es: 'El vino perfecto para la noche. No se transfiere a la copa, lo comprobé.',
      en: 'The perfect wine shade for a night out. It doesn’t transfer to your glass, I checked.',
    },
  },
  {
    id: 'r9',
    name: 'Gabriela S.',
    tone: 6,
    productId: 'silk-blush',
    shadeId: 'bronce',
    rating: 5,
    text: {
      es: 'Me da un efecto de sol muy bonito, sin brillos exagerados.',
      en: 'It gives me a lovely sun-kissed look, no over-the-top shimmer.',
    },
  },
  {
    id: 'r10',
    name: 'Ana Paula V.',
    tone: 7,
    productId: 'velvet-lip',
    shadeId: 'frambuesa',
    rating: 5,
    text: {
      es: 'En mi piel se ve más intenso que en la foto del producto. Me encanta.',
      en: 'It’s more intense on my skin than in the product photo. Love it.',
    },
  },
  {
    id: 'r11',
    name: 'Renata O.',
    tone: 8,
    productId: 'silk-blush',
    shadeId: 'fresa',
    rating: 4,
    text: {
      es: 'De los pocos rubores que sí se ven en mi tono. Necesito dos capas.',
      en: 'One of the few blushes that actually shows up on my tone. I need two layers.',
    },
  },
  {
    id: 'r12',
    name: 'Jimena K.',
    tone: 8,
    productId: 'velvet-lip',
    shadeId: 'ciruela',
    rating: 5,
    text: {
      es: 'Ciruela es mi tono. Elegante, intenso y no reseca.',
      en: 'Plum is my shade. Elegant, intense and not drying.',
    },
  },
  {
    id: 'r13',
    name: 'Nia A.',
    tone: 9,
    productId: 'velvet-lip',
    shadeId: 'ladrillo',
    rating: 5,
    text: {
      es: 'El ladrillo en piel profunda es otra cosa. Me lo preguntan cada vez que lo uso.',
      en: 'Brick on deep skin is something else. People ask about it every time I wear it.',
    },
  },
  {
    id: 'r14',
    name: 'Amara D.',
    tone: 10,
    productId: 'velvet-lip',
    shadeId: 'vino',
    rating: 5,
    text: {
      es: 'Por fin una marca que muestra los colores en pieles como la mía antes de comprar.',
      en: 'Finally a brand that shows shades on skin like mine before I buy.',
    },
  },
]

/**
 * Reseñas para un tono: primero las de ese tono exacto.
 * Si no hay suficientes, se completan con las de los tonos más cercanos.
 */
export function reviewsForTone(tone: number, count = 3) {
  const sorted = [...REVIEWS].sort((a, b) => Math.abs(a.tone - tone) - Math.abs(b.tone - tone))
  const exact = sorted.filter((r) => r.tone === tone).length
  return { reviews: sorted.slice(0, count), exact }
}
