import { mkdir, writeFile } from 'node:fs/promises';
import { navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

async function loginAndOpenDemandas(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);
  await expect(page.getByRole('region', { name: /tabela de demandas/i })).toBeVisible();
}

async function attachLayoutEvidence(page: Page, testInfo: TestInfo, name: string) {
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

async function expectNoPageOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(geometry.content).toBeLessThanOrEqual(geometry.viewport + 1);
}

async function tableGeometry(page: Page) {
  return page.locator('.table-responsive').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    left: element.getBoundingClientRect().left,
    right: element.getBoundingClientRect().right,
  }));
}

test('carteira usa o espaço disponível e exibe todas as colunas em monitor amplo', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginAndOpenDemandas(page);

  const containerWidth = await page.locator('.app-container').evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  expect(containerWidth).toBeGreaterThanOrEqual(1680);

  const geometry = await tableGeometry(page);
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);

  const actionsBox = await page.getByRole('columnheader', { name: /^ações$/i }).boundingBox();
  expect(actionsBox).not.toBeNull();
  expect((actionsBox?.x ?? 0) + (actionsBox?.width ?? 0)).toBeLessThanOrEqual(geometry.right + 1);
  await expectNoPageOverflow(page);
  await attachLayoutEvidence(page, testInfo, 'carteira-1920.png');
});

test('carteira mantém todas as colunas acessíveis em notebook de 1366 px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await loginAndOpenDemandas(page);

  const geometry = await tableGeometry(page);
  if (geometry.scrollWidth > geometry.clientWidth + 1) {
    const topScrollbar = page.getByRole('region', { name: 'Rolagem horizontal da tabela' });
    await expect(topScrollbar).toBeVisible();
    await topScrollbar.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await expect.poll(() => page.locator('.table-responsive').evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
  }

  const actionsBox = await page.getByRole('columnheader', { name: /^ações$/i }).boundingBox();
  expect(actionsBox).not.toBeNull();
  expect((actionsBox?.x ?? 0) + (actionsBox?.width ?? 0)).toBeLessThanOrEqual(geometry.right + 1);
  await expectNoPageOverflow(page);
  await attachLayoutEvidence(page, testInfo, 'carteira-1366.png');
});

test('viewport estreito oferece rolagem horizontal no topo e mantém ações visíveis', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 960, height: 768 });
  await loginAndOpenDemandas(page);

  const geometry = await tableGeometry(page);
  expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);

  const topScrollbar = page.locator('.table-scrollbar-top');
  await expect(topScrollbar).toBeVisible();
  await expect(topScrollbar).toHaveAttribute('aria-hidden', 'false');

  await topScrollbar.evaluate((element) => {
    element.scrollLeft = 180;
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await expect.poll(() => page.locator('.table-responsive').evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);

  const firstActionsCell = page.locator('tbody .column-actions').first();
  const actionsBox = await firstActionsCell.boundingBox();
  expect(actionsBox).not.toBeNull();
  expect(actionsBox?.x ?? 0).toBeGreaterThanOrEqual(geometry.left - 1);
  expect((actionsBox?.x ?? 0) + (actionsBox?.width ?? 0)).toBeLessThanOrEqual(geometry.right + 1);
  await expectNoPageOverflow(page);
  await attachLayoutEvidence(page, testInfo, 'carteira-960.png');
});

test('monitor de 32 polegadas usa a largura útil para ler a carteira', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 2560, height: 1440 });
  await loginAndOpenDemandas(page);
  const layout = await page.evaluate(() => {
    const shell = document.querySelector('.ct-shell')!.getBoundingClientRect();
    const sidebar = document.querySelector('#ct-sidebar-navigation')!.getBoundingClientRect();
    const table = document.querySelector('.table-responsive')!.getBoundingClientRect();
    return { viewport: document.documentElement.clientWidth, shell: shell.width, sidebar: sidebar.width, table: table.width };
  });
  // Uma carteira larga deve usar a janela, com margens e navegação proporcionais.
  expect(layout.shell).toBeGreaterThanOrEqual(layout.viewport - 2);
  expect(layout.table).toBeGreaterThanOrEqual(layout.viewport - layout.sidebar - 160);
  const actionWidth = (await page.getByRole('columnheader', { name: /^ações$/i }).boundingBox())!.width;
  expect(actionWidth).toBeLessThanOrEqual(144);
  await expectNoPageOverflow(page);
  await page.getByRole('button', { name: /devtools/i }).evaluateAll((controls) => {
    for (const control of controls) {
      (control as HTMLElement).style.setProperty('display', 'none', 'important');
    }
  });
  const evidence = await page.screenshot({ type: 'jpeg', quality: 80 });
  await mkdir('visual-evidence/wide-screens', { recursive: true });
  await writeFile(`visual-evidence/wide-screens/carteira-2560-${testInfo.project.name}.jpg`, evidence);
  await testInfo.attach('carteira-2560-dados-sinteticos', {
    body: evidence,
    contentType: 'image/jpeg',
  });
});
