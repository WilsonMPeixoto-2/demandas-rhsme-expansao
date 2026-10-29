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
  await expect(navigation.locator('[aria-current="page"]')).toContainText('Todas as demandas');
  await testInfo.attach(`sidebar-${testInfo.project.name}-carteira`, {
    body: await sidebar.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });
});
