-- CTRH | Caderno 04 | Histórico e estoque — read-only
-- Eventos legados incluem reatribuições em lote; não representam produtividade.
SELECT DATE_TRUNC('month',created_at AT TIME ZONE 'America/Sao_Paulo')::date AS mes,
  tipo_evento, COUNT(*) AS eventos
FROM public.sme_historico
GROUP BY 1,2 ORDER BY 1 DESC,2 LIMIT 72;

SELECT status, COUNT(*) AS quantidade
FROM public.sme_demandas
WHERE deleted_at IS NULL
GROUP BY status ORDER BY quantidade DESC,status;
