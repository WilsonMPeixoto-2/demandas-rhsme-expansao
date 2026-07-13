# Handoff Operacional — Central de Demandas CTRH SME

Atualizado em: 2026-07-13 (Homologação do Gate 0 Concluída com Sucesso)

---

## 📌 Norte Operacional e Status

Toda a infraestrutura visual, design system editorial, fluxo estático e integração Supabase endurecida e segura estão **100% entregues, testados e verdes**.

*   **URL de Produção**: [demandas-rhsme-nine.vercel.app](https://demandas-rhsme-nine.vercel.app)
*   **Repositório GitHub**: [github.com/WilsonMPeixoto-2/demandas-rhsme-expansao](https://github.com/WilsonMPeixoto-2/demandas-rhsme-expansao)

---

## 🛠️ Entregas Realizadas no Gate 0

### 1. Hardening do Banco de Dados e RPCs
* RPCs `criar_sme_demanda` e `atualizar_status_sme_demanda` migradas para `security definer` com validação de editor (`private.can_edit()`).
* Criação de trigger no Postgres `perfis_usuarios_prevent_admin_self_block` para impedir que o último administrador ativo se bloqueie ou seja rebaixado.
* Correção no provisionador `bootstrap-supabase.mjs` para evitar reset acidental de senhas.

### 2. Robustez do Repositório Local e Interface
* `localDemandasRepository.ts` não apaga mais a base local caso esta caia abaixo de 20 registros, e trata adequadamente erros de parse de JSON corrompido com fallback seguro.
* O logout em `App.tsx` limpa completamente abas, filtros e modais, evitando vazamento de dados.
* Propagação da propriedade `canEdit` (perfil leitor) ocultando botões de escrita (Nova demanda, Editar, Status, Excluir) no Header, Tabela de Demandas e Drawer lateral.
* Exibição explícita de banner de erros e skeletons/loaders durante o carregamento de dados.

### 3. Ajustes de UX e Segurança adicionais
* Prevenção contra CSV Injection na exportação e substituição do delimitador para `;` com a instrução `sep=;` na primeira linha.
* Correção da máscara no `DateMaskInput.tsx` para não forçar string `"dd/mm/aaaa"` no pai se o usuário não interagir, adicionando suporte inteligente para colagem (`onPaste`).

### 4. Validação da Suíte de Testes
* Suíte de testes automatizados unitários (`vitest`) rodando e passando com 57 testes em verde.
* Build de produção Vite + TypeScript executando com 100% de sucesso.

---

## 🔮 Próximas Etapas

1. Aplicar a migração `20260707000000_sme_demandas.sql` na base do Supabase em produção.
2. Definir as variáveis de ambiente reais do Supabase em produção.
3. Iniciar a homologação real dos servidores SME na base Supabase compartilhada.
