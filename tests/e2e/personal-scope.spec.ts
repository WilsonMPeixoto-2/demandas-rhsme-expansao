import { expectSiteAreaActive, navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

test('cartão, aba e alternador conectam as duas carteiras', async ({ page }) => {
  await login(page);

  const personalCard = page.getByRole('button', {
    name: /minhas demandas.*acompanhe sua carteira de processos/i,
  });
  await expect(personalCard).toBeVisible();
  await personalCard.click();

  await expect(page).toHaveURL(/\/minhas-demandas(?:\?|$)/);
  await expectSiteAreaActive(page, /^minhas demandas$/i);
  await expect(page.getByRole('heading', { name: 'Minhas demandas' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Demandas Equipe CTRH' })).toBeVisible();
  await expectSiteAreaActive(page, /^minhas demandas$/i);
  await expect(page.getByRole('button', { name: /em acompanhamento/i })).toBeVisible();

  await page.getByRole('button', { name: 'Demandas Equipe CTRH' }).click();

  await expect(page).toHaveURL(/\/demandas(?:\?|$)/);
  await expectSiteAreaActive(page, /^todas as demandas$/i);
  await expect(page.getByRole('heading', { name: 'Todas as demandas' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver minhas demandas' })).toBeVisible();

  await navigateUsingSiteMenu(page, /^minhas demandas$/i);
  await expect(page).toHaveURL(/\/minhas-demandas(?:\?|$)/);

  await page.getByLabel(/busca por texto/i).fill('processo');
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page).toHaveURL(/\/minhas-demandas(?:\?|$)/);
  await expect(page.getByRole('heading', { name: 'Minhas demandas' })).toBeVisible();
});
