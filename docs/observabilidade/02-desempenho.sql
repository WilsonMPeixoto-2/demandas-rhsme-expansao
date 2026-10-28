-- CTRH | Caderno 02 | Desempenho PostgreSQL — read-only
-- Estatísticas cumulativas; não confundir com tempo de carregamento do site.
SELECT NOW() AS verificado_em, relname AS tabela,
  seq_scan AS leituras_sequenciais, idx_scan AS leituras_por_indice,
  n_live_tup AS estimativa_registros, n_dead_tup AS estimativa_tuplas_obsoletas,
  last_autoanalyze AS ultimo_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname='public'
  AND relname IN ('sme_demandas','sme_historico','perfis_usuarios')
ORDER BY relname;

-- Exibe somente queryid e métricas agregadas; não traz texto de SQL.
-- Inclui operações internas do Supabase.
SELECT queryid, calls AS execucoes,
  ROUND(total_exec_time::numeric,2) AS tempo_total_ms,
  ROUND(mean_exec_time::numeric,2) AS tempo_medio_ms,
  ROUND(max_exec_time::numeric,2) AS tempo_maximo_ms,
  rows AS linhas_processadas
FROM pg_stat_statements
WHERE calls>=2
ORDER BY total_exec_time DESC LIMIT 15;
