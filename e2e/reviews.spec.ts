import { expect, test } from '@playwright/test'

test.describe('Reseñas por tono de piel', () => {
  test('comparten el tono con el selector', async ({ page }) => {
    await page.goto('/#tonos')
    await page.locator('#tonos').getByRole('radio', { name: 'Tono 8' }).check({ force: true })

    const reviews = page.locator('#resenas')
    await expect(reviews.getByRole('radio', { name: 'Tono 8' })).toBeChecked()
    await expect(reviews.getByRole('status')).toHaveText('2 reseñas del tono 8')
    await expect(reviews.getByText(/· Tono 8$/)).toBeVisible()
  })

  test('las flechas pasan de una reseña a otra y vuelven al principio', async ({ page }) => {
    await page.goto('/#resenas')
    const reviews = page.locator('#resenas')
    const counter = reviews.getByText(/^\d de \d$/)
    await expect(counter).toHaveText('1 de 3')

    const first = await reviews.locator('blockquote').textContent()
    await reviews.getByRole('button', { name: 'Reseña siguiente' }).click()
    await expect(counter).toHaveText('2 de 3')
    await expect(reviews.locator('blockquote')).not.toHaveText(first!)

    await reviews.getByRole('button', { name: 'Reseña anterior' }).click()
    await reviews.getByRole('button', { name: 'Reseña anterior' }).click()
    await expect(counter).toHaveText('3 de 3')
  })

  test('al cambiar de tono vuelve a la primera reseña', async ({ page }) => {
    await page.goto('/#resenas')
    const reviews = page.locator('#resenas')
    await reviews.getByRole('button', { name: 'Reseña siguiente' }).click()
    await reviews.getByRole('radio', { name: 'Tono 2' }).check({ force: true })
    await expect(reviews.getByText(/^\d de \d$/)).toHaveText('1 de 3')
  })
})
