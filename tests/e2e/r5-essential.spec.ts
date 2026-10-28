import { navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('E-mail corporativo').fill('teste@rioeduca.net');
  await page.getByLabel('Senha', { exact: true }).fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

async function openAllDemands(page: Page) {
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await expect(page.getByRole('heading', { name: 'Todas as demandas' })).toBeVisible();
}

function demandRow(page: Page, demandNumber: string) {
  return page.getByRole('row').filter({
    has: page.getByRole('button', { name: demandNumber, exact: true }),
  });
}

async function selectDemandAction(page: Page, demandNumber: string, actionName: RegExp) {
  const row = demandRow(page, demandNumber);
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: `Mais ações da demanda ${demandNumber}` }).click();

  const action = page.getByRole('menuitem', { name: actionName });
  await expect(action).toBeVisible();
  await action.press('Enter');
}

test('registra andamento sem alterar o status e o preserva no prontuario', async ({ page }) => {
  const demandNumber = 'DEMO-PRO-2026-001';
  const progressComment = 'Contato registrado com a unidade responsavel.';
  const nextAction = 'Conferir retorno recebido no teste E2E';

  await login(page);
  await openAllDemands(page);

  await selectDemandAction(page, demandNumber, /^registrar andamento$/i);

  await expect(page.getByRole('heading', { name: /^registrar andamento$/i })).toBeVisible();
  await page.getByLabel(/o que foi realizado/i).fill(progressComment);
  await page.locator('#modal_andamento_proxima_acao').fill(nextAction);
  await page.locator('#modal_andamento_proxima_acao_em').fill('31/12/2099');
  await page.getByRole('button', { name: /^registrar andamento$/i }).click();

  await expect(page.getByText('Andamento registrado sem alterar o status.', { exact: true })).toBeVisible();
  const row = demandRow(page, demandNumber);
  await expect(row).toContainText('Aguardando Andamento');
  await expect(row).toContainText(nextAction);

  await row.getByRole('button', { name: demandNumber, exact: true }).click();
  const drawer = page.locator('.drawer-content');
  await expect(drawer).toContainText(nextAction);
  await expect(drawer).toContainText(progressComment);
  await expect(drawer).toContainText('Andamento');
  await expect(drawer).toContainText('Aguardando Andamento');
});

test('reabre demanda encerrada e registra a retomada no prontuario', async ({ page }) => {
  const demandNumber = 'DEMO-PRO-2026-006';
  const reopeningReason = 'Retorno recebido; acompanhamento reativado.';
  const nextAction = 'Analisar documentos recebidos no teste E2E';

  await login(page);
  await openAllDemands(page);
  await page.getByLabel(/^status$/i).selectOption('todos');
  await expect.poll(() => new URL(page.url()).searchParams.get('status')).toBe('todos');

  const closedRow = demandRow(page, demandNumber);
  await expect(closedRow).toContainText('Encerrado');
  await selectDemandAction(page, demandNumber, /^reabrir demanda$/i);

  await expect(page.getByRole('heading', { name: /^reabrir demanda$/i })).toBeVisible();
  const status = page.getByLabel(/novo status da demanda/i);
  await expect(status.locator('option[value="Encerrado"]')).toHaveCount(0);
  await status.selectOption('Tramitado');
  await page.getByLabel(/motivo da reabertura/i).fill(reopeningReason);
  await page.locator('#modal_status_proxima_acao').fill(nextAction);
  await page.locator('#modal_status_proxima_acao_em').fill('31/12/2099');
  await page.getByRole('button', { name: /^reabrir demanda$/i }).click();

  await expect(page.getByText('Status atualizado com sucesso.', { exact: true })).toBeVisible();
  const row = demandRow(page, demandNumber);
  await expect(row).toContainText('Tramitado');
  await expect(row).toContainText(nextAction);

  await row.getByRole('button', { name: demandNumber, exact: true }).click();
  const drawer = page.locator('.drawer-content');
  await expect(drawer).toContainText(nextAction);
  await expect(drawer).toContainText(reopeningReason);
  await expect(drawer).toContainText('Tramitado');
});
