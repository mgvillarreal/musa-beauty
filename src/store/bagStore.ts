import { create } from 'zustand'

export interface BagLine {
  kind: 'makeup' | 'skincare'
  productId: string
  /** Solo maquillaje: el tono elegido */
  shadeId?: string
}

export interface BagItem extends BagLine {
  key: string
  quantity: number
}

interface BagState {
  items: BagItem[]
  open: boolean
  /** Último producto agregado: el panel lo anuncia al lector de pantalla */
  lastAdded: string | null
  add: (lines: BagLine | BagLine[]) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  openBag: () => void
  closeBag: () => void
}

const keyOf = (line: BagLine) => [line.kind, line.productId, line.shadeId].filter(Boolean).join(':')

/** Bolsa de compra: agregar abre el panel lateral para confirmar sin salir de la página */
export const useBagStore = create<BagState>()((set) => ({
  items: [],
  open: false,
  lastAdded: null,
  add: (lines) =>
    set((state) => {
      const items = [...state.items]
      const list = Array.isArray(lines) ? lines : [lines]
      for (const line of list) {
        const key = keyOf(line)
        const index = items.findIndex((i) => i.key === key)
        if (index >= 0) items[index] = { ...items[index], quantity: items[index].quantity + 1 }
        else items.push({ ...line, key, quantity: 1 })
      }
      return { items, open: true, lastAdded: keyOf(list[list.length - 1]) }
    }),
  setQuantity: (key, quantity) =>
    set((state) => ({
      items: quantity <= 0 ? state.items.filter((i) => i.key !== key) : state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
    })),
  remove: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
  openBag: () => set({ open: true }),
  closeBag: () => set({ open: false, lastAdded: null }),
}))

export const bagCount = (items: BagItem[]) => items.reduce((sum, i) => sum + i.quantity, 0)

export const FREE_SHIPPING = 1200
