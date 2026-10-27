-- R4 — preservação de estados e justificativas históricas de prazo.
-- Regras correntes não criam prazo interno Não se aplica nem justificativa inicial
-- para prazo final Não se aplica. Entretanto, valores legados já existentes devem
-- continuar legíveis e não podem bloquear uma edição não relacionada.

create or replace function private.r4_clear_stale_deadline_metadata()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.limite1 is distinct from new.limite1
     or old.limite1_situacao is distinct from new.limite1_situacao then
    new.limite1_justificativa := null;
  end if;

  if old.limite2 is distinct from new.limite2
     or old.limite2_situacao is distinct from new.limite2_situacao then
    new.limite2_justificativa := null;
  end if;

  return new;
end;
$$;

revoke all on function private.r4_clear_stale_deadline_metadata()
from public, anon, authenticated, service_role;

drop trigger if exists sme_demandas_r4_clear_stale_deadline_metadata
on public.sme_demandas;

create trigger sme_demandas_r4_clear_stale_deadline_metadata
before update of limite1, limite1_situacao, limite2, limite2_situacao
on public.sme_demandas
for each row
execute function private.r4_clear_stale_deadline_metadata();

alter table public.sme_demandas
  drop constraint if exists sme_demandas_limite1_consistencia_check;

alter table public.sme_demandas
  add constraint sme_demandas_limite1_consistencia_check check (
    (limite1_situacao = 'definido'
      and limite1 is not null
      and limite1_justificativa is null)
    or (limite1_situacao = 'nao_informado'
      and limite1 is null)
    or (limite1_situacao = 'nao_se_aplica'
      and limite1 is null)
  ) not valid;

alter table public.sme_demandas
  drop constraint if exists sme_demandas_limite2_consistencia_check;

alter table public.sme_demandas
  add constraint sme_demandas_limite2_consistencia_check check (
    (limite2_situacao = 'definido'
      and limite2 is not null
      and limite2_justificativa is null)
    or (limite2_situacao = 'nao_informado'
      and limite2 is null)
    or (limite2_situacao = 'nao_se_aplica'
      and limite2 is null)
  ) not valid;

comment on function private.r4_clear_stale_deadline_metadata() is
  'Preserva justificativas históricas em edição não relacionada e limpa metadados obsoletos somente quando data ou estado do prazo muda.';

comment on constraint sme_demandas_limite1_consistencia_check
on public.sme_demandas is
  'R4 final: novas operações não criam prazo interno Não se aplica; eventual valor legado permanece consultável e editável sem perda.';

comment on constraint sme_demandas_limite2_consistencia_check
on public.sme_demandas is
  'R4 final: prazo final admite data, ausência legada ou Não se aplica; justificativa histórica legada é preservada até alteração consciente.';
