import { expect, test } from '@playwright/test'

test.describe('Idiomas', () => {
  test('cambia a inglés: textos, idioma del documento y título', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'English' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page).toHaveTitle('Musa · Beauty, made to measure')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your muse.')
    await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
  })

  test('los precios usan "$" en ambos idiomas', async ({ page }) => {
    await page.goto('/#productos')
    await expect(page.locator('#productos')).toContainText('$420')
    await page.getByRole('button', { name: 'English' }).click()
    await expect(page.locator('#productos')).toContainText('$420')
    await expect(page.locator('#productos')).not.toContainText('MX$')
  })

  test('los productos y las reseñas también se traducen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'English' }).click()
    await expect(page.locator('#tonos')).toContainText('Raspberry')
    await expect(page.locator('#productos')).toContainText('Vitamin C Glow Serum')
    await expect(page.locator('#resenas')).toContainText('How it looks on skin like yours')
  })

  test('recuerda el idioma al volver a la página', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'English' }).click()
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('link', { name: 'Find my shade' })).toBeVisible()
  })
})
