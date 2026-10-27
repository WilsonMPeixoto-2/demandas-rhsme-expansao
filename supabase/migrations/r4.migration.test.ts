import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = dirname(fileURLToPath(import.meta.url));
const rules = readFileSync(
  resolve(migrationsDir, '20260730063742_r4_deadlines_and_follow_up_rules.sql'),
  'utf8',
);
const constraints = readFileSync(
  resolve(migrationsDir, '20260730063806_r4_deadline_consistency_constraints.sql'),
  'utf8',
);

describe('migrations R4 — prazos e próxima providência', () => {
  it('usa o fuso operacional e não cria bloqueio por current_date', () => {
    expect(rules).toContain("timezone('America/Sao_Paulo', now())");
    expect(rules).not.toMatch(/check\s*\([^)]*current_date/i);
  });

  it('cria quatro RPCs aditivas e auditáveis', () => {
    for (const name of [
      'criar_sme_demanda_r4',
      'editar_sme_demanda_r4',
      'registrar_andamento_sme_demanda_r4',
      'transicionar_status_sme_demanda_r4',
    ]) {
      expect(rules).toContain(`create or replace function public.${name}`);
      expect(rules).toContain(`grant execute on function public.${name}`);
    }
    expect(rules).toContain('insert into public.sme_historico');
    expect(rules).toContain('Prazo ausente no legado preenchido pela primeira vez.');
    expect(rules).toContain('Justificativa da data vencida:');
  });

  it('não concede execução nova ao service_role', () => {
    expect(rules).toMatch(/revoke all on function public\.criar_sme_demanda_r4[\s\S]*service_role/i);
    expect(rules).not.toMatch(/grant execute on function public\.[\s\S]*?\) to service_role;/i);
  });

  it('alinha constraints ao prazo interno e ao Não se aplica sem justificativa inicial', () => {
    expect(constraints).toContain('drop constraint if exists sme_demandas_limite1_consistencia_check');
    expect(constraints).toContain('drop constraint if exists sme_demandas_limite2_consistencia_check');
    expect(constraints).not.toMatch(/limite1_situacao = 'nao_se_aplica'/);
    expect(constraints).toMatch(/limite2_situacao = 'nao_se_aplica'[\s\S]*limite2_justificativa is null/);
    expect(constraints.match(/not valid;/g)).toHaveLength(2);
  });
});
