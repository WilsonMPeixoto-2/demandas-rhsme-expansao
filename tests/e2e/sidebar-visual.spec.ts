import { mkdir, writeFile } from 'node:fs/promises';
import { openSiteMenu } from './helpers/siteNavigation';
import { expect, test } from '@playwright/test';

/**
 * Ateliê visual do Fluxo CTRH.
 * Captura a navegação REAL renderizada, em vez de reconstruir o layout em uma imagem.
 * Não exige acesso ao Supabase: utiliza o login do modo local de demonstração.
 */
test('registra os estados visuais da navegação sem alterar seu comportamento', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();

  const sidebar = page.locator('#ct-sidebar-navigation');
  const navigation = sidebar.getByRole('navigation', { name: 'Áreas do sistema' });
  const current = navigation.locator('[aria-current="page"]');
  const isMobile = testInfo.project.name.includes('mobile');

  await openSiteMenu(page);
  await expect(sidebar).toBeVisible();
  await expect(navigation.getByRole('button', { name: /^Radar de Governança$/i })).toHaveCount(1);
  await expect(navigation.getByRole('button', { name: /^Todas as demandas$/i })).toHaveCount(1);
  await expect(navigation.getByRole('button', { name: /^Minhas demandas$/i })).toHaveCount(1);
  await expect(current).toHaveCount(1);
  await expect(current).toContainText('Radar de Governança');

  await page.evaluate(async () => { await document.fonts.ready; });
  await testInfo.attach(`sidebar-${testInfo.project.name}-inicio`, {
    body: await sidebar.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });

  if (!isMobile) {
    await expect(sidebar.locator('.ct-sidebar-brand .brand-symbol')).toHaveAttribute(
      'aria-label', 'Símbolo Fluxo CTRH',
    );
    await sidebar.getByRole('button', { name: 'Recolher menu lateral' }).click();
    await expect(sidebar).toHaveClass(/is-collapsed/);
    await expect(sidebar.getByRole('button', { name: 'Todas as demandas' })).toBeVisible();
    await testInfo.attach(`sidebar-${testInfo.project.name}-recolhida`, {
      body: await sidebar.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
    await sidebar.getByRole('button', { name: 'Expandir menu lateral' }).click();
    await expect(sidebar).not.toHaveClass(/is-collapsed/);
  }

  await navigation.getByRole('button', { name: /^Todas as demandas$/i }).click();
  await openSiteMenu(page);
  await expect(navigation.locator('[aria-current="page"]')).toContainText('Todas as demandas');
  await testInfo.attach(`sidebar-${testInfo.project.name}-carteira`, {
    body: await sidebar.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });
});


test('ateliê iconográfico carrega SVGs profissionais e registra comparação na escala de uso', async ({ page }, testInfo) => {
  await page.goto('/design/sidebar-icon-atlas.html');
  await expect(page.getByRole('heading', { name: 'Ateliê iconográfico' })).toBeVisible();
  await expect(page.locator('.icon-grid .specimen')).toHaveCount(4);
  const loaded = await page.locator('.icon-grid img').evaluateAll((items) =>
    items.every((item) => item instanceof HTMLImageElement && item.complete && item.naturalWidth > 0),
  );
  expect(loaded).toBe(true);

  const navigation = page.getByRole('navigation', { name: 'Destinos da barra lateral' });
  await expect(navigation.locator('[aria-current="page"]')).toContainText('Radar de Governança');
  await navigation.getByRole('button', { name: /Todas as demandas/i }).click();
  await expect(navigation.locator('[aria-current="page"]')).toContainText('Todas as demandas');
  await page.locator('#size').evaluate((element) => {
    const range = element as HTMLInputElement;
    range.value = '20';
    range.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#sizeVal')).toHaveText('20 px');
  await page.evaluate(async () => { await document.fonts.ready; });

  await testInfo.attach(`atlas-sidebar-${testInfo.project.name}`, {
    body: await page.screenshot({ animations: 'disabled', fullPage: true }),
    contentType: 'image/png',
  });
});

test('menu móvel mantém a página contida e o foco dentro das ações visíveis', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
  const width = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(width.page).toBeLessThanOrEqual(width.viewport + 1);

  const opener = page.getByRole('button', { name: 'Abrir menu principal' });
  await opener.click();
  const closer = page.getByRole('button', { name: 'Fechar menu lateral' });
  await expect(closer).toBeFocused();
  const lastDestination = page.getByRole('navigation', { name: 'Áreas do sistema' }).getByRole('button').last();
  await closer.press('Shift+Tab');
  await expect(lastDestination).toBeFocused();
  await lastDestination.press('Tab');
  await expect(closer).toBeFocused();
  await closer.press('Escape');
  await expect(opener).toBeFocused();
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
});

test('assinatura institucional fica inteira e nítida em desktop e celular', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
  for (const viewport of [{ width: 1366, height: 768 }, { width: 320, height: 800 }]) {
    await page.setViewportSize(viewport);
    if (viewport.width <= 940) await openSiteMenu(page);
    const sidebar = page.locator('#ct-sidebar-navigation');
    const signature = sidebar.getByRole('img', { name: 'Prefeitura da Cidade do Rio de Janeiro — Educação', exact: true });
    await expect(signature).toBeVisible();
    await expect(signature).toHaveJSProperty('complete', true);
    const geometry = await signature.evaluate((image) => {
      const img = image as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      const parent = img.closest('aside')!.getBoundingClientRect();
      return { width: rect.width, left: rect.left, right: rect.right, parentLeft: parent.left, parentRight: parent.right,
        naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, height: rect.height };
    });
    expect(geometry.naturalWidth).toBeGreaterThanOrEqual(geometry.width * 2);
    expect(geometry.left).toBeGreaterThanOrEqual(geometry.parentLeft + 8);
    expect(geometry.right).toBeLessThanOrEqual(geometry.parentRight - 8);
    expect(geometry.width / geometry.height).toBeCloseTo(geometry.naturalWidth / geometry.naturalHeight, 1);
    const evidence = await sidebar.screenshot({ animations: 'disabled' });
    await mkdir('visual-evidence/sidebar', { recursive: true });
    await writeFile(`visual-evidence/sidebar/assinatura-${viewport.width}-${testInfo.project.name}.png`, evidence);
    await testInfo.attach(`assinatura-${viewport.width}-dados-sinteticos`, {
      body: evidence, contentType: 'image/png',
    });
  }
});
