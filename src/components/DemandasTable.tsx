import React, { useState, useEffect } from 'react';
import { Demanda } from '../types';
import { getPrazoFinalSemantics } from '../utils/date';

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
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

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

  const getInitials = (name: string | undefined): string => {
    if (!name) return '—';
    const cleanName = name.trim();
    if (!cleanName || cleanName === '—') return '—';
    
    const parts = cleanName.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '—';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
                  <tr key={d.id}>
                    {/* Processo / Documento (Número, Tipo e Classificação consolidados) */}
                    <td style={{ textAlign: 'left' }}>
                      <div className="processo-identificacao">
                        <button 
                          type="button"
                          className="numero-link" 
                          onClick={() => onOpenEditar(d)}
                          title={canEdit ? `Clique para editar a demanda do processo nº ${d.numero}` : `Abrir detalhes do processo nº ${d.numero}`}
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
                          title={canEdit ? "Editar demanda" : "Abrir detalhes da demanda"}
                        >
                          {canEdit ? "Editar" : "Abrir"}
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
                                  role="menuitem"
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
                                  role="menuitem"
                                  onClick={() => onOpenEditar(d)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                  <span>Editar</span>
                                </button>
                              )}
                              <button 
                                type="button" 
                                className="dropdown-item"
                                role="menuitem"
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
                                    role="menuitem"
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
