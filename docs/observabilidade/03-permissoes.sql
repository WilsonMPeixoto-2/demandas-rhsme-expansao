-- CTRH | Caderno 03 | Segurança RLS e permissões — read-only
SELECT c.relname AS tabela, c.relrowsecurity AS rls_ativo,
  c.relforcerowsecurity AS rls_forcado,
  (SELECT COUNT(*) FROM pg_policies p
   WHERE p.schemaname=n.nspname AND p.tablename=c.relname) AS politicas_cadastradas
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','p')
  AND c.relname IN ('sme_demandas','sme_historico','perfis_usuarios')
ORDER BY 1;

SELECT p.proname AS funcao, p.prosecdef AS security_definer,
  HAS_FUNCTION_PRIVILEGE('anon',p.oid,'EXECUTE') AS anon_executa,
  HAS_FUNCTION_PRIVILEGE('authenticated',p.oid,'EXECUTE') AS autenticado_executa
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public'
  AND (p.proname LIKE '%sme_demanda%' OR p.proname IN ('is_admin','is_active'))
ORDER BY 1;
-- Não modificar SECURITY DEFINER nem privilégios sem inspecionar a função e os Advisors.
