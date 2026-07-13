import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationPath = resolve(dirname(fileURLToPath(import.meta.url)), '20260707000000_sme_demandas.sql');
const sql = readFileSync(migrationPath, 'utf8').toLowerCase();

describe('migração Supabase', () => {
  it('protege todas as tabelas públicas com RLS', () => {
    for (const table of ['perfis_usuarios', 'sme_demandas', 'sme_historico']) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it('não usa metadados do usuário para autorização', () => {
    expect(sql).not.toContain("raw_user_meta_data->>'nivel'");
    expect(sql).not.toContain("raw_user_meta_data->>'status'");
  });

  it('revoga execução pública dos helpers privilegiados', () => {
    for (const helper of ['is_active', 'can_edit', 'is_admin']) {
      expect(sql).toContain(`revoke all on function private.${helper}() from public`);
    }
  });

  it('usa helpers security definer com search_path vazio', () => {
    expect(sql.match(/security definer/g)?.length).toBeGreaterThanOrEqual(4);
    expect(sql.match(/set search_path = ''/g)?.length).toBeGreaterThanOrEqual(6);
  });

  it('cria RPCs security definer e concede somente ao papel autenticado', () => {
    expect(sql).toContain('create or replace function public.criar_sme_demanda');
    expect(sql).toContain('create or replace function public.atualizar_status_sme_demanda');
    expect(sql.match(/security definer/g)?.length).toBeGreaterThanOrEqual(6);
    expect(sql).toContain('grant execute on function public.criar_sme_demanda');
    expect(sql).toContain('grant execute on function public.atualizar_status_sme_demanda');
  });

  it('concede privilégios explícitos às tabelas do novo projeto', () => {
    expect(sql).toContain('grant select on table public.perfis_usuarios to authenticated');
    expect(sql).toContain('grant update (nivel, status, setor) on table public.perfis_usuarios to authenticated');
    expect(sql).toContain('grant select, insert, delete on table public.sme_demandas to authenticated');
    expect(sql).toContain('grant update (numero, tipo, assunto, responsavel, limite1, limite2, setor, classificacao) on table public.sme_demandas to authenticated');
    expect(sql).toContain('grant select on table public.sme_historico to authenticated');
  });

  it('habilita Realtime para demandas e histórico', () => {
    expect(sql).toContain('alter publication supabase_realtime add table public.sme_demandas');
    expect(sql).toContain('alter publication supabase_realtime add table public.sme_historico');
  });
});
