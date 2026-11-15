import { expect, test, type Page } from '@playwright/test'

async function answer(page: Page, values: string[]) {
  const quiz = page.locator('#rutina')
  await quiz.getByRole('button', { name: 'Empezar el test' }).click()
  for (const [i, value] of values.entries()) {
    await quiz.locator('label').filter({ has: page.locator(`input[value="${value}"]`) }).click()
    await quiz.getByRole('button', { name: i === values.length - 1 ? 'Ver mi rutina' : 'Siguiente' }).click()
  }
}

test.describe('Test de rutina', () => {
  test('"Siguiente" se habilita recién al responder, y el foco va a la pregunta', async ({ page }) => {
    await page.goto('/#rutina')
    const quiz = page.locator('#rutina')
    await quiz.getByRole('button', { name: 'Empezar el test' }).click()

    const question = quiz.getByRole('heading', { name: '¿Cómo se siente tu piel a media tarde?' })
    await expect(question).toBeFocused()
    await expect(quiz.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
    await quiz.locator('label').filter({ hasText: 'Mixta' }).click()
    await expect(quiz.getByRole('button', { name: 'Siguiente' })).toBeEnabled()
  })

  test('el ritual completo arma 6 pasos en orden de uso', async ({ page }) => {
    await page.goto('/#rutina')
    await answer(page, ['combination', 'spots', 'ritual'])
    const steps = page.locator('#rutina ol li')
    await expect(steps).toHaveCount(6)
    await expect(steps.first()).toContainText('Gel Limpiador Purificante')
    await expect(steps.nth(2)).toContainText('Sérum Antimanchas')
    await expect(steps.last()).toContainText('Protector Solar')
    await expect(page.locator('#rutina')).toContainText('$2,460')
  })

  test('sin rutina previa: solo lo esencial, con su propio mensaje', async ({ page }) => {
    await page.goto('/#rutina')
    await answer(page, ['dry', 'hydration', 'none'])
    await expect(page.locator('#rutina ol li')).toHaveCount(3)
    await expect(page.locator('#rutina')).toContainText('Para empezar, lo esencial: 3 pasos')
    await expect(page.locator('#rutina')).toContainText('Leche Limpiadora Calmante')
  })

  test('la rutina completa se agrega a la bolsa', async ({ page }) => {
    await page.goto('/#rutina')
    await answer(page, ['oily', 'pores', 'quick'])
    await page.getByRole('button', { name: 'Agregar la rutina a la bolsa' }).click()
    await expect(page.getByRole('dialog', { name: /Tu bolsa/ })).toContainText('(3)')
  })

  test('"Volver a empezar" regresa al inicio del test', async ({ page }) => {
    await page.goto('/#rutina')
    await answer(page, ['balanced', 'glow', 'steady'])
    await page.getByRole('button', { name: 'Volver a empezar' }).click()
    await expect(page.getByRole('button', { name: 'Empezar el test' })).toBeVisible()
  })
})
