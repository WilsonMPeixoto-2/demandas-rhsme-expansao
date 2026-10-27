import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  resolve(migrationsDir, '20260730063923_r4_optional_reason_compatibility.sql'),
  'utf8',
);

describe('compatibilidade aditiva das RPCs R4', () => {
  it('delega ao contrato completo usando justificativa vazia', () => {
    expect(migration.match(/select public\.criar_sme_demanda_r4\(/g)).toHaveLength(1);
    expect(migration.match(/select public\.registrar_andamento_sme_demanda_r4\(/g)).toHaveLength(1);
    expect(migration.match(/select public\.transicionar_status_sme_demanda_r4\(/g)).toHaveLength(1);
    expect(migration.match(/\r?\n\s*'',\r?\n/g)?.length ?? 0).toBeGreaterThanOrEqual(1);
  });

  it('mantém grants restritos ao authenticated', () => {
    expect(migration).not.toMatch(/grant execute on function public\.[\s\S]*?\) to service_role;/i);
    expect(migration.match(/grant execute on function/g)).toHaveLength(3);
    expect(migration.match(/to authenticated;/g)).toHaveLength(3);
  });
});
