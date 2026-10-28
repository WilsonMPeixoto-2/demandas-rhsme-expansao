import { navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

test('modal de edição permanece interativo acima do drawer', async ({ page }) => {
  await login(page);
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await page.getByRole('button', { name: /^abrir$/i }).first().click();
  await page.getByRole('button', { name: /^editar$/i }).click();
  await expect(page.getByRole('heading', { name: /editar dados da demanda/i })).toBeVisible();
  await page.getByRole('button', { name: /^cancelar$/i }).click();
  await expect(page.getByRole('heading', { name: /editar dados da demanda/i })).toBeHidden();
  await expect(page.getByRole('heading', { name: /processo nº/i })).toBeVisible();
});
