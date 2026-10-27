-- R5-1 — a lixeira permanece consultável por administradores, mas a restauração
-- não integra o produto. A função é preservada apenas para recuperação técnica
-- excepcional pelo proprietário do banco, sem grants para papéis da API.

revoke all on function public.restaurar_sme_demanda(bigint, text)
from public, anon, authenticated, service_role;

comment on function public.restaurar_sme_demanda(bigint, text) is
  'Recuperação técnica excepcional. Não integra o produto e não possui grants para papéis de API.';
