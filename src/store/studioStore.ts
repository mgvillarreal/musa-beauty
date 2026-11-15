import { create } from 'zustand'
import { DEFAULT_PRODUCT, PRODUCTS } from '../data/catalog'
import { DEFAULT_TONE } from '../data/skinTones'

interface StudioState {
  tone: number
  productId: string
  setTone: (tone: number) => void
  setProduct: (productId: string) => void
}

/** Estado del selector de tonos: qué piel y qué producto se están comparando */
export const useStudioStore = create<StudioState>()((set) => ({
  tone: DEFAULT_TONE,
  productId: DEFAULT_PRODUCT,
  setTone: (tone) => set({ tone }),
  setProduct: (productId) => set({ productId }),
}))

export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0]
