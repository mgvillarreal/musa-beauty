import { expect, test } from '@playwright/test'

test.describe('Navegación', () => {
  test('móvil: el menú se abre, avisa su estado y se cierra al elegir', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'El menú hamburguesa es para pantallas chicas')
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Abrir menú' })
    await toggle.click()
    await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true')

    const menu = page.locator('#mobile-menu')
    await expect(menu.getByRole('link')).toHaveText(['Más vendidos', 'Tonos', 'Reseñas', 'Rutina'])
    await menu.getByRole('link', { name: 'Reseñas' }).click()
    await expect(menu).toBeHidden()
    await expect(page).toHaveURL(/#resenas$/)
  })

  test('móvil: Esc cierra el menú', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'El menú hamburguesa es para pantallas chicas')
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-menu')).toBeHidden()
    await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused()
  })

  test('escritorio: el menú completo está siempre visible', async ({ page, isMobile }) => {
    test.skip(isMobile, 'En escritorio no hay menú hamburguesa')
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Principal' })
    await expect(nav.getByRole('link')).toHaveText(['Más vendidos', 'Tonos', 'Reseñas', 'Rutina'])
    await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeHidden()
  })

  test('newsletter: valida el correo y confirma', async ({ page }) => {
    await page.goto('/')
    const email = page.getByRole('textbox', { name: 'Tu correo' })
    await email.fill('hola@')
    await page.getByRole('button', { name: 'Suscribirme' }).click()
    await expect(page.getByRole('alert')).toHaveText('Revisa la dirección de correo: parece que falta algo.')
    await expect(email).toHaveAttribute('aria-invalid', 'true')

    await email.fill('hola@musa.com')
    await page.getByRole('button', { name: 'Suscribirme' }).click()
    await expect(page.getByRole('status').filter({ hasText: '¡Listo!' })).toBeVisible()
  })
})
