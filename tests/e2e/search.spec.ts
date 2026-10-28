import { expectSiteAreaActive, navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

test('busca avançada encontra campos distribuídos, histórico e número sem pontuação', async ({ page }) => {
  await login(page);
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);

  const search = page.getByRole('combobox', { name: /busca por texto/i });
  await search.fill('cessao demonstracao 2026');
  await search.press('Enter');
  await expect(page.locator('mark').filter({ hasText: /cessão/i }).first()).toBeVisible();
  await expect(page.getByText(/Encontrado em:/i).first()).toBeVisible();

  await search.fill('DEMOPRO2026001');
  await expect(page.getByRole('button', { name: 'DEMO-PRO-2026-001', exact: true })).toBeVisible();

  await search.fill('modo de demonstracao');
  await expect(page.locator('.search-history-snippet').first()).toContainText(
    'Histórico: Demanda sintética carregada no modo de demonstração.',
  );
});

test('busca sem resultado exato apresenta sugestões próximas explicadas', async ({ page }) => {
  await login(page);
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);

  const search = page.getByRole('combobox', { name: /busca por texto/i });
  await search.fill('cessao demonstracao 2099');
  await search.press('Enter');

  await expect(page.locator('.approximate-search-notice')).toContainText(
    /nenhuma demanda contém todos os 3 termos/i,
  );
  await expect(page.getByText(/2 de 3 termos/i).first()).toBeVisible();
  await expect(page.locator('.approximate-missing-terms').first()).toContainText('Termo ausente: 2099');
  await expect(page.getByRole('button', { name: 'DEMO-PRO-2026-001', exact: true })).toBeVisible();
});

test('buscas recentes, atalho e período funcionam por teclado', async ({ page }) => {
  await login(page);
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);

  const search = page.getByRole('combobox', { name: /busca por texto/i });
  await search.fill('cessao demonstracao 2026');
  await search.press('Enter');
  await search.fill('');
  await expect(page.getByRole('button', { name: /cessao demonstracao 2026/i })).toBeVisible();

  await navigateUsingSiteMenu(page, /^radar de governança$/i);
  await expectSiteAreaActive(page, /^radar de governança$/i);
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
  await expect(page.getByRole('heading', { name: 'Todas as demandas' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /busca por texto/i })).toBeFocused();

  await page.getByRole('button', { name: /^mais filtros$/i }).click();
  await page.getByLabel(/data inicial/i).fill('2026-08-01');
  await page.getByLabel(/data final/i).fill('2026-07-01');
  await expect(page.getByRole('alert')).toContainText(/data inicial não pode ser posterior/i);
});
