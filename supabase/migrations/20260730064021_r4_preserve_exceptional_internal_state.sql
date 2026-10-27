-- R4 — forma final da RPC de edição.
-- Permite preservar um eventual prazo interno Não se aplica já existente no
-- legado, mas continua proibindo que uma operação corrente crie esse estado.

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
    p_limite1,
    p_limite1_situacao,
    'Prazo interno',
    true,
    v_before.limite1_situacao = 'nao_se_aplica'
  );
  perform private.r4_validate_deadline_value(
    p_limite2, p_limite2_situacao, 'Prazo final', true, true
  );

  if p_limite1_situacao = 'nao_se_aplica'
     and v_before.limite1_situacao <> 'nao_se_aplica' then
    raise exception 'O prazo interno não pode ser marcado como Não se aplica.';
  end if;
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

revoke all on function public.editar_sme_demanda_r4(
  bigint, text, uuid, date, text, date, text, text, text, text, text
) from public, anon, authenticated, service_role;
grant execute on function public.editar_sme_demanda_r4(
  bigint, text, uuid, date, text, date, text, text, text, text, text
) to authenticated;
