import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8443/de');
  await page.getByRole('link', { name: 'Fuhrpark' }).click();
  await page.getByRole('link', { name: 'Über uns' }).click();
  await page.getByRole('link', { name: 'Kontakt', exact: true }).click();
  await page.getByRole('link', { name: 'RAG' }).click();
  await page.getByRole('link', { name: 'Kontakt' }).click();
  await page.getByRole('link', { name: 'Über uns' }).click();
  await page.getByRole('button', { name: 'Kontakt aufnehmen' }).click();
  await page.getByRole('switch', { name: 'Zum dunklen Modus wechseln' }).check();
  await page.getByRole('link', { name: 'RAG' }).click();
  await page.getByRole('link', { name: 'Fuhrpark' }).click();
  await page.getByRole('link', { name: 'Über uns' }).click();
  await page.getByRole('link', { name: 'Kontakt', exact: true }).click();
});