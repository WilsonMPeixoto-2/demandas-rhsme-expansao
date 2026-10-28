import { navigateUsingSiteMenu } from './helpers/siteNavigation';
import { expect, test } from '@playwright/test';

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();
  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
}

async function expectProfessionalControlLayout(dialog: import('@playwright/test').Locator) {
  const controls = dialog.locator([
    '.input-container-floating > input:not([type="hidden"]):visible',
    '.input-container-floating > select:visible',
    '.input-container-floating > textarea:visible',
    '.edit-justification-field > textarea:visible',
  ].join(', '));

  const metrics = await controls.evaluateAll((elements) => elements.map((element) => {
    const control = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const parent = control.parentElement;
    const rect = control.getBoundingClientRect();
    const parentRect = parent?.getBoundingClientRect();
    return {
      tag: control.tagName.toLowerCase(),
      width: rect.width,
      height: rect.height,
      parentWidth: parentRect?.width ?? 0,
    };
  }));

  expect(metrics.length).toBeGreaterThan(0);
  for (const metric of metrics) {
    expect(metric.width).toBeGreaterThanOrEqual(metric.parentWidth - 2);
    expect(metric.height).toBeGreaterThanOrEqual(metric.tag === 'textarea' ? 80 : 40);
  }

  const overflow = await dialog.evaluate((element) => ({
    visibleWidth: element.clientWidth,
    contentWidth: element.scrollWidth,
  }));
  expect(overflow.contentWidth).toBeLessThanOrEqual(overflow.visibleWidth + 1);
}

test('edição apresenta somente informações úteis, motivo contextual e orientação ao salvar', async ({ page }, testInfo) => {
  await signIn(page);
  await navigateUsingSiteMenu(page, /^todas as demandas$/i);

  const search = page.getByRole('combobox', { name: /busca por texto/i });
  await search.fill('DEMO-OUT-2026-005');
  await expect(page.getByRole('button', { name: 'DEMO-OUT-2026-005', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^abrir$/i }).first().click();
  await page.getByRole('button', { name: /^editar$/i }).click();

  const dialog = page.getByRole('dialog', { name: /editar dados da demanda/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/registro legado/i)).toHaveCount(0);
  await expect(dialog.getByText(/responsável legado/i)).toHaveCount(0);
  await expect(dialog.locator('input[value^="ID:"]')).toHaveCount(0);
  await expect(dialog.getByLabel(/motivo da alteração/i)).toHaveCount(0);

  await expect(dialog.getByLabel('Assunto')).toBeVisible();
  await expect(dialog.getByLabel('Responsável')).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Prazo interno' })).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Prazo final' })).toBeVisible();
  await expect(dialog.getByLabel('Setor')).toBeVisible();

  await dialog.getByLabel('Assunto').fill('Monitoramento revisado de condição externa');
  const reason = dialog.getByLabel('Motivo da alteração *');
  await expect(reason).toBeVisible();
  await expect(dialog.getByText('O motivo será registrado no histórico da demanda.')).toBeVisible();

  await dialog.getByRole('button', { name: /^salvar alterações$/i }).click();
  await expect(dialog.getByText('Informe o motivo da alteração para continuar (mínimo de 10 caracteres).')).toBeVisible();

  await reason.fill('Atualização necessária para refletir a informação recebida.');
  await expectProfessionalControlLayout(dialog);

  const reasonStyle = await reason.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    resize: getComputedStyle(element).resize,
  }));
  expect(reasonStyle.height).toBeGreaterThanOrEqual(90);
  expect(reasonStyle.resize).toBe('none');

  await testInfo.attach(`edicao-informacoes-uteis-${testInfo.project.name}`, {
    body: await dialog.screenshot(),
    contentType: 'image/png',
  });

  await dialog.getByRole('button', { name: /^cancelar$/i }).click();
  await page.getByRole('button', { name: /descartar alterações/i }).click();
});

test('nova demanda preserva todos os campos e apresenta avisos explicativos ao salvar', async ({ page }, testInfo) => {
  await signIn(page);
  await page.getByRole('button', { name: /nova demanda/i }).click();

  const dialog = page.getByRole('dialog', { name: /nova demanda/i });
  await expect(dialog).toBeVisible();

  await expect(dialog.getByLabel('Tipo')).toBeVisible();
  await expect(dialog.getByLabel('Número')).toBeVisible();
  await expect(dialog.getByLabel('Assunto')).toBeVisible();
  await expect(dialog.getByLabel('Responsável')).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Prazo interno' })).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Prazo final' })).toBeVisible();
  await expect(dialog.getByLabel('Status')).toBeVisible();
  await expect(dialog.getByLabel(/setor/i)).toBeVisible();
  await expect(dialog.getByLabel(/classificação/i)).toBeVisible();
  await expect(dialog.getByLabel('Próxima providência', { exact: true })).toBeVisible();
  await expect(dialog.getByLabel('Data da próxima providência', { exact: true })).toBeVisible();

  await expect(dialog.getByText(/uuid|supabase|pgrst|sqlstate|responsavel_id|nao_informado|registro legado/i)).toHaveCount(0);
  await expectProfessionalControlLayout(dialog);

  await dialog.getByRole('button', { name: /^salvar$/i }).click();

  const explanation = page.getByRole('alertdialog', { name: /prazo interno obrigatório/i });
  await expect(explanation).toBeVisible();
  await expect(explanation.getByText('Toda nova demanda deve possuir um prazo interno definido. Informe a data antes de salvar o cadastro.')).toBeVisible();
  await explanation.getByRole('button', { name: /entendi/i }).click();

  await expect(dialog.getByText('Informe o tipo da demanda.')).toBeVisible();
  await expect(dialog.getByText('Informe o número do processo ou documento.')).toBeVisible();
  await expect(dialog.getByText('Informe o assunto da demanda.')).toBeVisible();
  await expect(dialog.getByText('Informe uma data válida para o prazo definido.')).toBeVisible();
  await expect(dialog.getByText('Escolha uma data para o prazo final ou marque Não se aplica.')).toBeVisible();
  await expect(dialog.getByText('Informe o status da demanda.')).toBeVisible();
  await expect(dialog.getByText('Selecione a classificação.')).toBeVisible();

  await dialog.getByLabel('Tipo').selectOption('Processo');
  await dialog.getByLabel('Número').fill('QA-AVISOS-2026');
  await dialog.getByLabel('Assunto').fill('Verificação das orientações do formulário');
  await dialog.getByRole('group', { name: 'Prazo final' }).getByLabel('Não se aplica').click();
  await dialog.getByLabel('Status').selectOption('Aguardando Andamento');
  await dialog.getByLabel(/classificação/i).selectOption('Demanda Interna');
  await dialog.getByRole('button', { name: /^salvar$/i }).click();

  await expect(explanation).toBeVisible();
  await explanation.getByRole('button', { name: /entendi/i }).click();
  await expect(dialog.getByText('Descreva a próxima providência com pelo menos 5 caracteres.')).toBeVisible();
  await expect(dialog.getByText('Informe a data de acompanhamento.')).toBeVisible();

  await testInfo.attach(`nova-demanda-validacao-${testInfo.project.name}`, {
    body: await dialog.screenshot(),
    contentType: 'image/png',
  });

  await dialog.getByRole('button', { name: /^cancelar$/i }).click();
  await page.getByRole('button', { name: /descartar alterações/i }).click();
});