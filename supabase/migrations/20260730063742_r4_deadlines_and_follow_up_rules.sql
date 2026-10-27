-- R4 — prazos, próxima providência e adequação progressiva do legado.
-- Migration aditiva: cria RPCs novas sem alterar ou revogar contratos anteriores.

create or replace function private.r4_operational_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (timezone('America/Sao_Paulo', now()))::date;
$$;

revoke all on function private.r4_operational_today()
from public, anon, authenticated;

create or replace function private.r4_validate_deadline_value(
  p_date date,
  p_state text,
  p_label text,
  p_allow_missing boolean,
  p_allow_not_applicable boolean
)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if p_state not in ('definido', 'nao_informado', 'nao_se_aplica') then
    raise exception '% possui situação inválida.', p_label;
  end if;

  if p_state = 'definido' and p_date is null then
    raise exception '% definido exige uma data.', p_label;
  end if;

  if p_state <> 'definido' and p_date is not null then
    raise exception '% sem data definida não pode manter uma data oculta.', p_label;
  end if;

  if p_state = 'nao_informado' and not p_allow_missing then
    raise exception '% deve ser preenchido ou receber uma escolha explícita.', p_label;
  end if;

  if p_state = 'nao_se_aplica' and not p_allow_not_applicable then
    raise exception '% não pode ser marcado como Não se aplica.', p_label;
  end if;
end;
$$;

revoke all on function private.r4_validate_deadline_value(date, text, text, boolean, boolean)
from public, anon, authenticated;

create or replace function private.r4_validate_deadline_order(
  p_internal_date date,
  p_internal_state text,
  p_final_date date,
  p_final_state text
)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if p_internal_state = 'definido'
     and p_final_state = 'definido'
     and p_internal_date > p_final_date then
    raise exception 'O prazo interno não pode ser posterior ao prazo final.';
  end if;
end;
$$;

revoke all on function private.r4_validate_deadline_order(date, text, date, text)
from public, anon, authenticated;

create or replace function private.r4_require_past_follow_up_reason(
  p_follow_up_date date,
  p_reason text
)
returns text
language plpgsql
stable
set search_path = ''
as $$
declare
  v_reason text := btrim(coalesce(p_reason, ''));
begin
  if p_follow_up_date is not null
     and p_follow_up_date < private.r4_operational_today() then
    return private.cycle4_require_text(
      v_reason,
      10,
      'A justificativa da data de acompanhamento já vencida deve possuir pelo menos 10 caracteres.'
    );
  end if;

  return '';
end;
$$;

revoke all on function private.r4_require_past_follow_up_reason(date, text)
from public, anon, authenticated;

create or replace function private.r4_compose_follow_up_comment(
  p_comment text,
  p_past_reason text
)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_comment text := btrim(coalesce(p_comment, ''));
  v_reason text := btrim(coalesce(p_past_reason, ''));
begin
  if v_reason = '' then
    return v_comment;
  end if;
  return v_comment || E'\nJustificativa da data vencida: ' || v_reason;
end;
$$;

revoke all on function private.r4_compose_follow_up_comment(text, text)
from public, anon, authenticated;

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
  p_proxima_acao_justificativa text,
  p_status text,
  p_setor text,
  p_classificacao text,
  p_link_origem text
)
returns public.sme_demandas
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_demanda public.sme_demandas;
  v_numero text;
  v_assunto text;
  v_responsavel text := '';
  v_proxima_acao text := btrim(coalesce(p_proxima_acao, ''));
  v_past_reason text := '';
  v_comment text := 'Demanda cadastrada no sistema.';
  v_changes jsonb := '[]'::jsonb;
begin
  if not private.can_edit() then
    raise exception 'Acesso negado: permissões insuficientes.';
  end if;

  v_numero := private.cycle4_require_text(
    p_numero, 1, 'O número do processo ou documento é obrigatório.'
  );
  v_assunto := private.cycle4_require_text(
    p_assunto, 1, 'O assunto da demanda é obrigatório.'
  );
  perform private.cycle4_require_text(
    p_classificacao, 1, 'A classificação da demanda é obrigatória.'
  );

  perform private.r4_validate_deadline_value(
    p_limite1, p_limite1_situacao, 'Prazo interno', false, false
  );
  perform private.r4_validate_deadline_value(
    p_limite2, p_limite2_situacao, 'Prazo final', false, true
  );
  perform private.r4_validate_deadline_order(
    p_limite1, p_limite1_situacao, p_limite2, p_limite2_situacao
  );

  if p_responsavel_id is not null then
    v_responsavel := private.r3_responsavel_nome(p_responsavel_id);
  end if;

  if p_status <> 'Encerrado' then
    v_proxima_acao := private.cycle4_require_text(
      p_proxima_acao, 5, 'A próxima providência deve possuir pelo menos 5 caracteres.'
    );
    if p_proxima_acao_em is null then
      raise exception 'A data da próxima providência é obrigatória.';
    end if;
    v_past_reason := private.r4_require_past_follow_up_reason(
      p_proxima_acao_em, p_proxima_acao_justificativa
    );
    v_comment := private.r4_compose_follow_up_comment(v_comment, v_past_reason);
  else
    v_proxima_acao := '';
    p_proxima_acao_em := null;
  end if;

  insert into public.sme_demandas (
    numero,
    tipo,
    assunto,
    responsavel_id,
    responsavel,
    limite1,
    limite1_situacao,
    limite1_justificativa,
    limite2,
    limite2_situacao,
    limite2_justificativa,
    proxima_acao,
    proxima_acao_em,
    link_origem,
    status,
    setor,
    classificacao,
    origem,
    created_by,
    updated_by
  ) values (
    v_numero,
    p_tipo,
    v_assunto,
    p_responsavel_id,
    v_responsavel,
    p_limite1,
    p_limite1_situacao,
    null,
    p_limite2,
    p_limite2_situacao,
    null,
    nullif(v_proxima_acao, ''),
    p_proxima_acao_em,
    nullif(btrim(coalesce(p_link_origem, '')), ''),
    p_status,
    btrim(coalesce(p_setor, '')),
    btrim(p_classificacao),
    'sistema',
    v_actor,
    v_actor
  )
  returning * into v_demanda;

  v_changes := private.cycle4_append_change(v_changes, 'status', null, v_demanda.status);
  v_changes := private.cycle4_append_change(v_changes, 'setor', null, v_demanda.setor);
  v_changes := private.cycle4_append_change(v_changes, 'origem', null, v_demanda.origem);
  v_changes := private.cycle4_append_change(v_changes, 'limite1', null, v_demanda.limite1::text);
  v_changes := private.cycle4_append_change(
    v_changes, 'limite1_situacao', null, v_demanda.limite1_situacao
  );
  v_changes := private.cycle4_append_change(
    v_changes, 'limite2', null, v_demanda.limite2::text
  );
  v_changes := private.cycle4_append_change(
    v_changes, 'limite2_situacao', null, v_demanda.limite2_situacao
  );
  if v_demanda.proxima_acao is not null then
    v_changes := private.cycle4_append_change(
      v_changes, 'proxima_acao', null, v_demanda.proxima_acao
    );
    v_changes := private.cycle4_append_change(
      v_changes, 'proxima_acao_em', null, v_demanda.proxima_acao_em::text
    );
  end if;
  if v_demanda.responsavel_id is not null then
    v_changes := private.cycle4_append_change(
      v_changes, 'responsavel_id', null, v_demanda.responsavel_id::text
    );
    v_changes := private.cycle4_append_change(
      v_changes, 'responsavel', null, v_demanda.responsavel
    );
  end if;

  insert into public.sme_historico (
    demanda_id,
    tipo_evento,
    status_anterior,
    status_novo,
    setor,
    comentario,
    alteracoes,
    created_by
  ) values (
    v_demanda.id,
    'criacao',
    null,
    v_demanda.status,
    v_demanda.setor,
    v_comment,
    v_changes,
    v_actor
  );

  return v_demanda;
end;
$$;

create or replace function public.editar_sme_demanda_r4(
  p_demanda_id bigint,
  p_assunto text,
  p_responsavel_id uuid,
  p_limite1 date,
  p_limite1_situacao text,
  p_limite2 date,
  p_limite2_situacao text,
  p_setor text,
  p_classificacao text,
  p_link_origem text,
  p_justificativa text
)
returns public.sme_demandas
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_before public.sme_demandas;
  v_after public.sme_demandas;
  v_assunto text;
  v_justificativa text := btrim(coalesce(p_justificativa, ''));
  v_changes jsonb := '[]'::jsonb;
  v_responsibility_changed boolean := false;
  v_deadline_changed boolean := false;
  v_deadline_requires_reason boolean := false;
  v_other_changed boolean := false;
  v_event_type text;
  v_comment text;
begin
  if not private.can_edit() then
    raise exception 'Acesso negado: permissões insuficientes.';
  end if;

  select * into v_before
  from public.sme_demandas
  where id = p_demanda_id
  for update;

  if not found then
    raise exception 'Demanda não encontrada.';
  end if;
  if v_before.deleted_at is not null then
    raise exception 'Demanda excluída não pode ser editada. Restaure o registro primeiro.';
  end if;

  v_assunto := private.cycle4_require_text(
    p_assunto, 1, 'O assunto da demanda é obrigatório.'
  );
  perform private.cycle4_require_text(
    p_classificacao, 1, 'A classificação da demanda é obrigatória.'
  );

  perform private.r4_validate_deadline_value(
    p_limite1, p_limite1_situacao, 'Prazo interno', true, false
  );
  perform private.r4_validate_deadline_value(
    p_limite2, p_limite2_situacao, 'Prazo final', true, true
  );

  if v_before.limite1_situacao <> 'nao_informado'
     and p_limite1_situacao = 'nao_informado' then
    raise exception 'Um prazo interno já registrado não pode voltar a Não informado.';
  end if;
  if v_before.limite2_situacao <> 'nao_informado'
     and p_limite2_situacao = 'nao_informado' then
    raise exception 'Um prazo final já registrado não pode voltar a Não informado.';
  end if;

  perform private.r4_validate_deadline_order(
    p_limite1, p_limite1_situacao, p_limite2, p_limite2_situacao
  );

  if v_before.assunto is distinct from v_assunto then
    v_changes := private.cycle4_append_change(v_changes, 'assunto', v_before.assunto, v_assunto);
    v_other_changed := true;
  end if;
  if v_before.responsavel_id is distinct from p_responsavel_id then
    v_changes := private.cycle4_append_change(
      v_changes, 'responsavel_id', v_before.responsavel_id::text, p_responsavel_id::text
    );
    v_responsibility_changed := true;
  end if;
  if v_before.limite1 is distinct from p_limite1 then
    v_changes := private.cycle4_append_change(
      v_changes, 'limite1', v_before.limite1::text, p_limite1::text
    );
    v_deadline_changed := true;
  end if;
  if v_before.limite1_situacao is distinct from p_limite1_situacao then
    v_changes := private.cycle4_append_change(
      v_changes, 'limite1_situacao', v_before.limite1_situacao, p_limite1_situacao
    );
    v_deadline_changed := true;
  end if;
  if v_before.limite2 is distinct from p_limite2 then
    v_changes := private.cycle4_append_change(
      v_changes, 'limite2', v_before.limite2::text, p_limite2::text
    );
    v_deadline_changed := true;
  end if;
  if v_before.limite2_situacao is distinct from p_limite2_situacao then
    v_changes := private.cycle4_append_change(
      v_changes, 'limite2_situacao', v_before.limite2_situacao, p_limite2_situacao
    );
    v_deadline_changed := true;
  end if;
  if v_before.setor is distinct from btrim(coalesce(p_setor, '')) then
    v_changes := private.cycle4_append_change(
      v_changes, 'setor', v_before.setor, btrim(coalesce(p_setor, ''))
    );
    v_other_changed := true;
  end if;
  if v_before.classificacao is distinct from btrim(p_classificacao) then
    v_changes := private.cycle4_append_change(
      v_changes, 'classificacao', v_before.classificacao, btrim(p_classificacao)
    );
    v_other_changed := true;
  end if;
  if coalesce(v_before.link_origem, '') is distinct from btrim(coalesce(p_link_origem, '')) then
    v_changes := private.cycle4_append_change(
      v_changes,
      'link_origem',
      v_before.link_origem,
      nullif(btrim(coalesce(p_link_origem, '')), '')
    );
    v_other_changed := true;
  end if;

  if jsonb_array_length(v_changes) = 0 then
    raise exception 'Nenhuma alteração foi identificada.';
  end if;

  v_deadline_requires_reason := (
    v_before.limite1_situacao <> 'nao_informado'
    and (
      v_before.limite1 is distinct from p_limite1
      or v_before.limite1_situacao is distinct from p_limite1_situacao
    )
  ) or (
    v_before.limite2_situacao <> 'nao_informado'
    and (
      v_before.limite2 is distinct from p_limite2
      or v_before.limite2_situacao is distinct from p_limite2_situacao
    )
  );

  if v_deadline_requires_reason
     or v_responsibility_changed
     or v_other_changed then
    v_justificativa := private.cycle4_require_text(
      v_justificativa,
      10,
      'A justificativa da alteração deve possuir pelo menos 10 caracteres.'
    );
  end if;

  if v_deadline_changed
     and not v_responsibility_changed
     and not v_other_changed then
    v_event_type := 'alteracao_prazo';
    v_comment := case
      when v_justificativa <> '' then v_justificativa
      else 'Prazo ausente no legado preenchido pela primeira vez.'
    end;
  elsif v_responsibility_changed
        and not v_deadline_changed
        and not v_other_changed then
    v_event_type := 'reatribuicao';
    v_comment := v_justificativa;
  else
    v_event_type := 'edicao';
    v_comment := v_justificativa;
  end if;

  update public.sme_demandas
  set
    assunto = v_assunto,
    responsavel_id = p_responsavel_id,
    limite1 = p_limite1,
    limite1_situacao = p_limite1_situacao,
    limite2 = p_limite2,
    limite2_situacao = p_limite2_situacao,
    setor = btrim(coalesce(p_setor, '')),
    classificacao = btrim(p_classificacao),
    link_origem = nullif(btrim(coalesce(p_link_origem, '')), ''),
    updated_by = v_actor
  where id = p_demanda_id
  returning * into v_after;

  if v_before.responsavel is distinct from v_after.responsavel then
    v_changes := private.cycle4_append_change(
      v_changes, 'responsavel', v_before.responsavel, v_after.responsavel
    );
  end if;

  insert into public.sme_historico (
    demanda_id,
    tipo_evento,
    status_anterior,
    status_novo,
    setor,
    comentario,
    alteracoes,
    created_by
  ) values (
    v_after.id,
    v_event_type,
    v_before.status,
    v_after.status,
    v_after.setor,
    v_comment,
    v_changes,
    v_actor
  );

  return v_after;
end;
$$;

create or replace function public.registrar_andamento_sme_demanda_r4(
  p_demanda_id bigint,
  p_comentario text,
  p_proxima_acao text,
  p_proxima_acao_em date,
  p_proxima_acao_justificativa text
)
returns public.sme_demandas
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_before public.sme_demandas;
  v_after public.sme_demandas;
  v_comentario text;
  v_proxima_acao text;
  v_past_reason text;
  v_changes jsonb := '[]'::jsonb;
begin
  if not private.can_edit() then
    raise exception 'Acesso negado: permissões insuficientes.';
  end if;

  select * into v_before
  from public.sme_demandas
  where id = p_demanda_id
  for update;

  if not found then
    raise exception 'Demanda não encontrada.';
  end if;
  if v_before.deleted_at is not null then
    raise exception 'Demanda excluída não pode receber andamento.';
  end if;
  if v_before.status = 'Encerrado' then
    raise exception 'Demanda encerrada não recebe andamento. Use a transição de status para reabri-la.';
  end if;

  v_comentario := private.cycle4_require_text(
    p_comentario, 1, 'O comentário do andamento é obrigatório.'
  );
  v_proxima_acao := private.cycle4_require_text(
    p_proxima_acao, 5, 'A próxima providência deve possuir pelo menos 5 caracteres.'
  );
  if p_proxima_acao_em is null then
    raise exception 'A data da próxima providência é obrigatória.';
  end if;
  v_past_reason := private.r4_require_past_follow_up_reason(
    p_proxima_acao_em, p_proxima_acao_justificativa
  );
  v_comentario := private.r4_compose_follow_up_comment(v_comentario, v_past_reason);

  if coalesce(v_before.proxima_acao, '') is distinct from v_proxima_acao then
    v_changes := private.cycle4_append_change(
      v_changes, 'proxima_acao', v_before.proxima_acao, v_proxima_acao
    );
  end if;
  if v_before.proxima_acao_em is distinct from p_proxima_acao_em then
    v_changes := private.cycle4_append_change(
      v_changes, 'proxima_acao_em', v_before.proxima_acao_em::text, p_proxima_acao_em::text
    );
  end if;

  update public.sme_demandas
  set
    proxima_acao = v_proxima_acao,
    proxima_acao_em = p_proxima_acao_em,
    updated_by = v_actor
  where id = p_demanda_id
  returning * into v_after;

  insert into public.sme_historico (
    demanda_id,
    tipo_evento,
    status_anterior,
    status_novo,
    setor,
    comentario,
    alteracoes,
    created_by
  ) values (
    v_after.id,
    'andamento',
    v_before.status,
    v_after.status,
    v_after.setor,
    v_comentario,
    v_changes,
    v_actor
  );

  return v_after;
end;
$$;

create or replace function public.transicionar_status_sme_demanda_r4(
  p_demanda_id bigint,
  p_novo_status text,
  p_comentario text,
  p_proxima_acao text,
  p_proxima_acao_em date,
  p_proxima_acao_justificativa text
)
returns public.sme_demandas
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_before public.sme_demandas;
  v_after public.sme_demandas;
  v_comentario text;
  v_proxima_acao text := btrim(coalesce(p_proxima_acao, ''));
  v_past_reason text := '';
  v_changes jsonb := '[]'::jsonb;
begin
  if not private.can_edit() then
    raise exception 'Acesso negado: permissões insuficientes.';
  end if;

  select * into v_before
  from public.sme_demandas
  where id = p_demanda_id
  for update;

  if not found then
    raise exception 'Demanda não encontrada.';
  end if;
  if v_before.deleted_at is not null then
    raise exception 'Demanda excluída não pode mudar de status.';
  end if;
  if v_before.status = p_novo_status then
    raise exception 'O status informado já é o atual. Use Registrar andamento para incluir nova movimentação.';
  end if;

  v_comentario := private.cycle4_require_text(
    p_comentario, 1, 'O comentário da transição é obrigatório.'
  );

  if p_novo_status = 'Encerrado' then
    v_proxima_acao := '';
    p_proxima_acao_em := null;
  else
    v_proxima_acao := private.cycle4_require_text(
      p_proxima_acao, 5, 'A próxima providência deve possuir pelo menos 5 caracteres.'
    );
    if p_proxima_acao_em is null then
      raise exception 'A data da próxima providência é obrigatória.';
    end if;
    v_past_reason := private.r4_require_past_follow_up_reason(
      p_proxima_acao_em, p_proxima_acao_justificativa
    );
    v_comentario := private.r4_compose_follow_up_comment(v_comentario, v_past_reason);
  end if;

  v_changes := private.cycle4_append_change(v_changes, 'status', v_before.status, p_novo_status);
  if coalesce(v_before.proxima_acao, '') is distinct from v_proxima_acao then
    v_changes := private.cycle4_append_change(
      v_changes, 'proxima_acao', v_before.proxima_acao, nullif(v_proxima_acao, '')
    );
  end if;
  if v_before.proxima_acao_em is distinct from p_proxima_acao_em then
    v_changes := private.cycle4_append_change(
      v_changes, 'proxima_acao_em', v_before.proxima_acao_em::text, p_proxima_acao_em::text
    );
  end if;

  update public.sme_demandas
  set
    status = p_novo_status,
    proxima_acao = nullif(v_proxima_acao, ''),
    proxima_acao_em = p_proxima_acao_em,
    updated_by = v_actor
  where id = p_demanda_id
  returning * into v_after;

  insert into public.sme_historico (
    demanda_id,
    tipo_evento,
    status_anterior,
    status_novo,
    setor,
    comentario,
    alteracoes,
    created_by
  ) values (
    v_after.id,
    'mudanca_status',
    v_before.status,
    v_after.status,
    v_after.setor,
    v_comentario,
    v_changes,
    v_actor
  );

  return v_after;
end;
$$;

revoke all on function public.criar_sme_demanda_r4(
  text, text, text, uuid, date, text, date, text, text, date, text, text, text, text, text
) from public, anon, authenticated, service_role;
grant execute on function public.criar_sme_demanda_r4(
  text, text, text, uuid, date, text, date, text, text, date, text, text, text, text, text
) to authenticated;

revoke all on function public.editar_sme_demanda_r4(
  bigint, text, uuid, date, text, date, text, text, text, text, text
) from public, anon, authenticated, service_role;
grant execute on function public.editar_sme_demanda_r4(
  bigint, text, uuid, date, text, date, text, text, text, text, text
) to authenticated;

revoke all on function public.registrar_andamento_sme_demanda_r4(
  bigint, text, text, date, text
) from public, anon, authenticated, service_role;
grant execute on function public.registrar_andamento_sme_demanda_r4(
  bigint, text, text, date, text
) to authenticated;

revoke all on function public.transicionar_status_sme_demanda_r4(
  bigint, text, text, text, date, text
) from public, anon, authenticated, service_role;
grant execute on function public.transicionar_status_sme_demanda_r4(
  bigint, text, text, text, date, text
) to authenticated;
