import { expect, test } from '@playwright/test';

test('assinatura oficial é decodificada e produz pixels visíveis no login', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  const mark = page.getByRole('img', { name: /prefeitura do rio de janeiro.*educação/i }).first();
  await expect(mark).toBeVisible();
  const result = await mark.evaluate(async (image: HTMLImageElement) => {
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D indisponível');
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let painted = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 80) painted++;
    return { width: image.naturalWidth, painted };
  });
  expect(result.width).toBeGreaterThanOrEqual(700);
  expect(result.painted).toBeGreaterThan(1000);
  await testInfo.attach('login-marca-oficial-1366.png', {
    body: await page.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });
});
