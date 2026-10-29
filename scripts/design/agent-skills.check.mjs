import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const skills = [
  ['frontend-design', 'frontend-design'],
  ['web-design-guidelines', 'web-design-guidelines'],
  ['cthr-sidebar-visual-quality', 'cthr-sidebar-visual-quality'],
  ['apple-inspired-web-design', 'apple-inspired-web-design']
];

for (const [folder, name] of skills) {
  test(`skill ${name} está presente e possui frontmatter válido`, () => {
    const file = resolve(root, '.agents', 'skills', folder, 'SKILL.md');
    const content = readFileSync(file, 'utf8');
    assert.match(content, /^---\r?\n/);
    assert.match(content, new RegExp(`^name: ${name}$`, 'm'));
    assert.ok(content.length > 200);
  });
}

test('licença Apache do Frontend Design preservada', () => {
  const file = resolve(root, '.agents', 'skills', 'frontend-design', 'LICENSE.txt');
  assert.ok(existsSync(file));
  assert.match(readFileSync(file, 'utf8'), /Apache License/);
});

test('fluxo do projeto preserva marca, quatro destinos e aprovação visual', () => {
  const content = readFileSync(
    resolve(root, '.agents', 'skills', 'cthr-sidebar-visual-quality', 'SKILL.md'), 'utf8'
  );
  for (const text of ['Arcos da Lapa', 'Radar de Governança', 'Todas as demandas',
    'Minhas demandas', 'Administração', 'homologação visual']) {
    assert.ok(content.includes(text), `Diretriz ausente: ${text}`);
  }
});
