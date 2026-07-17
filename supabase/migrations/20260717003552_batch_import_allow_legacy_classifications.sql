-- Corrige o contrato do lote para classificações legítimas já existentes na base.
-- A migração anterior permanece imutável em produção; esta substitui apenas a RPC.

create or replace function public.importar_sme_demandas_lote(
  p_lote jsonb,
  p_source_hash text,
  p_client_payload_hash text,
  p_expected_server_payload_hash text,
  p_expected_count integer,
  p_expected_db_fingerprint text,
  p_expected_historico_fingerprint text,
  p_actor_id uuid,
  p_apply boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_batch_hash text;
  v_db_fingerprint text;
  v_db_fingerprint_after text;
  v_db_count integer;
  v_db_count_after integer;
  v_db_max_id bigint;
  v_historico_fingerprint text;
  v_historico_fingerprint_after text;
  v_historico_count integer;
  v_historico_count_after integer;
  v_historico_max_id bigint;
  v_existing_batch private.sme_importacoes%rowtype;
  v_item jsonb;
  v_demanda_id bigint;
  v_inserted integer := 0;
  v_item_count integer;
  v_linked_count integer;
  v_import_history_count integer;
begin
  -- Um lote por vez e uma única transação para toda a carga.
  perform pg_catalog.pg_advisory_xact_lock(3344556677);

  if p_actor_id is null or not exists (
    select 1
    from public.perfis_usuarios
    where id = p_actor_id
      and nivel = 'administrador'
      and status = 'ativo'
  ) then
    raise exception 'O autor informado para a importação não é um administrador ativo.';
  end if;

  if p_apply is null then
    raise exception 'O modo da operação deve ser informado explicitamente.';
  end if;

  if jsonb_typeof(p_lote) is distinct from 'array' then
    raise exception 'O lote deve ser um array JSON.';
  end if;
  if p_expected_count is null or p_expected_count <= 0 then
    raise exception 'A quantidade esperada deve ser positiva.';
  end if;
  if jsonb_array_length(p_lote) <> p_expected_count then
    raise exception 'Quantidade do lote divergente: recebido %, esperado %.',
      jsonb_array_length(p_lote), p_expected_count;
  end if;
  if p_source_hash is null or p_source_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Hash do arquivo de origem inválido.';
  end if;
  if p_client_payload_hash is null or p_client_payload_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Hash canônico do cliente inválido.';
  end if;

  v_batch_hash := pg_catalog.encode(
    extensions.digest(pg_catalog.convert_to(p_lote::text, 'UTF8'), 'sha256'),
    'hex'
  );

  select * into v_existing_batch
  from private.sme_importacoes
  where batch_hash = v_batch_hash;

  if found then
    if v_existing_batch.source_hash <> p_source_hash
      or v_existing_batch.client_payload_hash <> p_client_payload_hash
      or v_existing_batch.expected_count <> p_expected_count
      or v_existing_batch.status <> 'concluido'
    then
      raise exception 'Conflito na trilha de auditoria do lote existente.';
    end if;

    return jsonb_build_object(
      'status', 'already_applied',
      'batch_hash', v_batch_hash,
      'expected_count', v_existing_batch.expected_count,
      'created_count', v_existing_batch.created_count
    );
  end if;

  if p_apply is true and (
    p_expected_server_payload_hash is null
    or p_expected_server_payload_hash <> v_batch_hash
  ) then
    raise exception 'O payload difere daquele aprovado no dry-run.';
  end if;

  -- Bloqueia escritas concorrentes, inclusive das RPCs antigas, durante toda a
  -- validação/fotografia e, no apply, até a reconciliação final.
  lock table public.sme_demandas in share row exclusive mode;
  lock table public.sme_historico in share row exclusive mode;

  -- A conversão tipada também rejeita datas e linhas em formatos inválidos.
  if exists (
    select 1
    from jsonb_to_recordset(p_lote) as x(
      source_line integer,
      numero text,
      tipo text,
      assunto text,
      responsavel text,
      limite1 date,
      limite2 date,
      status text,
      setor text,
      classificacao text
    )
    where source_line is null or source_line <= 0
      or numero is null or numero = '' or numero <> btrim(numero)
      or tipo is null or tipo not in ('Expediente', 'Processo', 'Outros')
      or assunto is null or assunto = '' or assunto <> btrim(assunto)
      or responsavel is null or responsavel = '' or responsavel <> btrim(responsavel)
      or status is null or status not in (
        'Aguardando Andamento', 'Tramitado', 'Para Assinatura',
        'Encerrado', 'Sobrestado', 'Ajustar'
      )
      or setor is null or setor = '' or setor <> btrim(setor)
      or classificacao is null or classificacao not in (
        'Dispensa de Ponto', 'CCFG', 'Cessão', 'Concursos', 'Contratação',
        'Consultas', 'Inventário', 'Expediente Parlamentar', 'MP',
        'Representação Judicial', 'DP', 'PGM', 'Recurso', 'Financeiro',
        'Demanda Interna', 'Permuta', 'Diversos', 'Outros'
      )
      or (limite1 is not null and limite2 is not null and limite2 < limite1)
      or numero !~ (
        '^([0-9]{6}\.[0-9]{6}/[0-9]{4}-[0-9]{2}'
        || '|[0-9]{7}-[0-9]{2}\.[0-9]{4}\.[0-9]\.[0-9]{2}\.[0-9]{4}'
        || '|[A-Z]{2,6}-(PRO|OFI|MEM|CAP)-[0-9]{4}/[0-9]{5}(-V[0-9]{2}|-[A-Z][0-9]*)?)$'
      )
  ) then
    raise exception 'O lote contém campo obrigatório, domínio, data ou identificador inválido.';
  end if;

  if exists (
    select source_line
    from jsonb_to_recordset(p_lote) as x(source_line integer)
    group by source_line
    having count(*) > 1
  ) then
    raise exception 'O lote contém linha de origem duplicada.';
  end if;

  if exists (
    select numero
    from jsonb_to_recordset(p_lote) as x(numero text)
    group by numero
    having count(*) > 1
  ) then
    raise exception 'O lote contém número duplicado.';
  end if;

  if exists (
    select pg_catalog.regexp_replace(pg_catalog.upper(numero), '[^A-Z0-9]', '', 'g')
    from jsonb_to_recordset(p_lote) as x(numero text)
    group by pg_catalog.regexp_replace(pg_catalog.upper(numero), '[^A-Z0-9]', '', 'g')
    having count(*) > 1
  ) then
    raise exception 'O lote contém número duplicado após normalização.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_lote) as x(numero text)
    join public.sme_demandas d
      on d.numero = x.numero
      or pg_catalog.regexp_replace(pg_catalog.upper(d.numero), '[^A-Z0-9]', '', 'g')
        = pg_catalog.regexp_replace(pg_catalog.upper(x.numero), '[^A-Z0-9]', '', 'g')
  ) then
    raise exception 'O lote colide com número já existente no banco.';
  end if;

  select
    md5(coalesce(string_agg(
      concat_ws(chr(31),
        id::text, numero, tipo, assunto, responsavel,
        coalesce(limite1::text, ''), coalesce(limite2::text, ''),
        status, setor, classificacao,
        coalesce(created_by::text, ''), coalesce(updated_by::text, ''),
        extract(epoch from created_at)::text, extract(epoch from updated_at)::text
      ),
      chr(30) order by id
    ), '')),
    count(*)::integer,
    coalesce(max(id), 0)::bigint
  into v_db_fingerprint, v_db_count, v_db_max_id
  from public.sme_demandas;

  select
    md5(coalesce(string_agg(
      concat_ws(chr(31),
        id::text, demanda_id::text, status_novo, setor, comentario,
        coalesce(created_by::text, ''), extract(epoch from created_at)::text
      ),
      chr(30) order by id
    ), '')),
    count(*)::integer,
    coalesce(max(id), 0)::bigint
  into v_historico_fingerprint, v_historico_count, v_historico_max_id
  from public.sme_historico;

  if p_apply is not true then
    return jsonb_build_object(
      'status', 'dry_run_ok',
      'batch_hash', v_batch_hash,
      'client_payload_hash', p_client_payload_hash,
      'source_hash', p_source_hash,
      'validated_count', p_expected_count,
      'db_fingerprint', v_db_fingerprint,
      'db_count', v_db_count,
      'historico_fingerprint', v_historico_fingerprint,
      'historico_count', v_historico_count,
      'collisions', 0
    );
  end if;

  if p_expected_db_fingerprint is null
    or p_expected_db_fingerprint <> v_db_fingerprint
  then
    raise exception 'A fotografia do banco mudou desde o dry-run; a importação foi cancelada.';
  end if;

  if p_expected_historico_fingerprint is null
    or p_expected_historico_fingerprint <> v_historico_fingerprint
  then
    raise exception 'O histórico mudou desde o dry-run; a importação foi cancelada.';
  end if;

  insert into private.sme_importacoes (
    batch_hash, source_hash, client_payload_hash, expected_count, actor_id,
    db_fingerprint_before, db_count_before, db_max_id_before,
    historico_fingerprint_before, historico_count_before, historico_max_id_before,
    status
  ) values (
    v_batch_hash, p_source_hash, p_client_payload_hash, p_expected_count, p_actor_id,
    v_db_fingerprint, v_db_count, v_db_max_id,
    v_historico_fingerprint, v_historico_count, v_historico_max_id,
    'processando'
  );

  for v_item in
    select value
    from jsonb_array_elements(p_lote)
    order by (value ->> 'source_line')::integer
  loop
    insert into public.sme_demandas (
      numero, tipo, assunto, responsavel, limite1, limite2, status,
      setor, classificacao, created_by, updated_by
    ) values (
      v_item ->> 'numero',
      v_item ->> 'tipo',
      v_item ->> 'assunto',
      v_item ->> 'responsavel',
      nullif(v_item ->> 'limite1', '')::date,
      nullif(v_item ->> 'limite2', '')::date,
      v_item ->> 'status',
      v_item ->> 'setor',
      v_item ->> 'classificacao',
      p_actor_id,
      p_actor_id
    )
    returning id into v_demanda_id;

    insert into public.sme_historico (
      demanda_id, status_novo, setor, comentario, created_by
    ) values (
      v_demanda_id,
      v_item ->> 'status',
      v_item ->> 'setor',
      'Demanda importada do lote saneado ' || left(v_batch_hash, 12) || '.',
      p_actor_id
    );

    insert into private.sme_importacao_itens (
      batch_hash, source_line, numero, demanda_id, record_hash
    ) values (
      v_batch_hash,
      (v_item ->> 'source_line')::integer,
      v_item ->> 'numero',
      v_demanda_id,
      pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(v_item::text, 'UTF8'), 'sha256'),
        'hex'
      )
    );

    v_inserted := v_inserted + 1;
  end loop;

  select count(*)::integer into v_item_count
  from private.sme_importacao_itens
  where batch_hash = v_batch_hash;

  select count(*)::integer into v_linked_count
  from private.sme_importacao_itens i
  join public.sme_demandas d on d.id = i.demanda_id
  where i.batch_hash = v_batch_hash;

  select count(*)::integer into v_import_history_count
  from private.sme_importacao_itens i
  join public.sme_historico h on h.demanda_id = i.demanda_id
  where i.batch_hash = v_batch_hash
    and h.created_by = p_actor_id
    and h.comentario = 'Demanda importada do lote saneado ' || left(v_batch_hash, 12) || '.';

  if exists (
    select 1
    from jsonb_to_recordset(p_lote) as x(
      source_line integer,
      numero text,
      tipo text,
      assunto text,
      responsavel text,
      limite1 date,
      limite2 date,
      status text,
      setor text,
      classificacao text
    )
    join private.sme_importacao_itens i
      on i.batch_hash = v_batch_hash and i.source_line = x.source_line
    join public.sme_demandas d on d.id = i.demanda_id
    where d.numero is distinct from x.numero
      or d.tipo is distinct from x.tipo
      or d.assunto is distinct from x.assunto
      or d.responsavel is distinct from x.responsavel
      or d.limite1 is distinct from x.limite1
      or d.limite2 is distinct from x.limite2
      or d.status is distinct from x.status
      or d.setor is distinct from x.setor
      or d.classificacao is distinct from x.classificacao
  ) then
    raise exception 'Reconciliação campo a campo falhou.';
  end if;

  select count(*)::integer into v_db_count_after from public.sme_demandas;
  select count(*)::integer into v_historico_count_after from public.sme_historico;

  select md5(coalesce(string_agg(
    concat_ws(chr(31),
      id::text, numero, tipo, assunto, responsavel,
      coalesce(limite1::text, ''), coalesce(limite2::text, ''),
      status, setor, classificacao,
      coalesce(created_by::text, ''), coalesce(updated_by::text, ''),
      extract(epoch from created_at)::text, extract(epoch from updated_at)::text
    ),
    chr(30) order by id
  ), '')) into v_db_fingerprint_after
  from public.sme_demandas
  where id <= v_db_max_id;

  select md5(coalesce(string_agg(
    concat_ws(chr(31),
      id::text, demanda_id::text, status_novo, setor, comentario,
      coalesce(created_by::text, ''), extract(epoch from created_at)::text
    ),
    chr(30) order by id
  ), '')) into v_historico_fingerprint_after
  from public.sme_historico
  where id <= v_historico_max_id;

  if v_inserted <> p_expected_count
    or v_item_count <> p_expected_count
    or v_linked_count <> p_expected_count
    or v_import_history_count <> p_expected_count
    or v_db_count_after <> v_db_count + p_expected_count
    or v_historico_count_after <> v_historico_count + p_expected_count
    or v_db_fingerprint_after <> v_db_fingerprint
    or v_historico_fingerprint_after <> v_historico_fingerprint
  then
    raise exception 'Reconciliação interna falhou; toda a transação foi cancelada.';
  end if;

  update private.sme_importacoes
  set status = 'concluido',
      created_count = v_inserted,
      completed_at = now()
  where batch_hash = v_batch_hash;

  return jsonb_build_object(
    'status', 'applied',
    'batch_hash', v_batch_hash,
    'client_payload_hash', p_client_payload_hash,
    'source_hash', p_source_hash,
    'created_count', v_inserted,
    'db_count_before', v_db_count,
    'db_count_after', v_db_count_after,
    'historico_count_before', v_historico_count,
    'historico_count_after', v_historico_count_after,
    'preserved_db_fingerprint', v_db_fingerprint_after,
    'preserved_historico_fingerprint', v_historico_fingerprint_after
  );
end;
$$;

revoke all on function public.importar_sme_demandas_lote(
  jsonb, text, text, text, integer, text, text, uuid, boolean
) from public, anon, authenticated;

grant execute on function public.importar_sme_demandas_lote(
  jsonb, text, text, text, integer, text, text, uuid, boolean
) to service_role;

comment on function public.importar_sme_demandas_lote(
  jsonb, text, text, text, integer, text, text, uuid, boolean
) is 'Valida e importa um lote saneado em uma única transação, com hashes, idempotência e trilha privada.';

