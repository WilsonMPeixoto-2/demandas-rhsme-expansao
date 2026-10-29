import { navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

/**
 * Inventário VISUAL de todo o Fluxo CTRH.
 *
 * Captura telas REAIS do sistema em modo local, sem alterar conteúdo nem
 * converter os estudos de arte em telas inventadas.
 *
 * Os PNGs são anexados ao relatório/artefato da CI. Não são snapshots
 * rígidos: a revisão humana compara estética e fidelidade, enquanto os
 * testes de regressão funcional continuam independentes.
 */
async function capture(page: Page, info: TestInfo, name: string) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images)
      .filter((image) => image.complete && image.naturalWidth > 0)
      .map((image) => image.decode().catch(() => undefined)));
  });
  await info.attach(`fluxo-${name}-${info.project.name}`, {
    body: await page.screenshot({ animations: 'disabled', fullPage: false }),
    contentType: 'image/png',
  });
}

test('gera inventário visual das telas existentes para evolução contínua do design', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /acessar sistema/i })).toBeVisible();
  await capture(page, testInfo, '01-login');

  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Composição da carteira' })).toBeVisible();
  await capture(page, testInfo, '02-radar-de-governanca');

  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await expect(page.getByRole('heading', { name: 'Todas as demandas' })).toBeVisible();
  await capture(page, testInfo, '03-todas-as-demandas');

  await page.getByRole('row').nth(1).getByRole('button', { name: /^abrir$/i }).click();
  const drawer = page.locator('.drawer-content');
  await expect(drawer).toBeVisible();
  await testInfo.attach(`fluxo-04-prontuario-${testInfo.project.name}`, {
    body: await drawer.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });
  await page.getByRole('button', { name: /^fechar$/i }).click();

  await navigateUsingSiteMenu(page, /^minhas demandas$/i);
  await expect(page.getByRole('heading', { name: 'Minhas demandas' })).toBeVisible();
  await capture(page, testInfo, '05-minhas-demandas');

  await navigateUsingSiteMenu(page, /^administração$/i);
  await expect(page.getByRole('heading', { name: /segurança e integridade/i })).toBeVisible();
  await capture(page, testInfo, '06-administracao');

  await page.getByRole('button', { name: /nova demanda/i }).click();
  const modal = page.getByRole('dialog', { name: /nova demanda/i });
  await expect(modal).toBeVisible();
  await testInfo.attach(`fluxo-07-formulario-${testInfo.project.name}`, {
    body: await modal.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });
});
