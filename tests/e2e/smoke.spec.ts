import { navigateUsingSiteMenu, openSiteMenu } from './helpers/siteNavigation';
import { expect, test } from '@playwright/test';

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  if (overflow.content > overflow.viewport + 1) {
    const offenders = await page.evaluate(() => {
      const rightEdge = document.documentElement.clientWidth + 1;
      return Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ element, rect }) => rect.width > 0 && rect.right > rightEdge
          && getComputedStyle(element).position !== 'fixed')
        .slice(0, 15)
        .map(({ element, rect }) => ({
          tag: element.tagName, cssClass: String(element.className).slice(0, 110),
          left: Math.round(rect.left * 10) / 10, right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
        }));
    });
    console.info('Diagnóstico de transbordamento móvel:', JSON.stringify(offenders));
  }
  expect(overflow.content).toBeLessThanOrEqual(overflow.viewport + 1);
}

test('fluxos críticos funcionam sem erros, dependências externas ou estouro horizontal', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  const externalAssetRequests: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('request', (request) => {
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com/.test(request.url())) {
      externalAssetRequests.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page).toHaveTitle(/Fluxo CTRH/i);
  await expect(page.getByRole('button', { name: /acessar sistema/i })).toBeVisible();

  const institutionalMark = page.locator('img.brand-endorsement-image:visible');
  await expect(institutionalMark).toHaveCount(1);
  await expect.poll(async () => institutionalMark.evaluate((image) => {
    const element = image as HTMLImageElement;
    return element.complete && element.naturalWidth > 0;
  })).toBe(true);

  await expectNoHorizontalOverflow(page);

  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();

  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
  await expect(page.getByText('Modo de demonstração', { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const navigation = page.getByRole('navigation', { name: 'Áreas do sistema' });
  const compositionRegion = page.getByRole('region', { name: 'Composição da carteira' });
  await openSiteMenu(page);
  await expect(navigation.getByRole('button', { name: /^todas as demandas$/i })).toBeVisible();
  await expect(page.getByText('Composição atual', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Leitura da carteira' })).toHaveCount(0);
  await expect(compositionRegion).toBeVisible();
  await expectNoHorizontalOverflow(page);

  if (testInfo.project.name === 'chromium-mobile') {
    const navigationColumnCount = await navigation.evaluate((element) => (
      getComputedStyle(element).gridTemplateColumns.split(/\s+/).filter(Boolean).length
    ));
    expect(navigationColumnCount).toBe(1);
  }

  await testInfo.attach(`navegacao-${testInfo.project.name}`, {
    body: await navigation.screenshot(),
    contentType: 'image/png',
  });
  await testInfo.attach(`composicao-${testInfo.project.name}`, {
    body: await compositionRegion.screenshot(),
    contentType: 'image/png',
  });

  const menuCloser = page.getByRole('button', { name: 'Fechar menu lateral' });
  if (await menuCloser.isVisible()) await menuCloser.click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /exportar excel/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^radar_governanca_analitico_\d{4}-\d{2}-\d{2}_\d{4}\.xlsx$/);

  await page.getByRole('button', { name: /nova demanda/i }).click();
  await expect(page.getByRole('heading', { name: /nova demanda/i })).toBeVisible();
  await page.getByRole('button', { name: /^cancelar$/i }).click();

  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await page.getByRole('button', { name: /^abrir$/i }).first().click();
  await expect(page.getByRole('heading', { name: /processo nº/i })).toBeVisible();
  await page.getByRole('button', { name: /^editar$/i }).click();
  await expect(page.getByRole('heading', { name: /editar dados da demanda/i })).toBeVisible();
  await page.getByRole('button', { name: /^cancelar$/i }).click();
  await page.getByRole('button', { name: /^fechar$/i }).click();
  await expectNoHorizontalOverflow(page);

  expect(externalAssetRequests).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
