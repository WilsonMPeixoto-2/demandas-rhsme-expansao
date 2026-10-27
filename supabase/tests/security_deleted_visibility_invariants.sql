\set ON_ERROR_STOP on

create or replace function pg_temp.assert_true(condition boolean, message text)
returns void
language plpgsql
as $$
begin
  if condition is not true then
    raise exception 'E4: %', message;
  end if;
end;
$$;

create or replace function pg_temp.set_actor(p_user_id uuid)
returns void
language plpgsql
as $set_actor$
begin
  perform set_config('request.jwt.claim.sub', p_user_id::text, true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', p_user_id, 'role', 'authenticated')::text,
    true
  );
end;
$set_actor$;

-- Perfil autenticado, porém inativo, para provar que a proteção vigente permanece.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'e4.inativo@rioeduca.net', '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"nome":"Usuário Inativo E4"}'::jsonb, now(), now()
);

update public.perfis_usuarios
set nome = 'Usuário Inativo E4', nivel = 'leitor', status = 'inativo', setor = 'Consulta'
where id = '44444444-4444-4444-4444-444444444444';

-- Datas do fixture são relativas ao dia da execução para que o gate não quebre com o calendário.\n-- O editor cria duas demandas atribuídas ao administrador e movimenta uma delas.
begin;
set local role authenticated;
select pg_temp.set_actor('22222222-2222-2222-2222-222222222222');
select public.criar_sme_demanda_v2(
  'E4-ATIVA-001', 'Processo', 'Demanda ativa atribuída a colega',
  '11111111-1111-1111-1111-111111111111', 'Nome enviado pelo cliente',
  null, 'nao_informado', '', null, 'nao_informado', '',
  'Analisar documentação recebida', (current_date + 14),
  'Aguardando Andamento', 'CTRH', 'Diversos', ''
);
select public.registrar_andamento_sme_demanda(
  (select id from public.sme_demandas where numero = 'E4-ATIVA-001'),
  'Editor deu continuidade à demanda atribuída ao administrador.',
  'Aguardar complementação documental', (current_date + 19)
);
select public.criar_sme_demanda_v2(
  'E4-EXCLUIDA-001', 'Processo', 'Demanda destinada ao teste da lixeira',
  '11111111-1111-1111-1111-111111111111', 'Outro nome enviado pelo cliente',
  null, 'nao_informado', '', null, 'nao_informado', '',
  'Validar duplicidade identificada', (current_date + 16),
  'Aguardando Andamento', 'CTRH', 'Diversos', ''
);
commit;

create temporary table e4_targets (
  active_id bigint not null,
  deleted_id bigint not null
) on commit preserve rows;
insert into e4_targets (active_id, deleted_id)
select
  max(id) filter (where numero = 'E4-ATIVA-001'),
  max(id) filter (where numero = 'E4-EXCLUIDA-001')
from public.sme_demandas;
grant select on e4_targets to authenticated;

select pg_temp.assert_true(
  exists (
    select 1
    from public.sme_demandas d
    where d.id = (select active_id from e4_targets)
      and d.responsavel_id = '11111111-1111-1111-1111-111111111111'
      and d.responsavel = 'Administrador Ciclo 4'
      and d.updated_by = '22222222-2222-2222-2222-222222222222'
  ),
  'a movimentação por colega alterou o responsável ou não registrou o editor como último ator'
);
select pg_temp.assert_true(
  exists (
    select 1
    from public.sme_historico h
    where h.demanda_id = (select active_id from e4_targets)
      and h.tipo_evento = 'andamento'
      and h.created_by = '22222222-2222-2222-2222-222222222222'
  ),
  'o andamento não registrou o editor que efetivamente praticou a ação'
);

-- Leitor continua sem poder movimentar a demanda, mesmo conhecendo o seu identificador.
begin;
set local role authenticated;
select pg_temp.set_actor('33333333-3333-3333-3333-333333333333');
do $$
declare
  v_denied boolean := false;
begin
  begin
    perform public.registrar_andamento_sme_demanda(
      (select active_id from e4_targets),
      'Tentativa de andamento pelo leitor deve ser recusada.',
      'Ação que não pode ser persistida', (current_date + 24)
    );
  exception when others then
    if sqlerrm like 'Acesso negado:%' then
      v_denied := true;
    else
      raise;
    end if;
  end;
  if not v_denied then
    raise exception 'E4: leitor conseguiu movimentar uma demanda';
  end if;
end;
$$;
rollback;

-- O administrador exclui logicamente a segunda demanda.
begin;
set local role authenticated;
select pg_temp.set_actor('11111111-1111-1111-1111-111111111111');
select public.excluir_sme_demanda(
  (select deleted_id from e4_targets),
  'Registro sintético duplicado para validar a lixeira'
);
commit;

-- Leitor ativo vê a demanda ativa, mas não a excluída nem o histórico excluído.
begin;
set local role authenticated;
select pg_temp.set_actor('33333333-3333-3333-3333-333333333333');
select pg_temp.assert_true(
  (select count(*) = 1 from public.sme_demandas where id = (select active_id from e4_targets)),
  'leitor deixou de consultar uma demanda ativa'
);
select pg_temp.assert_true(
  (select count(*) >= 2 from public.sme_historico where demanda_id = (select active_id from e4_targets)),
  'leitor deixou de consultar o histórico de uma demanda ativa'
);
select pg_temp.assert_true(
  (select count(*) = 0 from public.sme_demandas where id = (select deleted_id from e4_targets)),
  'leitor consultou uma demanda excluída'
);
select pg_temp.assert_true(
  (select count(*) = 0 from public.sme_historico where demanda_id = (select deleted_id from e4_targets)),
  'leitor consultou o histórico de uma demanda excluída'
);
rollback;

-- Editor ativo possui a mesma proteção de leitura da lixeira.
begin;
set local role authenticated;
select pg_temp.set_actor('22222222-2222-2222-2222-222222222222');
select pg_temp.assert_true(
  (select count(*) = 1 from public.sme_demandas where id = (select active_id from e4_targets)),
  'editor deixou de consultar uma demanda ativa'
);
select pg_temp.assert_true(
  (select count(*) >= 2 from public.sme_historico where demanda_id = (select active_id from e4_targets)),
  'editor deixou de consultar o histórico de uma demanda ativa'
);
select pg_temp.assert_true(
  (select count(*) = 0 from public.sme_demandas where id = (select deleted_id from e4_targets)),
  'editor consultou uma demanda excluída'
);
select pg_temp.assert_true(
  (select count(*) = 0 from public.sme_historico where demanda_id = (select deleted_id from e4_targets)),
  'editor consultou o histórico de uma demanda excluída'
);
rollback;

-- Perfil inativo não consulta nem demanda ativa nem o seu histórico.
begin;
set local role authenticated;
select pg_temp.set_actor('44444444-4444-4444-4444-444444444444');
select pg_temp.assert_true(
  (select count(*) = 0 from public.sme_demandas where id = (select active_id from e4_targets)),
  'perfil inativo consultou uma demanda ativa'
);
select pg_temp.assert_true(
  (select count(*) = 0 from public.sme_historico where demanda_id = (select active_id from e4_targets)),
  'perfil inativo consultou o histórico de uma demanda ativa'
);
rollback;

-- Administrador ativo conserva acesso de auditoria à demanda e ao histórico excluídos.
begin;
set local role authenticated;
select pg_temp.set_actor('11111111-1111-1111-1111-111111111111');
select pg_temp.assert_true(
  (select count(*) = 1 from public.sme_demandas where id = (select deleted_id from e4_targets)),
  'administrador não consultou a demanda excluída'
);
select pg_temp.assert_true(
  (select count(*) >= 2 from public.sme_historico where demanda_id = (select deleted_id from e4_targets)),
  'administrador não consultou a trilha completa da demanda excluída'
);
rollback;

-- O cliente autenticado não pode substituir diretamente o ator real por outro usuário.
begin;
set local role authenticated;
select pg_temp.set_actor('22222222-2222-2222-2222-222222222222');
do $$
declare
  v_denied boolean := false;
begin
  begin
    update public.sme_demandas
    set updated_by = '11111111-1111-1111-1111-111111111111'
    where id = (select active_id from e4_targets);
  exception when sqlstate '42501' then
    v_denied := true;
  end;
  if not v_denied then
    raise exception 'E4: cliente autenticado conseguiu escolher outro ator diretamente';
  end if;
end;
$$;
rollback;

-- Sem sessão pessoal, o gatilho deve preservar um ator já validado pela rotina administrativa.
begin;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}'::text, true);
select pg_temp.assert_true(
  exists (
    select 1 from public.perfis_usuarios
    where id = '11111111-1111-1111-1111-111111111111'
      and nivel = 'administrador' and status = 'ativo'
  ),
  'ator administrativo sintético não é um administrador ativo válido'
);
update public.sme_demandas
set
  assunto = assunto,
  updated_by = '11111111-1111-1111-1111-111111111111'
where id = (select active_id from e4_targets);
select pg_temp.assert_true(
  (select updated_by = '11111111-1111-1111-1111-111111111111'
   from public.sme_demandas where id = (select active_id from e4_targets)),
  'gatilho apagou o ator previamente validado da rotina administrativa'
);
rollback;

-- A migration não pode inventar autoria para registros legados desconhecidos.
select pg_temp.assert_true(
  exists (
    select 1 from public.sme_demandas
    where numero = 'LEGADO-C3-002' and updated_by is null
  ),
  'a migration preencheu autoria desconhecida da demanda legada'
);
select pg_temp.assert_true(
  exists (
    select 1
    from public.sme_historico h
    join public.sme_demandas d on d.id = h.demanda_id
    where d.numero = 'LEGADO-C3-002'
      and h.comentario = 'Criação legada'
      and h.created_by is null
  ),
  'a migration preencheu autoria desconhecida do histórico legado'
);

select 'E4 homologado: lixeira protegida, colaboração preservada e autoria fiel' as resultado;
