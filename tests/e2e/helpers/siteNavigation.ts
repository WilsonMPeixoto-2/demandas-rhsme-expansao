import { expect, type Page } from '@playwright/test';

export async function openSiteMenu(page: Page) {
  const opener = page.getByRole('button', { name: 'Abrir menu principal' });
  if (await opener.isVisible()) {
    await opener.click();
    await expect(page.getByRole('button', { name: 'Fechar menu lateral' })).toBeVisible();
  }
}

export async function navigateUsingSiteMenu(page: Page, area: RegExp) {
  await openSiteMenu(page);
  await page.getByRole('navigation', { name: 'Áreas do sistema' })
    .getByRole('button', { name: area }).click();
}

export async function expectSiteAreaActive(page: Page, area: RegExp) {
  await openSiteMenu(page);
  await expect(page.getByRole('navigation', { name: 'Áreas do sistema' })
    .getByRole('button', { name: area })).toHaveAttribute('aria-current', 'page');
  const closer = page.getByRole('button', { name: 'Fechar menu lateral' });
  if (await closer.isVisible()) await closer.click();
}
