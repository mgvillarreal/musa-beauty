/**
 * Ubica una máscara de labios hecha a mano (recortada, de otro tamaño) sobre la foto del hero.
 *
 * Entrada:  assets/images/hero/model-lips.png      (labios recortados, con transparencia)
 * Guía:     assets/images/hero/model-lips-auto.png (máscara automática, alineada con la foto;
 *           si no existe, OLDmodel-lips.png)
 * Salida:   assets/images/hero/model-lips-fit.png  (del tamaño de la foto, lista para usar)
 *
 * Busca la escala y la posición en que la máscara nueva coincide mejor con la guía
 * (mayor intersección sobre unión), primero aproximada y después fina.
 *
 * Uso: npm run lips-fit
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const dir = path.join(root, 'assets/images/hero')
const photo = path.join(dir, 'model.png')
const hand = path.join(dir, 'model-lips.png')
const guide = existsSync(path.join(dir, 'model-lips-auto.png'))
  ? path.join(dir, 'model-lips-auto.png')
  : path.join(dir, 'OLDmodel-lips.png')
const out = path.join(dir, 'model-lips-fit.png')

const { width: W, height: H } = await sharp(photo).metadata()
const handMeta = await sharp(hand).metadata()
const alphaOf = async (input, width, height) =>
  sharp(input).resize(width, height, { fit: 'fill' }).extractChannel(3).toColourspace('b-w').raw().toBuffer()

// Caja de la guía: de ahí sale una primera estimación de escala y posición
const guideAlpha = await sharp(guide).extractChannel(3).toColourspace('b-w').raw().toBuffer()
let minX = W, minY = H, maxX = 0, maxY = 0
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (guideAlpha[y * W + x] > 127) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x)
      minY = Math.min(minY, y); maxY = Math.max(maxY, y)
    }
const box = { left: minX - 30, top: minY - 30, width: maxX - minX + 60, height: maxY - minY + 60 }
const guideBox = Buffer.alloc(box.width * box.height)
for (let y = 0; y < box.height; y++)
  for (let x = 0; x < box.width; x++) guideBox[y * box.width + x] = guideAlpha[(box.top + y) * W + box.left + x]

/** Intersección sobre unión entre la máscara a mano (a un ancho y posición dados) y la guía */
async function score(width, dx, dy, cache) {
  const height = Math.round((width * handMeta.height) / handMeta.width)
  const key = width
  if (!cache.has(key)) cache.set(key, await alphaOf(hand, width, height))
  const a = cache.get(key)
  let inter = 0, union = 0
  for (let y = 0; y < box.height; y++)
    for (let x = 0; x < box.width; x++) {
      const hx = x - dx, hy = y - dy
      const h = hx >= 0 && hy >= 0 && hx < width && hy < height ? a[hy * width + hx] : 0
      const g = guideBox[y * box.width + x]
      inter += Math.min(h, g)
      union += Math.max(h, g)
    }
  return inter / union
}

const cache = new Map()
const baseWidth = maxX - minX
let best = { s: 0, width: baseWidth, dx: 30, dy: 30 }
// Aproximada: escala ±12 % y posición ±12 px, en pasos gruesos
for (let width = Math.round(baseWidth * 0.88); width <= baseWidth * 1.12; width += 4)
  for (let dx = 18; dx <= 42; dx += 3)
    for (let dy = 18; dy <= 42; dy += 3) {
      const s = await score(width, dx, dy, cache)
      if (s > best.s) best = { s, width, dx, dy }
    }
// Fina: alrededor de la mejor, de a 1 px
const coarse = { ...best }
for (let width = coarse.width - 4; width <= coarse.width + 4; width++)
  for (let dx = coarse.dx - 3; dx <= coarse.dx + 3; dx++)
    for (let dy = coarse.dy - 3; dy <= coarse.dy + 3; dy++) {
      const s = await score(width, dx, dy, cache)
      if (s > best.s) best = { s, width, dx, dy }
    }

const height = Math.round((best.width * handMeta.height) / handMeta.width)
const placed = await sharp(hand).resize(best.width, height, { fit: 'fill' }).png().toBuffer()
await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } } })
  .composite([{ input: placed, left: box.left + best.dx, top: box.top + best.dy }])
  .png()
  .toFile(out)
console.log(
  `✓ máscara ubicada: ${best.width}×${height} px en (${box.left + best.dx}, ${box.top + best.dy}), coincidencia ${(best.s * 100).toFixed(1)} % → ${path.relative(root, out)}`,
)
