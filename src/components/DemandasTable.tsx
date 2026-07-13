import React, { useState, useEffect } from 'react';
import { Demanda } from '../types';

interface DemandasTableProps {
  demandas: Demanda[];
  onOpenEditar: (demanda: Demanda) => void;
  onOpenStatus: (demanda: Demanda) => void;
  onOpenHistorico: (demanda: Demanda) => void;
  onExcluir: (id: number) => void;
  canEdit?: boolean;
}

export const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  onOpenEditar,
  onOpenStatus,
  onOpenHistorico,
  onExcluir,
  canEdit = true
}) => {
  // Controle de qual linha exibe o dropdown de ações
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Fecha o dropdown se clicar fora de qualquer componente
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveDropdownId(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  // Retorna a classe da linha baseada no status e data limite
  const getRowClass = () => {
    return '';
  };

  // Retorna a classe CSS da badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aguardando Andamento': return 'badge aguardando';
      case 'Tramitado': return 'badge tramitado';
      case 'Para Assinatura': return 'badge assinatura';
      case 'Encerrado': return 'badge encerrado';
      case 'Sobrestado': return 'badge sobrestado';
      case 'Ajustar': return 'badge ajustar';
      default: return 'badge';
    }
  };

  // Lógica para gerar iniciais para o avatar
  const getInitials = (name: string | undefined): string => {
    if (!name) return '—';
    const cleanName = name.trim();
    if (!cleanName || cleanName === '—') return '—';
    
    const parts = cleanName.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '—';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Lógica para formatar e colorir semântica dos prazos
  const getPrazoFinalSemantics = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') {
      return { data: '—', label: null, classe: '' };
    }

    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day);
      
      const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const dataFormatada = `${String(day).padStart(2, '0')} ${meses[month - 1]} ${year}`;

      const today = new Date();
      const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const diffTime = dateObj.getTime() - todayObj.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return {
          data: dataFormatada,
          label: `${absDays} ${absDays === 1 ? 'dia' : 'dias'} em atraso`,
          classe: 'status-atrasado'
        };
      } else if (diffDays === 0) {
        return {
          data: dataFormatada,
          label: 'vence hoje',
          classe: 'status-hoje'
        };
      } else {
        return {
          data: dataFormatada,
          label: `em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`,
          classe: 'status-no-prazo'
        };
      }
    } catch {
      return { data: dateStr, label: null, classe: '' };
    }
  };

  const handleExcluirClick = (id: number, numero: string) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir a demanda do processo nº ${numero}?`);
    if (confirmar) {
      onExcluir(id);
    }
  };

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="demandas-table">
          <thead>
            <tr>
              <th style={{ width: '22%', textAlign: 'left' }}>Processo / Documento</th>
              <th style={{ width: '30%', textAlign: 'left' }}>Assunto</th>
              <th style={{ width: '18%', textAlign: 'left' }}>Responsável</th>
              <th style={{ width: '10%' }}>Prazo Interno</th>
              <th style={{ width: '10%' }}>Prazo Final</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '8%' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {demandas.length > 0 ? (
              demandas.map(d => {
                const prazoFinal = getPrazoFinalSemantics(d.limite2);
                const initials = getInitials(d.responsavel);
                const showAvatar = initials !== '—';

                return (
                  <tr key={d.id} className={getRowClass()}>
                    {/* Processo / Documento (Número, Tipo e Classificação consolidados) */}
                    <td style={{ textAlign: 'left' }}>
                      <div className="processo-identificacao">
                        <button 
                          type="button"
                          className="numero-link" 
                          onClick={() => onOpenEditar(d)}
                          title={`Clique para editar a demanda do processo nº ${d.numero}`}
                        >
                          {d.numero}
                        </button>
                        <div className="processo-metadados">
                          <span>{d.tipo}</span>
                          {d.classificacao && (
                            <>
                              <span className="separador-dot">•</span>
                              <span>{d.classificacao}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Assunto (Alinhado à esquerda e limitado a 2-3 linhas) */}
                    <td className="text-start-cell">
                      <div className="limite-linhas" title={d.assunto}>
                        {d.assunto}
                      </div>
                    </td>
                    
                    {/* Responsável com Avatar e Setor */}
                    <td style={{ textAlign: 'left' }}>
                      <div className="avatar-circle-group">
                        {showAvatar ? (
                          <div className="avatar-circle" title={d.responsavel}>
                            {initials}
                          </div>
                        ) : (
                          <div className="avatar-circle no-avatar">
                            —
                          </div>
                        )}
                        <div className="avatar-info">
                          <span className="avatar-nome">{d.responsavel || 'Não atribuído'}</span>
                          {d.setor && <span className="avatar-setor">{d.setor}</span>}
                        </div>
                      </div>
                    </td>
                    
                    {/* Prazo Interno */}
                    <td>{d.limite1 && d.limite1 !== 'dd/mm/aaaa' ? d.limite1 : '—'}</td>
                    
                    {/* Prazo Final com Semântica */}
                    <td>
                      <div className="prazo-final-container">
                        <span className="prazo-final-data">{prazoFinal.data}</span>
                        {prazoFinal.label && d.status !== 'Encerrado' && (
                          <span className={`prazo-status-label ${prazoFinal.classe}`}>
                            {prazoFinal.label}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td>
                      <span className={getStatusBadgeClass(d.status)}>
                        {d.status}
                      </span>
                    </td>
                    
                    {/* Ações Consolidadas (Botão Abrir + Dropdown Menu) */}
                    <td>
                      <div className="actions-wrapper">
                        <button 
                          type="button"
                          className="btn btn-abrir-tabela"
                          onClick={() => onOpenEditar(d)}
                          title="Abrir demanda"
                        >
                          Abrir
                        </button>
                        
                        <div className="dropdown-container">
                          <button
                            type="button"
                            className={`btn-ellipsis ${activeDropdownId === d.id ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation(); // Evita fechamento imediato pelo clique global
                              setActiveDropdownId(activeDropdownId === d.id ? null : d.id);
                            }}
                            title="Mais ações"
                            aria-label={`Mais ações da demanda ${d.numero}`}
                            aria-expanded={activeDropdownId === d.id}
                            aria-haspopup="menu"
                            aria-controls={`menu-acoes-${d.id}`}
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          
                          {activeDropdownId === d.id && (
                            <div className="dropdown-menu" id={`menu-acoes-${d.id}`} role="menu">
                              {canEdit && (
                                <button 
                                  type="button" 
                                  className="dropdown-item"
                                  onClick={() => onOpenStatus(d)}
                                >
                                  <i className="fa-solid fa-rotate-left"></i>
                                  <span>Alterar status</span>
                                </button>
                              )}
                              {canEdit && (
                                <button 
                                  type="button" 
                                  className="dropdown-item"
                                  onClick={() => onOpenEditar(d)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                  <span>Editar</span>
                                </button>
                              )}
                              <button 
                                type="button" 
                                className="dropdown-item"
                                onClick={() => onOpenHistorico(d)}
                              >
                                <i className="fa-solid fa-clock-rotate-left"></i>
                                <span>Histórico</span>
                              </button>
                              {canEdit && (
                                <>
                                  <div className="dropdown-divider"></div>
                                  <button 
                                    type="button" 
                                    className="dropdown-item delete-item"
                                    onClick={() => handleExcluirClick(d.id, d.numero)}
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                    <span>Excluir</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '30px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Nenhuma demanda encontrada para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
