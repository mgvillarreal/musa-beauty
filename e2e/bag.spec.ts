import { expect, test } from '@playwright/test'

test.describe('Bolsa', () => {
  test('agregar abre la bolsa, atrapa el foco y Esc la cierra devolviendo el foco', async ({ page }) => {
    await page.goto('/#productos')
    const add = page.getByRole('button', { name: 'Agregar Sérum Luminoso con Vitamina C a la bolsa' })
    await add.click()

    const bag = page.getByRole('dialog', { name: /Tu bolsa/ })
    await expect(bag).toBeVisible()
    await expect(bag.getByRole('button', { name: 'Cerrar la bolsa' })).toBeFocused()
    await expect(bag.getByRole('status').first()).toHaveText('Sérum Luminoso con Vitamina C se agregó a la bolsa.')
    // La página de atrás queda inerte
    await expect(page.locator('#root > div').first()).toHaveAttribute('inert', '')

    await page.keyboard.press('Escape')
    await expect(bag).toBeHidden()
    await expect(add).toBeFocused()
    await expect(page.getByRole('button', { name: /Bolsa\s*, 1 producto$/ })).toBeVisible()
  })

  test('cantidades, envío gratis y subtotal', async ({ page }) => {
    await page.goto('/#productos')
    await page.getByRole('button', { name: 'Agregar Sérum Luminoso con Vitamina C a la bolsa' }).click()
    const bag = page.getByRole('dialog', { name: /Tu bolsa/ })
    await expect(bag).toContainText('Te faltan $640 para el envío gratis')

    await bag.getByRole('button', { name: 'Agregar una unidad de Sérum Luminoso con Vitamina C' }).click()
    await expect(bag).toContainText('Te faltan $80 para el envío gratis')
    await expect(bag.getByText('$1,120').last()).toBeVisible()

    await bag.getByRole('button', { name: 'Agregar una unidad de Sérum Luminoso con Vitamina C' }).click()
    await expect(bag).toContainText('Tienes envío gratis')
  })

  test('quitar el último producto deja la bolsa vacía', async ({ page }) => {
    await page.goto('/#productos')
    await page.getByRole('button', { name: 'Agregar Protector Solar Fluido SPF 50 a la bolsa' }).click()
    const bag = page.getByRole('dialog', { name: /Tu bolsa/ })
    await bag.getByRole('button', { name: 'Eliminar Protector Solar Fluido SPF 50' }).click()
    await expect(bag).toContainText('Tu bolsa está vacía.')
  })

  test('finalizar compra avisa que es una demo', async ({ page }) => {
    await page.goto('/#productos')
    await page.getByRole('button', { name: 'Agregar Protector Solar Fluido SPF 50 a la bolsa' }).click()
    const bag = page.getByRole('dialog', { name: /Tu bolsa/ })
    await bag.getByRole('button', { name: 'Finalizar compra' }).click()
    await expect(bag).toContainText('Es una tienda de demostración: no se realiza ningún cobro.')
  })
})
