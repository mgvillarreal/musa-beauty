import { expect, test } from '@playwright/test'

test.describe('Selector de tonos', () => {
  test('muestra los 6 labiales y, al cambiar de producto, los 4 rubores', async ({ page }) => {
    await page.goto('/#tonos')
    const finder = page.locator('#tonos')
    await expect(finder.getByRole('listitem')).toHaveCount(6)

    await finder.getByRole('radio', { name: /Rubor Seda/ }).check({ force: true })
    await expect(finder.getByRole('listitem')).toHaveCount(4)
    await expect(finder.getByText('Durazno')).toBeVisible()
  })

  test('el tono de piel se elige y muestra su nombre en un tooltip', async ({ page }) => {
    await page.goto('/#tonos')
    const finder = page.locator('#tonos')
    const tone7 = finder.getByRole('radio', { name: 'Tono 7' })
    await tone7.check({ force: true })
    await expect(tone7).toBeChecked()

    const chip = finder.locator('label').filter({ has: page.getByRole('radio', { name: 'Tono 7' }) })
    // Centrado en pantalla, para que el header fijo no tape el cuadrito
    await chip.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await chip.hover()
    await expect(chip.getByText('Tono 7', { exact: true }).last()).toBeVisible()
  })

  test('cada color se agrega a la bolsa con su número de tono', async ({ page }) => {
    await page.goto('/#tonos')
    await page.getByRole('button', { name: 'Agregar Labial Terciopelo Ciruela a la bolsa' }).click()
    const bag = page.getByRole('dialog', { name: /Tu bolsa/ })
    await expect(bag).toBeVisible()
    await expect(bag.getByText('N.º 06 · Ciruela')).toBeVisible()
  })

  test('"Elegir tono" en más vendidos abre el selector con ese producto', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Elegir tono de Rubor Seda' }).click()
    await expect(page.locator('#tonos').getByRole('radio', { name: /Rubor Seda/ })).toBeChecked()
  })
})
