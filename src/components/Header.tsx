import React, { useEffect, useState } from 'react';
import { Demanda } from '../types';
import { isInFollowUp } from '../domain/workSemantics';
import type { DemandFilters } from '../filters/filterTypes';
import { DEMANDAS_QUERY_RETRY_EVENT } from '../query/queryEvents';
import { getTodayString, isBeforeToday } from '../utils/date';
import { BrandLogo } from './BrandLogo';

type ConnectionStatus = 'online' | 'connecting' | 'offline' | 'local';
type HeaderArea = 'visao-geral' | 'demandas' | 'minhas-demandas' | 'admin';

const HEADER_AREA: Record<HeaderArea, { title: string; description: string; icon: string }> = {
  'visao-geral': { title: 'Radar de Governança',
    description: 'Visão estratégica do fluxo de trabalho, com análise de dados e monitoramento da carteira de demandas.',
    icon: 'fa-compass' },
  demandas: { title: 'Carteira da equipe',
    description: 'Consulte as demandas, filtre os processos e registre os acompanhamentos necessários.',
    icon: 'fa-list-check' },
  'minhas-demandas': { title: 'Carteira pessoal',
    description: 'Acompanhe os processos atribuídos a você, seus prazos e próximas providências.',
    icon: 'fa-folder-open' },
  admin: { title: 'Gestão de acessos',
    description: 'Administre os perfis e consulte os registros de auditoria disponíveis.',
    icon: 'fa-users-gear' },
};

const CONNECTION_STATUS_PRESENTATION: Record<ConnectionStatus, { label: string; icon: string }> = {
  online: { label: 'Sistema online', icon: 'fa-circle-check' },
  connecting: { label: 'Sincronizando…', icon: 'fa-arrows-rotate fa-spin' },
  offline: { label: 'Conexão indisponível', icon: 'fa-triangle-exclamation' },
  local: { label: 'Modo de demonstração', icon: 'fa-flask' },
};

interface HeaderProps {
  activeArea?: HeaderArea;
  userEmail: string;
  demandas: Demanda[];
  onLogout: () => void;
  onOpenNovo: () => void;
  onExportExcel: () => void;
  onOpenMinhasDemandas: () => void;
  personalWorkspaceActive: boolean;
  exportingExcel?: boolean;
  filtrosAtivos: {
    status: DemandFilters['status'];
    quickFilters: {
      assinatura: boolean;
      hoje: boolean;
      vencido: boolean;
    };
  };
  onToggleFiltroStatus: (status: DemandFilters['status']) => void;
  onToggleQuickFilter: (filtro: 'assinatura' | 'hoje' | 'vencido') => void;
  canEdit?: boolean;
  connectionStatus?: ConnectionStatus;
}

export const Header: React.FC<HeaderProps> = ({
  activeArea = 'visao-geral',
  userEmail,
  demandas,
  onLogout,
  onOpenNovo,
  onExportExcel,
  onOpenMinhasDemandas,
  personalWorkspaceActive,
  exportingExcel = false,
  filtrosAtivos,
  onToggleFiltroStatus,
  onToggleQuickFilter,
  canEdit = true,
  connectionStatus = 'local',
}) => {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = meses[now.getMonth()];
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    setLastUpdate(`${dia} ${mes} ${ano}, ${horas}:${minutos}`);
  }, [demandas]);

  const todayStr = getTodayString();
  const totalEmAcompanhamento = demandas.filter(isInFollowUp).length;
  const totalAssinatura = demandas.filter((demanda) => demanda.status === 'Para Assinatura').length;
  const totalHoje = demandas.filter((demanda) => isInFollowUp(demanda) && demanda.limite2 === todayStr).length;
  const totalVencidos = demandas.filter(
    (demanda) => isInFollowUp(demanda) && demanda.limite2 && isBeforeToday(demanda.limite2),
  ).length;

  const isQuickFiltroAtivo = filtrosAtivos.quickFilters.assinatura
    || filtrosAtivos.quickFilters.hoje
    || filtrosAtivos.quickFilters.vencido;
  const isCardAtivosSelecionado = filtrosAtivos.status === 'acompanhamento' && !isQuickFiltroAtivo;

  const totalCriticas = demandas.filter((demanda) => (
    isInFollowUp(demanda) && (
      demanda.status === 'Para Assinatura'
      || demanda.limite2 === todayStr
      || (demanda.limite2 && isBeforeToday(demanda.limite2))
    )
  )).length;
  const legendaCriticas = totalCriticas > 0
    ? `${totalCriticas} ${totalCriticas === 1 ? 'demanda exige' : 'demandas exigem'} providência imediata.`
    : 'Todas as demandas de prazo final crítico estão em dia.';
  const connectionPresentation = CONNECTION_STATUS_PRESENTATION[connectionStatus];
  const activeAreaPresentation = HEADER_AREA[activeArea];

  return (
    <header className={`header-container ${activeArea === 'visao-geral' ? 'ct-header-dashboard' : 'ct-header-workspace'}`}>
      <div className="institucional-bar">
        <div className="inst-left header-brand-row">
          <BrandLogo variant="full" />
        </div>

        <div className="inst-right">
          <div className="inst-meta-item inst-user">
            <i className="fa-solid fa-user-circle" aria-hidden="true" />
            <span>{userEmail}</span>
          </div>

          <div
            className="inst-meta-item inst-timestamp"
            title="Momento em que os dados exibidos foram carregados ou atualizados"
          >
            <i className="fa-solid fa-rotate" aria-hidden="true" />
            <span>Atualizado: {lastUpdate}</span>
          </div>

          <div
            className={`inst-badge-ambiente status-${connectionStatus}`}
            role="status"
            aria-live="polite"
            title="Estado operacional atual do sistema"
          >
            <i className={`fa-solid ${connectionPresentation.icon}`} aria-hidden="true" />
            <span>{connectionPresentation.label}</span>
          </div>

          {connectionStatus === 'offline' && (
            <button
              type="button"
              className="btn-logout-link"
              onClick={() => window.dispatchEvent(new Event(DEMANDAS_QUERY_RETRY_EVENT))}
              title="Tentar carregar os dados novamente"
            >
              <i className="fa-solid fa-rotate" aria-hidden="true" />
              <span>Tentar novamente</span>
            </button>
          )}

          <button
            type="button"
            className="btn-logout-link"
            onClick={onLogout}
            title="Sair do sistema"
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="title-action-row">
        <div className="title-area governance-header-identity">
          <div className="governance-header-mark" aria-hidden="true">
            <i className={`fa-solid ${activeAreaPresentation.icon}`} />
          </div>
          <div className="governance-header-copy">
            <h1>{activeAreaPresentation.title}</h1>
            <p className="header-subtitle">{activeAreaPresentation.description}</p>
          </div>
        </div>

        <div className="header-global-actions">
          <button
            type="button"
            className="btn btn-export-excel"
            onClick={onExportExcel}
            disabled={exportingExcel}
            aria-busy={exportingExcel}
            title="Exportar os dados filtrados em um relatório Excel analítico"
          >
            <i
              className={`fa-solid ${exportingExcel ? 'fa-spinner fa-spin' : 'fa-file-excel'}`}
              aria-hidden="true"
            />
            <span>{exportingExcel ? 'Gerando Excel…' : 'Exportar Excel'}</span>
          </button>

          {canEdit && (
            <button
              type="button"
              className="btn btn-primary btn-nova-demanda-header"
              onClick={onOpenNovo}
              title="Cadastrar nova demanda"
            >
              <i className="fa-solid fa-plus" aria-hidden="true" />
              <span>Nova demanda</span>
            </button>
          )}
        </div>
      </div>

      {activeArea !== 'admin' && (
        <>
      <div className="stats-grid">
        <button
          type="button"
          className={`stat-card total-card ${isCardAtivosSelecionado ? 'active' : ''}`}
          onClick={() => onToggleFiltroStatus('acompanhamento')}
          title="Exibir todas as demandas em acompanhamento"
        >
          <span className="stat-card-decor" aria-hidden="true"><i className="fa-solid fa-layer-group" /></span>
          <div className="stat-info">
            <h3>Em acompanhamento</h3>
            <div className="stat-number">{totalEmAcompanhamento}</div>
            <span className="stat-card-footer">Ver carteira em acompanhamento <i className="fa-solid fa-arrow-right" aria-hidden="true" /></span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card assinatura-card ${filtrosAtivos.quickFilters.assinatura ? 'active' : ''}`}
          onClick={() => onToggleQuickFilter('assinatura')}
          title="Filtrar por demandas aguardando assinatura"
        >
          <span className="stat-card-decor" aria-hidden="true"><i className="fa-solid fa-file-signature" /></span>
          <div className="stat-info">
            <h3>Para Assinatura</h3>
            <div className="stat-number">{totalAssinatura}</div>
            <span className="stat-card-footer">Abrir itens para assinatura <i className="fa-solid fa-arrow-right" aria-hidden="true" /></span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card hoje-card ${filtrosAtivos.quickFilters.hoje ? 'active' : ''}`}
          onClick={() => onToggleQuickFilter('hoje')}
          title="Filtrar por demandas cujo prazo final vence hoje"
        >
          <span className="stat-card-decor" aria-hidden="true"><i className="fa-solid fa-calendar-day" /></span>
          <div className="stat-info">
            <h3>Prazo final hoje</h3>
            <div className="stat-number">{totalHoje}</div>
            <span className="stat-card-footer">Consultar vencimentos do dia <i className="fa-solid fa-arrow-right" aria-hidden="true" /></span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card vencido-card ${filtrosAtivos.quickFilters.vencido ? 'active' : ''}`}
          onClick={() => onToggleQuickFilter('vencido')}
          title="Filtrar por demandas com prazo final vencido"
        >
          <span className="stat-card-decor" aria-hidden="true"><i className="fa-solid fa-triangle-exclamation" /></span>
          <div className="stat-info">
            <h3>Prazo final vencido</h3>
            <div className="stat-number">{totalVencidos}</div>
            <span className="stat-card-footer">Ver prazos vencidos <i className="fa-solid fa-arrow-right" aria-hidden="true" /></span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card personal-workspace-card ${personalWorkspaceActive ? 'active' : ''}`}
          onClick={onOpenMinhasDemandas}
          aria-pressed={personalWorkspaceActive}
          title="Abrir a carteira de processos atribuída a você"
        >
          <span className="personal-workspace-card-icon" aria-hidden="true">
            <i className="fa-solid fa-folder-open" />
          </span>
          <span className="personal-workspace-card-copy">
            <strong>Minhas demandas</strong>
            <small>Acompanhe sua carteira de processos.</small>
          </span>
          <i className="fa-solid fa-arrow-right personal-workspace-card-arrow" aria-hidden="true" />
        </button>
      </div>

      <div className="urgency-legend" role="status" aria-live="polite">
        <i
          className={`fa-solid ${totalCriticas > 0 ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}
          aria-hidden="true"
        />
        <span>{legendaCriticas}</span>
      </div>
        </>
      )}
    </header>
  );
};
