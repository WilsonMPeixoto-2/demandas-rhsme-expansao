import { navigateUsingSiteMenu } from './helpers/siteNavigation';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function expectAccessible(page: Page, context: string, include?: string) {
  // Aguarda as transições funcionais terminarem para auditar o estado visual estável.
  await page.waitForTimeout(500);
  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (include) builder = builder.include(include);
  const result = await builder.analyze();

  expect(result.violations, `${context}: ${JSON.stringify(result.violations, null, 2)}`).toEqual([]);
}

async function login(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

test('login e solicitação de acesso não apresentam violações críticas de acessibilidade', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  await expect(page.locator('.login-card-editorial')).toHaveCSS('animation-name', 'none');
  await expectAccessible(page, 'login');

  await page.getByRole('button', { name: /primeiro acesso/i }).click();
  await expect(page.getByLabel(/seu e-mail corporativo/i)).toBeVisible();
  await expectAccessible(page, 'primeiro acesso');
});

test('solicitação e link inválido de recuperação de senha são acessíveis', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /esqueci minha senha/i }).click();
  await expect(page.getByRole('heading', { name: /recuperar acesso/i })).toBeVisible();
  await expectAccessible(page, 'solicitação de recuperação');

  await page.getByLabel(/e-mail corporativo para recuperação/i).fill('pessoa@rioeduca.net');
  await page.getByRole('button', { name: /enviar link de recuperação/i }).click();
  await expect(page.getByRole('heading', { name: /confira seu e-mail/i })).toBeVisible();
  await expectAccessible(page, 'confirmação de recuperação');

  await page.goto('/redefinir-senha');
  await expect(page.getByRole('heading', { name: /link inválido ou expirado/i })).toBeVisible();
  await expectAccessible(page, 'link de recuperação inválido');
});

test('visão geral, demandas e administração são acessíveis', async ({ page }) => {
  await login(page);
  await expectAccessible(page, 'visão geral');

  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await expect(page.getByLabel(/^status$/i)).toBeVisible();
  await expectAccessible(page, 'demandas');

  await navigateUsingSiteMenu(page, /^administração$/i);
  await expect(page.getByRole('heading', { name: /segurança e integridade/i })).toBeVisible();
  await expectAccessible(page, 'administração');
});

test('diálogo e painel de detalhes são acessíveis', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: /nova demanda/i }).click();
  await expect(page.getByRole('heading', { name: /^nova demanda$/i })).toBeVisible();
  await expectAccessible(page, 'nova demanda', '.radix-dialog-content');
  await page.getByRole('button', { name: /^cancelar$/i }).click();

  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await page.getByRole('row').nth(1).getByRole('button', { name: /^abrir$/i }).click();
  await expect(page.getByRole('heading', { name: /processo nº/i })).toBeVisible();
  await expectAccessible(page, 'detalhe da demanda', '.drawer-content');
});
