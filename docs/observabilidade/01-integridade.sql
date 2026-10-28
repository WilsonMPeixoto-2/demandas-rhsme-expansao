-- CTRH | Caderno 01 | Integridade e completude — read-only
-- Apenas números agregados, sem nomes, e-mails ou identificação de processos.
SELECT NOW() AS verificado_em,
  COUNT(*) FILTER (WHERE deleted_at IS NULL) AS demandas_ativas,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) AS demandas_excluidas_logicamente,
  COUNT(*) FILTER (WHERE deleted_at IS NULL AND responsavel_id IS NULL) AS sem_responsavel,
  COUNT(*) FILTER (WHERE deleted_at IS NULL AND limite2_situacao='definido' AND limite2 IS NOT NULL) AS prazo_final_definido,
  COUNT(*) FILTER (WHERE deleted_at IS NULL AND proxima_acao_em IS NOT NULL AND NULLIF(BTRIM(proxima_acao),'') IS NOT NULL) AS proxima_providencia_completa,
  COUNT(*) FILTER (WHERE deleted_at IS NULL AND NULLIF(BTRIM(link_origem),'') IS NOT NULL) AS vinculo_processo_oficial,
  MAX(updated_at) AS ultima_atualizacao_cadastral
FROM public.sme_demandas;

SELECT
  (SELECT COUNT(*) FROM public.sme_historico h
   LEFT JOIN public.sme_demandas d ON d.id=h.demanda_id WHERE d.id IS NULL) AS eventos_sem_demanda,
  (SELECT COUNT(*) FROM public.sme_demandas d
   LEFT JOIN public.perfis_usuarios p ON p.id=d.responsavel_id
   WHERE d.deleted_at IS NULL AND d.responsavel_id IS NOT NULL AND p.id IS NULL) AS responsaveis_inexistentes,
  (SELECT COUNT(*) FROM (
    SELECT REGEXP_REPLACE(UPPER(numero),'[^A-Z0-9]','','g') AS processo
    FROM public.sme_demandas WHERE deleted_at IS NULL
    GROUP BY 1 HAVING COUNT(*)>1
  ) t) AS grupos_com_numero_duplicado;
