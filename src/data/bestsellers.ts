/**
 * "Más vendidos": mezcla de maquillaje y cuidado facial.
 * La calificación y la cantidad de reseñas son datos de muestra para la demo.
 */
export interface Bestseller {
  kind: 'makeup' | 'skincare'
  id: string
  rating: number
  reviews: number
  badge?: 'new' | 'favorite'
}

export const BESTSELLERS: Bestseller[] = [
  { kind: 'makeup', id: 'velvet-lip', rating: 4.8, reviews: 1243, badge: 'favorite' },
  { kind: 'makeup', id: 'silk-blush', rating: 4.7, reviews: 862 },
  { kind: 'skincare', id: 'vitamin-c', rating: 4.9, reviews: 2018 },
  { kind: 'skincare', id: 'spf-fluid', rating: 4.8, reviews: 1577, badge: 'new' },
]
