-- R4 — compatibilidade aditiva para clientes que ainda não enviam o novo campo
-- de justificativa da próxima providência. As funções completas continuam sendo
-- a fronteira autoritativa e rejeitam data vencida quando o valor vazio não atende
-- à regra.

create or replace function public.criar_sme_demanda_r4(
  p_numero text,
  p_tipo text,
  p_assunto text,
  p_responsavel_id uuid,
  p_limite1 date,
  p_limite1_situacao text,
  p_limite2 date,
  p_limite2_situacao text,
  p_proxima_acao text,
  p_proxima_acao_em date,
  p_status text,
  p_setor text,
  p_classificacao text,
  p_link_origem text
)
returns public.sme_demandas
language sql
security definer
set search_path = ''
as $$
  select public.criar_sme_demanda_r4(
    p_numero,
    p_tipo,
    p_assunto,
    p_responsavel_id,
    p_limite1,
    p_limite1_situacao,
    p_limite2,
    p_limite2_situacao,
    p_proxima_acao,
    p_proxima_acao_em,
    '',
    p_status,
    p_setor,
    p_classificacao,
    p_link_origem
  );
$$;

create or replace function public.registrar_andamento_sme_demanda_r4(
  p_demanda_id bigint,
  p_comentario text,
  p_proxima_acao text,
  p_proxima_acao_em date
)
returns public.sme_demandas
language sql
security definer
set search_path = ''
as $$
  select public.registrar_andamento_sme_demanda_r4(
    p_demanda_id,
    p_comentario,
    p_proxima_acao,
    p_proxima_acao_em,
    ''
  );
$$;

create or replace function public.transicionar_status_sme_demanda_r4(
  p_demanda_id bigint,
  p_novo_status text,
  p_comentario text,
  p_proxima_acao text,
  p_proxima_acao_em date
)
returns public.sme_demandas
language sql
security definer
set search_path = ''
as $$
  select public.transicionar_status_sme_demanda_r4(
    p_demanda_id,
    p_novo_status,
    p_comentario,
    p_proxima_acao,
    p_proxima_acao_em,
    ''
  );
$$;

revoke all on function public.criar_sme_demanda_r4(
  text, text, text, uuid, date, text, date, text, text, date, text, text, text, text
) from public, anon, authenticated, service_role;
grant execute on function public.criar_sme_demanda_r4(
  text, text, text, uuid, date, text, date, text, text, date, text, text, text, text
) to authenticated;

revoke all on function public.registrar_andamento_sme_demanda_r4(
  bigint, text, text, date
) from public, anon, authenticated, service_role;
grant execute on function public.registrar_andamento_sme_demanda_r4(
  bigint, text, text, date
) to authenticated;

revoke all on function public.transicionar_status_sme_demanda_r4(
  bigint, text, text, text, date
) from public, anon, authenticated, service_role;
grant execute on function public.transicionar_status_sme_demanda_r4(
  bigint, text, text, text, date
) to authenticated;
