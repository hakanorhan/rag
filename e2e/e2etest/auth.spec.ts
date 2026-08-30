import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost/de');
  await page.getByRole('button', { name: 'Open login menu' }).click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username or email' }).fill('e2e-user');
  await page.getByRole('textbox', { name: 'Password' }).fill('e2e-password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});