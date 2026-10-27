import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  resolve(migrationsDir, '20260730063856_r4_final_deadline_state_constraints.sql'),
  'utf8',
);

describe('constraints finais do R4', () => {
  it('valida somente a coerência entre estado e data', () => {
    expect(migration).toMatch(/limite1_situacao = 'definido' and limite1 is not null/);
    expect(migration).toMatch(/limite1_situacao = 'nao_informado' and limite1 is null/);
    expect(migration).toMatch(/limite1_situacao = 'nao_se_aplica' and limite1 is null/);
    expect(migration).toMatch(/limite2_situacao = 'definido' and limite2 is not null/);
    expect(migration).toMatch(/limite2_situacao = 'nao_informado' and limite2 is null/);
    expect(migration).toMatch(/limite2_situacao = 'nao_se_aplica' and limite2 is null/);
  });

  it('não usa colunas de justificativa como bloqueio estrutural', () => {
    expect(migration).not.toContain('limite1_justificativa');
    expect(migration).not.toContain('limite2_justificativa');
    expect(migration.match(/not valid;/g)).toHaveLength(2);
  });
});
