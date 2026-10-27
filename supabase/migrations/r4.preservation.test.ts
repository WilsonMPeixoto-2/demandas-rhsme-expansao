import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  resolve(migrationsDir, '20260730063832_r4_preserve_legacy_deadline_metadata.sql'),
  'utf8',
);

describe('migration R4 — preservação do legado', () => {
  it('preserva justificativas antigas em edição não relacionada', () => {
    expect(migration).toContain('old.limite1 is distinct from new.limite1');
    expect(migration).toContain('old.limite1_situacao is distinct from new.limite1_situacao');
    expect(migration).toContain('old.limite2 is distinct from new.limite2');
    expect(migration).toContain('old.limite2_situacao is distinct from new.limite2_situacao');
    expect(migration).not.toMatch(/new\.limite1_justificativa := null;[\s\S]*else/i);
  });

  it('limpa justificativa armazenada somente quando o prazo muda', () => {
    expect(migration).toContain('new.limite1_justificativa := null;');
    expect(migration).toContain('new.limite2_justificativa := null;');
    expect(migration).toContain('before update of limite1, limite1_situacao, limite2, limite2_situacao');
  });

  it('mantém estados excepcionais do legado sem autorizá-los nas RPCs correntes', () => {
    expect(migration).toMatch(/limite1_situacao = 'nao_se_aplica'[\s\S]*limite1 is null/);
    expect(migration).toMatch(/limite2_situacao = 'nao_se_aplica'[\s\S]*limite2 is null/);
    expect(migration.match(/not valid;/g)).toHaveLength(2);
  });

  it('não concede a função de gatilho a papéis expostos', () => {
    expect(migration).toMatch(/revoke all on function private\.r4_clear_stale_deadline_metadata\(\)[\s\S]*service_role/i);
    expect(migration).not.toMatch(/grant execute/i);
  });
});
