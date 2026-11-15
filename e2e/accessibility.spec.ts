import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Auditoría automática con axe-core contra WCAG 2.0/2.1 nivel A y AA
 * (incluye contraste de color) en los estados principales de la página.
 */
async function expectNoViolations(page: Page) {
  // Espera a que terminen las transiciones (la opacidad intermedia falsea el contraste)
  await page.waitForTimeout(1200)
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const summary = results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    targets: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary?.split('\n').slice(1).join(' ')}`),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
}

test.describe('Accesibilidad (axe-core, WCAG 2.1 AA)', () => {
  test.use({ reducedMotion: 'reduce' })

  test('página inicial en español', async ({ page }) => {
    await page.goto('/')
    await expectNoViolations(page)
  })

  test('página inicial en inglés', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'English' }).click()
    await expectNoViolations(page)
  })

  test('hero con cada labial (el color del panel cambia el contraste)', async ({ page }) => {
    await page.goto('/')
    for (const shade of ['Vino', 'Ladrillo', 'Cacao', 'Ciruela']) {
      await page.locator('#inicio').getByRole('radio', { name: shade }).check({ force: true })
      await expectNoViolations(page)
    }
  })

  test('selector con rubores y piel profunda', async ({ page }) => {
    await page.goto('/#tonos')
    await page.locator('#tonos').getByRole('radio', { name: /Rubor Seda/ }).check({ force: true })
    await page.locator('#tonos').getByRole('radio', { name: 'Tono 10' }).check({ force: true })
    await expectNoViolations(page)
  })

  test('menú móvil abierto', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'El menú hamburguesa es para pantallas chicas')
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await expectNoViolations(page)
  })

  test('bolsa abierta con productos', async ({ page }) => {
    await page.goto('/#tonos')
    await page.getByRole('button', { name: 'Agregar Labial Terciopelo Ciruela a la bolsa' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expectNoViolations(page)
  })

  test('test de rutina: pregunta y resultado', async ({ page }) => {
    await page.goto('/#rutina')
    const quiz = page.locator('#rutina')
    await quiz.getByRole('button', { name: 'Empezar el test' }).click()
    await quiz.locator('label').filter({ has: page.locator('input[value="sensitive"]') }).click()
    await expectNoViolations(page)

    await quiz.getByRole('button', { name: 'Siguiente' }).click()
    await quiz.locator('label').filter({ has: page.locator('input[value="fineLines"]') }).click()
    await quiz.getByRole('button', { name: 'Siguiente' }).click()
    await quiz.locator('label').filter({ has: page.locator('input[value="ritual"]') }).click()
    await quiz.getByRole('button', { name: 'Ver mi rutina' }).click()
    await expect(quiz.locator('ol li')).toHaveCount(6)
    await expectNoViolations(page)
  })

  test('newsletter con error', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox', { name: 'Tu correo' }).fill('hola')
    await page.getByRole('button', { name: 'Suscribirme' }).click()
    await expectNoViolations(page)
  })
})
