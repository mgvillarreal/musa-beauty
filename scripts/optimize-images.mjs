/**
 * Convierte las fotos originales (assets/images/<carpeta>/*.png, fuera de git) a WebP en dos tamaños:
 *   public/images/<carpeta>/<id>.webp     ancho completo
 *   public/images/<carpeta>/<id>-sm.webp  mitad de ancho (móvil y miniaturas)
 *
 * Las pieles NO se recalibran al color exacto de la escala Monk: lo probamos y las fotos quedaban
 * como papel (claras) o cuero (profundas), porque los colores Monk son referencias apagadas.
 * En cambio, se mide el color promedio de cada foto y se guarda en src/data/skin-tones.json:
 * así los cuadritos para elegir el tono y el respaldo sin foto usan el mismo color que se ve en la foto.
 *
 * Para cada piel también se genera <id>-texture.webp: solo el relieve (poros, granulado) en gris neutro.
 * La página lo pone sobre el labial en modo overlay: suma textura sin cambiar el color del producto.
 *
 * Uso: npm run images
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const widths = JSON.parse(await readFile(path.join(root, 'src/data/image-widths.json'), 'utf8'))
const tones = JSON.parse(await readFile(path.join(root, 'src/data/skin-tones.json'), 'utf8'))

/** Color promedio de una foto, en hex */
async function averageColor(file) {
  const { channels } = await sharp(file).removeAlpha().stats()
  return '#' + channels.slice(0, 3).map((c) => Math.round(c.mean).toString(16).padStart(2, '0')).join('')
}

/** Mapa de textura: foto en gris menos su versión desenfocada, centrado en gris medio (paso alto) */
async function textureMap(file, width, out) {
  const gray = sharp(file).resize({ width, withoutEnlargement: true }).greyscale().removeAlpha()
  const { data, info } = await gray.clone().raw().toBuffer({ resolveWithObject: true })
  const blur = await gray.clone().blur(2).raw().toBuffer()
  const detail = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i++) detail[i] = Math.max(0, Math.min(255, 128 + 2 * (data[i] - blur[i])))
  await sharp(detail, { raw: { width: info.width, height: info.height, channels: 1 } }).webp({ quality: 75 }).toFile(out)
}

/**
 * Archivos de trabajo que no van a la web: copias viejas (OLD…), la máscara a mano sin ubicar
 * y la automática (solo sirven para generar model-lips-fit.png).
 */
const SKIP = /(^|\/)OLD|^hero\/model-lips(-auto)?\.png$/

let count = 0
for (const [folder, width] of Object.entries(widths)) {
  const source = path.join(root, 'assets/images', folder)
  const output = path.join(root, 'public/images', folder)
  const files = (await readdir(source).catch(() => [])).filter((f) => f.endsWith('.png') && !SKIP.test(`${folder}/${f}`))
  if (files.length === 0) continue
  await mkdir(output, { recursive: true })

  for (const name of files) {
    const id = name.replace(/\.png$/, '')
    const file = path.join(source, name)
    for (const [suffix, w] of [['', width], ['-sm', Math.round(width / 2)]]) {
      await sharp(file)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80, alphaQuality: 90 })
        .toFile(path.join(output, `${id}${suffix}.webp`))
    }

    // Labiales: además, un recorte de la punta con un poco del tubo dorado (miniaturas ovaladas del hero).
    // Todas las fotos tienen el mismo encuadre: labial centrado, punta arriba.
    if (folder === 'lips') {
      const { width: w, height: h } = await sharp(file).metadata()
      const crop = { left: Math.round(w * 0.31), top: Math.round(h * 0.02), width: Math.round(w * 0.38), height: Math.round(h * 0.5) }
      await sharp(file).extract(crop).resize({ width: 160 }).webp({ quality: 82 }).toFile(path.join(output, `${id}-bullet.webp`))
    }

    let note = ''
    const tone = folder === 'skin' && tones.find((t) => `tone-${String(t.id).padStart(2, '0')}` === id)
    if (tone) {
      tone.hex = await averageColor(file)
      note = `  (color de la foto: ${tone.hex})`
    }
    if (folder === 'skin') await textureMap(file, Math.round(width / 2), path.join(output, `${id}-texture.webp`))
    count++
    console.log(`✓ ${folder}/${id}${note}`)
  }
}
// Colores de piel actualizados con los de las fotos (el color Monk de referencia queda en "monk")
await writeFile(path.join(root, 'src/data/skin-tones.json'), JSON.stringify(tones, null, 2) + '\n')
console.log(count ? `${count} imágenes listas en public/images` : 'No hay imágenes en assets/images todavía')
