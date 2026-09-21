import { test, expect } from "@playwright/test";

test.use({
  ignoreHTTPSErrors: true,
});

test("test", async ({ page, browserName }) => {
  test.setTimeout(60_000);

  test.skip(
    browserName !== "chromium",
    "Reservation test mutates shared backend data",
  );

  await page.goto("https://localhost:8443/de");

  // Login
  await page.getByRole("button", { name: "Anmeldemenü öffnen" }).click();
  await page.getByRole("menuitem", { name: "Anmelden" }).click();

  await page.waitForURL("https://localhost:8444/**");

  await page.getByRole("textbox", { name: "E-Mail" }).fill("hakan@test.de");
  await page.getByRole("textbox", { name: "Passwort" }).fill("Hakan1$%&");
  await page.getByRole("button", { name: "Anmelden" }).click();

  await page.waitForURL(
    (url) => url.origin === "https://localhost:8443" && url.pathname === "/de",
  );

  // Orte auswählen
  await page.getByRole("combobox", { name: "Abholort" }).click();
  await page.getByRole("option", { name: "Düsseldorf" }).click();

  await page.getByRole("combobox", { name: "Rückgabeort" }).click();
  await page.getByRole("option", { name: "Essen" }).click();

  // Abholung: 23.09.2026
  await page
    .getByRole("group", { name: "Abholung" })
    .getByLabel("Datum auswählen")
    .click();

  let picker = page.getByRole("dialog").last();

  await picker
    .locator('[role="gridcell"][data-timestamp="1790114400000"]')
    .filter({ visible: true })
    .click();

  await picker.getByRole("option", { name: "35 Minuten" }).click();

  await picker.getByRole("button", { name: "OK", exact: true }).click();

  // Rückgabe: 25.09.2026
  await page
    .getByRole("group", { name: "Rückgabe" })
    .getByLabel("Datum auswählen")
    .click();

  picker = page.getByRole("dialog").last();

  await picker
    .locator('[role="gridcell"][data-timestamp="1790287200000"]')
    .filter({ visible: true })
    .click();

  await picker.getByRole("option", { name: "11 Stunden" }).click();

  await picker.getByRole("button", { name: "OK", exact: true }).click();

  // Autos suchen
  await page.getByRole("button", { name: "Autos suchen" }).click();

  await page.waitForURL(
    (url) =>
      url.origin === "https://localhost:8443" && url.pathname === "/de/autos",
  );

  // Sortieren
  const sortierung = page.getByRole("combobox", { name: "Sortierung" });

  await expect(sortierung).toBeVisible();

  await sortierung.click();

  await page.getByRole("option", { name: "Preis absteigend" }).click();

  // Fahrzeug auswählen
  await page.getByRole("button", { name: "Weiter" }).first().click();

  // Reservieren
  await page.getByRole("button", { name: "Reservieren" }).click();

  // Logout – identisch zum funktionierenden Login/Logout-Test
  await page.getByRole("button", { name: "Benutzermenü öffnen" }).click();

  await page.getByRole("menuitem", { name: "Abmelden" }).click();

  await page.waitForURL(
    (url) => url.origin === "https://localhost:8443" && url.pathname === "/de",
  );

  await expect(
    page.getByRole("button", { name: "Anmeldemenü öffnen" }),
  ).toBeVisible();
});
