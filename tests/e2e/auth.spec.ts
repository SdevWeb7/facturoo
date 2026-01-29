import { test, expect } from "@playwright/test";

test.describe("Authentication pages", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
  });

  test("register page renders", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();
  });

  test("login with invalid credentials stays on login page", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("invalid@test.com");
    await page.getByLabel("Mot de passe").fill("wrongpassword");
    await page.getByRole("button", { name: "Se connecter" }).click();
    // After failed login, user stays on login page (not redirected to dashboard)
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("/login");
  });

  test("unauthenticated user is redirected from dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("login page has link to register", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.getByRole("link", { name: /créer un compte|inscription/i });
    await expect(registerLink).toBeVisible();
  });
});

test.describe("Marketing pages", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Facturoo" })).toBeVisible();
  });

  test("pricing page renders", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: "Mensuel" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Annuel" })).toBeVisible();
    await expect(page.getByText("9,90")).toBeVisible();
  });

  test("landing page has CTA links", async ({ page }) => {
    await page.goto("/");
    const ctaLink = page.getByRole("link", { name: /essayer|commencer/i }).first();
    await expect(ctaLink).toBeVisible();
  });
});
