import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:4000')

    await expect(page).toHaveTitle(/BF-load Website Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('BF-load Website Template')
  })
})
