/**
 * Genera una máscara de labios automática para la foto del hero (assets/images/hero/model-lips-auto.png).
 * La que usa la página es la hecha a mano (model-lips.png), ubicada con fit-lips-mask.mjs;
 * esta automática sirve de guía para ubicarla, o de respaldo si no hay máscara a mano.
 * Los labios son más rojizos que la piel: se mide la "rojez" (R−G)/R, se suaviza,
 * se separa con un umbral automático (Otsu), se conserva la zona más grande, se rellenan
 * los huecos (brillos), se suaviza y agranda apenas el contorno y se difumina menos de 1 px. El resultado es blanco con transparencia,
 * del mismo tamaño que la foto, para usarlo como mask-image en CSS.
 *
 * Uso: node scripts/make-lips-mask.mjs [left top width height]  (zona de búsqueda en px)
 */
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const src = path.join(root, 'assets/images/hero/model.png')
const out = path.join(root, 'assets/images/hero/model-lips-auto.png')
const [left, top, width, height] = process.argv.slice(2).map(Number)
const box = left ? { left, top, width, height } : { left: 560, top: 600, width: 320, height: 220 }

const { width: W, height: H } = await sharp(src).metadata()
const { data } = await sharp(src).extract(box).removeAlpha().raw().toBuffer({ resolveWithObject: true })

// 1) Mapa de rojez, suavizado para ignorar la textura fina
const n = box.width * box.height
const metric = Buffer.alloc(n)
for (let i = 0; i < n; i++) {
  const r = data[i * 3]
  const g = data[i * 3 + 1]
  metric[i] = Math.round(Math.max(0, Math.min(1, (r - g) / Math.max(r, 1))) * 255)
}
const smooth = await sharp(metric, { raw: { width: box.width, height: box.height, channels: 1 } }).blur(3).toColourspace('b-w').raw().toBuffer()

// 2) Umbral de Otsu: el que mejor separa los dos grupos (piel / labios)
const hist = new Array(256).fill(0)
for (const v of smooth) hist[v]++
let sum = 0
for (let i = 0; i < 256; i++) sum += i * hist[i]
let sumB = 0, wB = 0, best = 0, threshold = 0
for (let t = 0; t < 256; t++) {
  wB += hist[t]
  if (!wB) continue
  const wF = n - wB
  if (!wF) break
  sumB += t * hist[t]
  const between = wB * wF * (sumB / wB - (sum - sumB) / wF) ** 2
  if (between > best) [best, threshold] = [between, t]
}
const on = Uint8Array.from(smooth, (v) => (v > threshold ? 1 : 0))

// 3) Zona conectada más grande (los labios)
const label = new Int32Array(n).fill(-1)
let bestLabel = -1, bestSize = 0
for (let start = 0, current = 0; start < n; start++) {
  if (!on[start] || label[start] >= 0) continue
  const stack = [start]
  label[start] = current
  let size = 0
  while (stack.length) {
    const p = stack.pop()
    size++
    const x = p % box.width, y = (p / box.width) | 0
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy
      if (nx < 0 || ny < 0 || nx >= box.width || ny >= box.height) continue
      const q = ny * box.width + nx
      if (on[q] && label[q] < 0) {
        label[q] = current
        stack.push(q)
      }
    }
  }
  if (size > bestSize) [bestSize, bestLabel] = [size, current]
  current++
}

// 4) Rellenar huecos: todo lo que no se alcanza desde el borde por fuera de los labios es labio
const outside = new Uint8Array(n)
const stack = []
for (let x = 0; x < box.width; x++) stack.push(x, (box.height - 1) * box.width + x)
for (let y = 0; y < box.height; y++) stack.push(y * box.width, y * box.width + box.width - 1)
while (stack.length) {
  const p = stack.pop()
  if (outside[p] || label[p] === bestLabel) continue
  outside[p] = 1
  const x = p % box.width, y = (p / box.width) | 0
  if (x > 0) stack.push(p - 1)
  if (x < box.width - 1) stack.push(p + 1)
  if (y > 0) stack.push(p - box.width)
  if (y < box.height - 1) stack.push(p + box.width)
}
const lips = Buffer.from(Uint8Array.from(outside, (v) => (v ? 0 : 255)))

// 5) Borde. Probamos dos extremos y ninguno sirvió solo:
//    - mucho suavizado: forma redondeada y borde borroso (el color no llega al borde real);
//    - borde píxel a píxel: sigue el ruido de la foto y deja huecos en los brillos del labio.
//    Punto medio: contorno suave, agrandado ~1 px para cubrir el borde natural del labio
//    (cortar por debajo de la mitad agranda la forma), y un difuminado de menos de 1 px.
const gray = (buf) => sharp(buf, { raw: { width: box.width, height: box.height, channels: 1 } })
const toRaw = (img) => img.toColourspace('b-w').raw().toBuffer()
const shape = await toRaw(gray(lips).blur(2.5).threshold(100))
const alpha = await toRaw(gray(shape).blur(0.8))

// 6) Máscara a tamaño completo (blanco + alfa)
const full = Buffer.alloc(W * H * 4)
for (let i = 0; i < W * H; i++) full.fill(255, i * 4, i * 4 + 3)
for (let y = 0; y < box.height; y++)
  for (let x = 0; x < box.width; x++) full[((box.top + y) * W + box.left + x) * 4 + 3] = alpha[y * box.width + x]
await sharp(full, { raw: { width: W, height: H, channels: 4 } }).png().toFile(out)
console.log(`✓ máscara de labios: umbral ${threshold}, ${bestSize} px → ${path.relative(root, out)}`)
