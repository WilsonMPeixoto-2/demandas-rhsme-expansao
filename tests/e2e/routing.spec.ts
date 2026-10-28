import { expectSiteAreaActive, navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

test('rotas e filtros preservam o contexto de navegação', async ({ page }) => {
  await login(page);
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await page.getByLabel(/^status$/i).selectOption('todos');
  await expect.poll(() => new URL(page.url()).searchParams.get('status')).toBe('todos');

  const firstRow = page.getByRole('row').nth(1);
  const processNumber = await firstRow.locator('.numero-link').innerText();
  await firstRow.getByRole('button', { name: /^abrir$/i }).click();
  await expect(page).toHaveURL(/\/demandas\/\d+\?/);
  await expect(page.getByRole('heading', {
    name: new RegExp(processNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/demandas\?status=/);
  await expect(page.getByLabel(/^status$/i)).toHaveValue('todos');
});

test('URL legada de escopo pessoal migra para a rota própria', async ({ page }) => {
  await login(page);
  await page.goto('/demandas?escopo=meu&status=todos');

  await expect(page).toHaveURL(/\/minhas-demandas\?status=todos$/);
  await expectSiteAreaActive(page, /^minhas demandas$/i);
  await expect(page.getByRole('heading', { name: 'Minhas demandas' })).toBeVisible();
});
