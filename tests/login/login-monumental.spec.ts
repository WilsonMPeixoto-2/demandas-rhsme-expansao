import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

async function stable(page: Page) {
  await page.getByRole('heading', { level: 1, name: 'Bem-vindo ao Fluxo CTRH' }).waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images, (image) => image.decode()));
  });
}

async function capture(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`);
  const bytes = await page.screenshot({ path, fullPage: true, animations: 'disabled' });
  await info.attach(name, { path, contentType: 'image/png' });
  return bytes;
}

async function accessible(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
}

test('assinatura e placeholders mantêm contraste AA contra os pixels renderizados', async ({ page }, info) => {
  for (const [width, height] of [[1586, 992], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await stable(page);
    const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled' });
    const contrasts = await page.evaluate(async (dataUrl) => {
      const image = new Image(); image.src = dataUrl; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
      const luminance = (rgb: number[]) => rgb.map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      }).reduce((total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i], 0);
      return ['.monumental-login-signature', '#login-email', '#login-senha'].map(selector => {
        const element = document.querySelector(selector)!;
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element, selector.startsWith('#') ? '::placeholder' : null);
        const foreground = style.color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
        // Blank pixels inside each surface, away from glyphs, borders and ornaments.
        const x = selector.startsWith('#') ? box.left + 10 : box.right - 5;
        const y = box.top + (selector.startsWith('#') ? 10 : 5);
        const background = Array.from(context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data).slice(0, 3);
        const a = luminance(foreground); const b = luminance(background);
        return { selector, contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
      });
    }, `data:image/png;base64,${screenshot.toString('base64')}`);
    await writeFile(info.outputPath(`small-text-contrast-${width}.json`), JSON.stringify(contrasts, null, 2));
    for (const item of contrasts) expect(item.contrast, item.selector).toBeGreaterThanOrEqual(4.5);
  }
});

test('original imutável, recorte sem perda e comparação canônica em navegador', async ({ page }, info) => {
  const original = await readFile('public/design/wide_cinematic_split_screen_web_login_page_desig.png');
  expect(createHash('sha256').update(original).digest('hex')).toBe('e42150c4f07618a221441a9bc5fe83ac7e50beac8946c2b27d942d4e522dfb84');
  await page.goto('/');
  await stable(page);
  const screenshot = await capture(page, info, 'login-1586x992');
  const result = await page.evaluate(async ({ originalData, screenshotData }) => {
    const load = async (src: string) => { const image = new Image(); image.src = src; await image.decode(); return image; };
    const [reference, actual, crop] = await Promise.all([
      load(originalData), load(screenshotData), load('/design/login-canonico-painel-esquerdo.png'),
    ]);
    const canvas = document.createElement('canvas');
    canvas.width = 1586; canvas.height = 992;
    const context = canvas.getContext('2d')!;
    context.drawImage(reference, 0, 0);
    const ref = context.getImageData(0, 0, 1586, 992).data;
    context.clearRect(0, 0, 1586, 992);
    context.drawImage(crop, 0, 0);
    const cropData = context.getImageData(0, 0, 1086, 992).data;
    let cropChanged = 0;
    for (let y = 0; y < 992; y++) for (let x = 0; x < 1086; x++) {
      for (let c = 0; c < 4; c++) if (ref[(y * 1586 + x) * 4 + c] !== cropData[(y * 1086 + x) * 4 + c]) cropChanged++;
    }
    context.drawImage(actual, 0, 0);
    const shot = context.getImageData(0, 0, 1586, 992).data;
    context.globalAlpha = 0.5;
    context.drawImage(reference, 0, 0);
    const overlay = canvas.toDataURL('image/png');
    context.globalAlpha = 1;
    const diff = context.createImageData(1586, 992);
    const regions = Object.fromEntries([
      ['art', 0, 0, 1086, 992], ['panel', 1086, 0, 1586, 992],
      ['heading', 1158, 158, 1540, 345], ['form', 1138, 367, 1551, 836],
    ].map(([name, x0, y0, x1, y1]) => {
      let total = 0; let significant = 0; let maxDelta = 0; let pixels = 0;
      for (let y = Number(y0); y < Number(y1); y++) for (let x = Number(x0); x < Number(x1); x++) {
        const i = (y * 1586 + x) * 4;
        const deltas = [0, 1, 2].map(c => Math.abs(ref[i + c] - shot[i + c]));
        total += deltas.reduce((a, b) => a + b, 0);
        maxDelta = Math.max(maxDelta, ...deltas);
        if (Math.max(...deltas) > 24) significant++;
        pixels++;
      }
      return [String(name), { mae: total / (pixels * 3), significantPixelPercent: significant / pixels * 100, maxDelta }];
    }));
    for (let i = 0; i < ref.length; i += 4) {
      for (let c = 0; c < 3; c++) diff.data[i + c] = Math.min(255, Math.abs(ref[i + c] - shot[i + c]) * 4);
      diff.data[i + 3] = 255;
    }
    context.putImageData(diff, 0, 0);
    return { cropChanged, regions, overlay, difference: canvas.toDataURL('image/png') };
  }, {
    originalData: `data:image/png;base64,${original.toString('base64')}`,
    screenshotData: `data:image/png;base64,${screenshot.toString('base64')}`,
  });
  for (const [name, data] of [['overlay', result.overlay], ['difference-x4', result.difference]]) {
    const path = info.outputPath(`${name}.png`);
    await writeFile(path, Buffer.from(data.split(',')[1], 'base64'));
    await info.attach(name, { path, contentType: 'image/png' });
  }
  const metrics = { ...result, overlay: undefined, difference: undefined };
  await writeFile(info.outputPath('comparison.json'), JSON.stringify(metrics, null, 2));
  expect(result.cropChanged).toBe(0);
  expect(result.regions.art.maxDelta).toBe(0);
  // Right-panel metrics are diagnostic. Only the product owner approves the rendering.
});

test('viewports operacionais, 4K, mobile e densidade 2× sem recorte da arte', async ({ page, browser }, info) => {
  for (const [width, height] of [[1280, 800], [1366, 768], [1920, 1080], [2560, 1440], [3840, 2160], [390, 844], [320, 800], [768, 1024], [960, 720], [640, 400], [1536, 864]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await stable(page);
    await noOverflow(page);
    const image = page.getByRole('img', { name: /arcos da lapa/i });
    const box = (await image.boundingBox())!;
    expect(box.width / box.height).toBeCloseTo(1086 / 992, 3);
    await page.getByLabel('E-mail corporativo').scrollIntoViewIfNeeded();
    await expect(page.getByLabel('E-mail corporativo')).toBeVisible();
    await capture(page, info, `login-${width}x${height}`);
    await page.getByRole('button', { name: 'Primeiro acesso' }).click();
    await expect(page.getByRole('button', { name: 'Solicitar acesso' })).toBeVisible();
    await noOverflow(page);
  }
  const retina = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await retina.goto(new URL('/', page.url()).toString());
  await stable(retina);
  await capture(retina, info, 'login-390x844-dpr2');
  await retina.close();
});

test('teclado, validação, senha, carregamento, erro e recuperação neutra', async ({ page }, info) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await stable(page);
  await accessible(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeFocused();
  await capture(page, info, 'focus-keyboard');
  await page.getByRole('button', { name: 'Acessar sistema' }).click();
  await expect(page.getByLabel('E-mail corporativo')).toBeFocused();
  await expect(page.getByText('Informe a senha.')).toBeVisible();
  await capture(page, info, 'validation');
  await accessible(page);
  await page.getByLabel('E-mail corporativo').fill('pessoa@rioeduca.net');
  await page.getByLabel('Senha', { exact: true }).fill('SenhaSintetica9');
  await page.getByRole('button', { name: 'Mostrar senha' }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar senha' }).click();
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/auth/v1/token**', async route => {
    await pending;
    await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ code: 'invalid_credentials', msg: 'Invalid login credentials' }) });
  });
  await page.getByRole('button', { name: 'Acessar sistema' }).click();
  await expect(page.getByRole('button', { name: 'Acessando…' })).toBeDisabled();
  await capture(page, info, 'loading-synthetic-response');
  release();
  await expect(page.getByText('E-mail ou senha inválidos.')).toBeVisible();
  await capture(page, info, 'authentication-error-synthetic');
  await accessible(page);
  await page.getByText('E-mail ou senha inválidos.').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Esqueci minha senha' }).click();
  await expect(page.getByLabel('E-mail corporativo para recuperação')).toBeFocused();
  await capture(page, info, 'recovery');
  await accessible(page);
  await page.route('**/auth/v1/recover**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await page.getByRole('button', { name: 'Enviar link de recuperação' }).click();
  await expect(page.getByRole('heading', { name: 'Confira seu e-mail' })).toBeFocused();
  await expect(page.getByText(/se houver uma conta vinculada/i)).toBeVisible();
  await capture(page, info, 'recovery-confirmation-synthetic');
  await page.getByRole('button', { name: 'Voltar para entrar' }).click();
  await expect(page.getByLabel('E-mail corporativo')).toBeFocused();
  await page.getByRole('button', { name: 'Primeiro acesso' }).click();
  await capture(page, info, 'first-access');
  await accessible(page);
  await page.getByLabel('Seu e-mail corporativo').fill('pessoa@rioeduca.net');
  await page.getByLabel('Criar nova senha').fill('fraca');
  await page.getByRole('button', { name: 'Solicitar acesso' }).click();
  await expect(page.getByText('A senha deve ter no mínimo 8 caracteres.')).toBeVisible();
  await capture(page, info, 'first-access-validation');
  await page.getByLabel('Criar nova senha').fill('SenhaSintetica9');
  await page.route('**/auth/v1/signup**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ user: null, session: null }) }));
  await page.getByRole('button', { name: 'Solicitar acesso' }).click();
  await expect(page.getByText('Solicitação enviada. Aguarde a aprovação de um administrador.')).toBeVisible();
  await expect(page.getByLabel('E-mail corporativo')).toHaveValue('pessoa@rioeduca.net');
  await page.locator('summary').click();
  await capture(page, info, 'help');
  await accessible(page);
});
