-- R4 — forma final das constraints de prazo.
-- A consistência estrutural depende de estado e data. Colunas históricas de
-- justificativa podem conter conteúdo legado e não bloqueiam edição da linha.
-- As RPCs correntes não gravam justificativa inicial nessas colunas; o motivo de
-- alterações novas é registrado no evento histórico auditável.

alter table public.sme_demandas
  drop constraint if exists sme_demandas_limite1_consistencia_check;

alter table public.sme_demandas
  add constraint sme_demandas_limite1_consistencia_check check (
    (limite1_situacao = 'definido' and limite1 is not null)
    or (limite1_situacao = 'nao_informado' and limite1 is null)
    or (limite1_situacao = 'nao_se_aplica' and limite1 is null)
  ) not valid;

alter table public.sme_demandas
  drop constraint if exists sme_demandas_limite2_consistencia_check;

alter table public.sme_demandas
  add constraint sme_demandas_limite2_consistencia_check check (
    (limite2_situacao = 'definido' and limite2 is not null)
    or (limite2_situacao = 'nao_informado' and limite2 is null)
    or (limite2_situacao = 'nao_se_aplica' and limite2 is null)
  ) not valid;

comment on constraint sme_demandas_limite1_consistencia_check
on public.sme_demandas is
  'R4 final: valida somente coerência entre estado e data; metadados históricos legados não bloqueiam nova operação.';

comment on constraint sme_demandas_limite2_consistencia_check
on public.sme_demandas is
  'R4 final: valida somente coerência entre estado e data; metadados históricos legados não bloqueiam nova operação.';
