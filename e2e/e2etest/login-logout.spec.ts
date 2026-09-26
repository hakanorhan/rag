import { test, expect } from "@playwright/test";

test.use({
  ignoreHTTPSErrors: true,
});

test("test", async ({ page }) => {
  await page.goto("https://localhost:8443/de");
  await page.getByRole("button", { name: "Anmeldemenü öffnen" }).click();
  await page.getByRole("menuitem", { name: "Anmelden" }).click();
  await page.waitForURL("https://localhost:8444/**");
  await page.getByRole("textbox", { name: "E-Mail" }).fill("hakan@test.de");
  await page.getByRole("textbox", { name: "Passwort" }).fill("Hakan1$%&");
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.waitForURL("https://localhost:8443/**");
  await page.getByRole("button", { name: "Benutzermenü öffnen" }).click();
  await page.getByRole("menuitem", { name: "Abmelden" }).click();
  await page.waitForURL(
    (url) => url.origin === "https://localhost:8443" && url.pathname === "/de",
  );
  await expect(
    page.getByRole("button", { name: "Anmeldemenü öffnen" }),
  ).toBeVisible();
});