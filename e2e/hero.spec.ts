import { expect, test } from '@playwright/test'

test.describe('Hero: prueba de labial', () => {
  test('elegir un labial cambia el nombre, el número y el color del hero', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('#inicio')
    // El nombre visible del labial (el radio tiene además su nombre oculto para lectores)
    const shown = hero.locator('p[aria-hidden]')
    await expect(shown).toContainText('Frambuesa')

    await hero.getByRole('radio', { name: 'Ciruela' }).check({ force: true })
    await expect(shown).toContainText('Ciruela')
    await expect(shown).toContainText('N.º 06')

    // El color del labial vive en --shade: el botón principal lo usa de fondo
    await expect
      .poll(() => hero.evaluate((el) => getComputedStyle(el).getPropertyValue('--shade').trim()))
      .toBe('rgb(75, 26, 51)')
  })

  test('la foto de la modelo describe el labial elegido', async ({ page }) => {
    await page.goto('/')
    await page.locator('#inicio').getByRole('radio', { name: 'Ladrillo' }).check({ force: true })
    await expect(page.getByRole('img', { name: 'Modelo con el labial Ladrillo' })).toBeVisible()
  })

  test('los labiales se eligen con el teclado', async ({ page }) => {
    await page.goto('/')
    const first = page.locator('#inicio').getByRole('radio', { name: 'Frambuesa' })
    await first.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#inicio').getByRole('radio', { name: 'Vino' })).toBeChecked()
  })

  test('"Encontrar mi tono" lleva al selector', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Encontrar mi tono' }).click()
    await expect(page).toHaveURL(/#tonos$/)
    await expect(page.getByRole('heading', { name: 'Cada color, sobre tu piel.' })).toBeInViewport()
  })
})
