import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost/de');
  await page.getByRole('switch', { name: 'Switch to dark mode' }).check();
  await page.getByRole('link', { name: 'Fuhrpark' }).click();
  await page.getByRole('link', { name: 'Über uns' }).click();
  await page.getByRole('link', { name: 'Kontakt', exact: true }).click();
  await page.getByRole('link', { name: 'RAG' }).click();
  await page.getByRole('switch', { name: 'Switch to light mode' }).uncheck();
  await page.getByRole('button', { name: 'EN', exact: true }).click();
});