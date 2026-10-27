-- R4 — substitui constraints de consistência criadas antes das decisões finais.
-- Não altera dados existentes. As novas constraints seguem NOT VALID para preservar
-- leitura do legado e passam a validar imediatamente toda escrita nova.

alter table public.sme_demandas
  drop constraint if exists sme_demandas_limite1_consistencia_check;

alter table public.sme_demandas
  add constraint sme_demandas_limite1_consistencia_check check (
    (limite1_situacao = 'definido'
      and limite1 is not null
      and limite1_justificativa is null)
    or (limite1_situacao = 'nao_informado'
      and limite1 is null
      and limite1_justificativa is null)
  ) not valid;

alter table public.sme_demandas
  drop constraint if exists sme_demandas_limite2_consistencia_check;

alter table public.sme_demandas
  add constraint sme_demandas_limite2_consistencia_check check (
    (limite2_situacao = 'definido'
      and limite2 is not null
      and limite2_justificativa is null)
    or (limite2_situacao = 'nao_informado'
      and limite2 is null
      and limite2_justificativa is null)
    or (limite2_situacao = 'nao_se_aplica'
      and limite2 is null
      and limite2_justificativa is null)
  ) not valid;

comment on constraint sme_demandas_limite1_consistencia_check
on public.sme_demandas is
  'R4: prazo interno admite data definida ou ausência legada; Não se aplica não é permitido.';

comment on constraint sme_demandas_limite2_consistencia_check
on public.sme_demandas is
  'R4: prazo final admite data definida, ausência legada ou Não se aplica sem justificativa inicial; justificativas de alterações ficam no histórico.';
