import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost/de');
  await page.getByRole('link', { name: 'Fuhrpark' }).click();
  await page.getByRole('link', { name: 'Über uns' }).click();
  await page.getByRole('button', { name: 'Kontakt aufnehmen' }).click();
});