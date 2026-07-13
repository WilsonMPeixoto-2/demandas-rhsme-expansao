import React, { useState, useEffect } from 'react';
import { Demanda } from '../types';
import { getTodayString, isBeforeToday } from '../utils/date';

interface HeaderProps {
  userEmail: string;
  demandas: Demanda[];
  onLogout: () => void;
  onOpenNovo: () => void;
  onExportCSV: () => void;
  filtrosAtivos: {
    status: string;
    quickFilters: {
      assinatura: boolean;
      hoje: boolean;
      vencido: boolean;
    }
  };
  onToggleFiltroStatus: (status: string) => void;
  onToggleQuickFilter: (filtro: 'assinatura' | 'hoje' | 'vencido') => void;
  canEdit?: boolean;
  appMode?: 'local' | 'supabase';
}

export const Header: React.FC<HeaderProps> = ({ 
  userEmail, 
  demandas, 
  onLogout,
  onOpenNovo,
  onExportCSV,
  filtrosAtivos,
  onToggleFiltroStatus,
  onToggleQuickFilter,
  canEdit = true,
  appMode = 'local'
}) => {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Define o timestamp da última atualização (inicialização da sessão)
  useEffect(() => {
    const now = new Date();
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = meses[now.getMonth()];
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    setLastUpdate(`${dia} ${mes} ${ano}, ${horas}:${minutos}`);
  }, [demandas]); // Atualiza o timestamp se houver mudança nas demandas

  const todayStr = getTodayString();

  // Contadores
  const totalAtivos = demandas.filter(d => d.status !== 'Encerrado').length;
  const totalAssinatura = demandas.filter(d => d.status === 'Para Assinatura').length;
  const totalHoje = demandas.filter(d => d.status !== 'Encerrado' && d.limite2 === todayStr).length;
  const totalVencidos = demandas.filter(d => d.status !== 'Encerrado' && d.limite2 && isBeforeToday(d.limite2)).length;

  // Determinar se algum filtro rápido está selecionado
  const isQuickFiltroAtivo = filtrosAtivos.quickFilters.assinatura || filtrosAtivos.quickFilters.hoje || filtrosAtivos.quickFilters.vencido;
  const isCardAtivosSelecionado = filtrosAtivos.status === 'Somente ativos (padrão)' && !isQuickFiltroAtivo;

  // Legenda de Urgência (Contagem de demandas únicas críticas para evitar duplicidade)
  const totalCriticas = demandas.filter(d => 
    d.status !== 'Encerrado' && (
      d.status === 'Para Assinatura' || 
      d.limite2 === todayStr || 
      (d.limite2 && isBeforeToday(d.limite2))
    )
  ).length;
  const legendaCriticas = totalCriticas > 0
    ? `${totalCriticas} ${totalCriticas === 1 ? 'demanda exige' : 'demandas exigem'} providência imediata.`
    : 'Todas as demandas de prazo crítico estão em dia.';

  return (
    <header className="header-container">
      {/* 1. Faixa Institucional Compacta (De ponta a ponta na janela) */}
      <div className="institucional-bar">
        <div className="inst-left">
          <span className="inst-orgao">CTRH • Secretaria Municipal de Educação</span>
          <span className="inst-separador">|</span>
          <span className="inst-sub">Sistema interno de acompanhamento</span>
        </div>
        
        <div className="inst-right">
          {/* Usuário Logado */}
          <div className="inst-meta-item inst-user">
            <i className="fa-solid fa-user-circle"></i>
            <span>{userEmail}</span>
          </div>

          {/* Última Atualização */}
          <div className="inst-meta-item inst-timestamp" title="Momento em que os dados locais da sessão do app foram carregados ou recarregados">
            <i className="fa-solid fa-rotate"></i>
            <span>Atualizado: {lastUpdate}</span>
          </div>

          {/* Badge de Ambiente */}
          <div className="inst-badge-ambiente">
            {appMode === 'supabase' ? 'Base Compartilhada — Supabase' : 'Ambiente Local (LocalStorage)'}
          </div>

          {/* Botão Sair */}
          <button 
            type="button"
            className="btn-logout-link" 
            onClick={onLogout} 
            title="Sair do sistema"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* 2. Título Principal da Central de Demandas & Ações Globais */}
      <div className="title-action-row">
        <div className="title-area">
          <h1>Central de Demandas</h1>
          <p className="header-subtitle">
            Acompanhamento de processos, expedientes, prazos e providências.
          </p>
        </div>
        
        <div className="header-global-actions">
          {/* Ação Secundária: Exportar CSV */}
          <button 
            type="button"
            className="btn btn-secondary-outline" 
            onClick={onExportCSV}
            title="Exportar dados filtrados como arquivo CSV"
          >
            <i className="fa-solid fa-download"></i>
            <span>Exportar CSV</span>
          </button>

          {/* Ação Primária: Nova Demanda */}
          {canEdit && (
            <button 
              type="button"
              className="btn btn-primary btn-nova-demanda-header" 
              onClick={onOpenNovo}
              title="Cadastrar nova demanda"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Nova demanda</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Cards de Indicadores (Estilo Editorial com Frisos Coloridos e Acionáveis) */}
      <div className="stats-grid">
        <button 
          type="button" 
          className={`stat-card total-card ${isCardAtivosSelecionado ? 'active' : ''}`}
          onClick={() => {
            // Se já estiver ativo, não faz nada (permanece em ativos padrão)
            // Caso contrário, ativa o status de ativos e limpa os filtros rápidos
            onToggleFiltroStatus('Somente ativos (padrão)');
          }}
          title="Exibir todas as demandas ativas"
        >
          <div className="stat-info">
            <h3>Demandas Ativas</h3>
            <div className="stat-number">{totalAtivos}</div>
          </div>
        </button>

        <button 
          type="button" 
          className={`stat-card assinatura-card ${filtrosAtivos.quickFilters.assinatura ? 'active' : ''}`}
          onClick={() => onToggleQuickFilter('assinatura')}
          title="Filtrar por demandas aguardando assinatura"
        >
          <div className="stat-info">
            <h3>Para Assinatura</h3>
            <div className="stat-number">{totalAssinatura}</div>
          </div>
        </button>

        <button 
          type="button" 
          className={`stat-card hoje-card ${filtrosAtivos.quickFilters.hoje ? 'active' : ''}`}
          onClick={() => onToggleQuickFilter('hoje')}
          title="Filtrar por demandas que vencem hoje"
        >
          <div className="stat-info">
            <h3>Vencendo Hoje</h3>
            <div className="stat-number">{totalHoje}</div>
          </div>
        </button>

        <button 
          type="button" 
          className={`stat-card vencido-card ${filtrosAtivos.quickFilters.vencido ? 'active' : ''}`}
          onClick={() => onToggleQuickFilter('vencido')}
          title="Filtrar por demandas vencidas em atraso"
        >
          <div className="stat-info">
            <h3>
              Vencidas
              {totalVencidos > 0 && (
                <span 
                  className="dot-vencidas-alert" 
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    marginLeft: '6px',
                    verticalAlign: 'middle'
                  }}
                  title="Há demandas vencidas que exigem atenção imediata"
                />
              )}
            </h3>
            <div className="stat-number">{totalVencidos}</div>
          </div>
        </button>
      </div>

      {/* Legenda Dinâmica de Urgência */}
      <div className="stats-legend">
        <i className="fa-solid fa-circle-info"></i>
        <span>{legendaCriticas}</span>
      </div>
    </header>
  );
};
